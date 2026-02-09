import Stripe from 'stripe';
import { sql } from '@vercel/postgres';

export const config = { api: { bodyParser: false } };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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
    return res.status(400).send(err.message);
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent: any = event.data.object;
    const orderId = intent.metadata.orderId;

    await sql`
      UPDATE orders
      SET status = 'paid'
      WHERE id = ${orderId}
    `;
  }

  res.json({ received: true });
}

async function buffer(req: any) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks);
}
