import Stripe from 'stripe';
import { sql } from '@vercel/postgres';
import { sendOrderEmails } from './mailer.js'; // <--- 1. Import funkcji mailera

export const config = { api: { bodyParser: false } };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

export default async function handler(req: any, res: any) {
  const sig = req.headers['stripe-signature'];
  const body = await buffer(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent: any = event.data.object;
    const orderId = intent.metadata.orderId;

    try {
      // 2. Aktualizacja statusu i pobranie danych (RETURNING *)
      const { rows } = await sql`
        UPDATE orders
        SET status = 'paid'
        WHERE id = ${orderId}
        RETURNING *;
      `;

      // 3. Jeśli mamy zamówienie, wysyłamy maila
      if (rows.length > 0) {
        const order = rows[0];
        
        let parsedItems = [];
        try {
            // Sprawdzamy czy items istnieje, jak nie to pusta tablica
            parsedItems = order.items ? JSON.parse(order.items) : [];
        } catch (e) {
            console.error('Błąd parsowania produktów:', e);
        }

        // Wywołanie Twojego mailera (w try/catch żeby błąd maila nie wywalił webhooka)
        try {
          await sendOrderEmails({
            orderId: order.id,
            total: order.total,
            customerEmail: order.email,
            firstName: order.imie,
            lastName: order.nazwisko,
            address: order.adres,
            city: order.miasto,
            postalCode: order.kod_pocztowy,
            phone: order.telefon,
            items: parsedItems
          });
          console.log(`Emails sent for order #${orderId}`);
        } catch (emailError) {
          console.error('Failed to send email:', emailError);
          // Nie zwracamy błędu do Stripe, bo płatność przeszła, a mail to tylko dodatek
        }
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Database update failed' });
    }
  }

  res.json({ received: true });
}

async function buffer(req: any) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks);
}