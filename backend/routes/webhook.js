const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer'); // <--- DODANO

// Konfiguracja mailera (taka sama jak w checkout.js)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: { rejectUnauthorized: false }
});

const ADMIN_EMAIL = 'sbudzinski666@gmail.com';

// Stripe wymaga raw body do walidacji podpisu
router.post('/', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Webhook received:', event.type);

  try {
    // PŁATNOŚĆ ZAKOŃCZONA SUKCESEM
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const metadata = session.metadata || {};
      const orderId = parseInt(metadata.orderId || '0');

      if (orderId) {
        // 1. Zmień status zamówienia w bazie na 'paid'
        const updatedOrder = await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'paid',
            paymentIntentId: session.payment_intent || null
          },
          include: { items: true } // Pobierzemy produkty żeby wpisać je do maila (opcjonalne)
        });

        console.log(`Order #${orderId} marked as paid.`);

        // 2. Generowanie listy produktów (wspólne dla obu maili)
        const productsHtml = updatedOrder.items.map(item => `
          <tr style="border-bottom: 1px solid #ddd;">
            <td style="padding: 8px;">${item.name}</td>
            <td style="padding: 8px; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; text-align: right;">${item.price.toFixed(2)} zł</td>
          </tr>
        `).join('');

        const totalPln = (updatedOrder.totalAmount / 100).toFixed(2);

        // 2. Wyślij maila "Płatność przyjęta"
        const mailOptions = {
          from: `"KabuStore" <${process.env.EMAIL_USER}>`,
          to: session.customer_details?.email || updatedOrder.email,
          subject: `Płatność przyjęta - Zamówienie #${orderId}`,
          html: `
            <div style="font-family: sans-serif; color: #333;">
              <h1 style="color: #16a34a;">Płatność potwierdzona! ✅</h1>
              <p>Dziękujemy, otrzymaliśmy Twoją wpłatę za zamówienie <strong>#${orderId}</strong>.</p>
              <p>Status zamówienia został zmieniony na: <strong>OPŁACONE</strong>.</p>
              <p>Przystępujemy do pakowania Twojej przesyłki.</p>
              <hr style="border: 1px solid #eee; margin: 20px 0;">
              <p>W razie pytań prosimy o kontakt.</p>
              <p><em>Zespół Kabu</em></p>
            </div>
          `
        };
        const adminMailOptions = {
          from: `"System Sklepu" <${process.env.EMAIL_USER}>`,
          to: ADMIN_EMAIL, // Tu wysyłamy na Twój prywatny adres
          subject: `📦 NOWE ZAMÓWIENIE #${orderId} - DO SPAKOWANIA!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; border: 2px solid #000; padding: 20px;">
              <h1 style="color: #d946ef; margin-top: 0;">NOWA SPRZEDAŻ! 💰</h1>
              <p style="font-size: 18px;">Zamówienie nr: <strong>#${orderId}</strong></p>
              <p>Status: <strong style="color: green;">OPŁACONE</strong></p>
              
              <hr style="border: 1px dashed #ccc; margin: 20px 0;">

              <h2 style="background-color: #f3f4f6; padding: 10px;">👤 DANE DO WYSYŁKI:</h2>
              <p style="font-size: 16px; line-height: 1.5;">
                <strong>${updatedOrder.firstName} ${updatedOrder.lastName}</strong><br>
                ${updatedOrder.address}<br>
                ${updatedOrder.postalCode} ${updatedOrder.city}<br>
                <br>
                📞 Telefon: <strong>${updatedOrder.phone}</strong><br>
                📧 Email: ${updatedOrder.email}
              </p>

              <hr style="border: 1px dashed #ccc; margin: 20px 0;">

              <h2 style="background-color: #f3f4f6; padding: 10px;">📦 CO SPAKOWAĆ:</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #eee;">
                    <th style="padding: 10px; text-align: left;">Produkt</th>
                    <th style="padding: 10px; text-align: center;">Ilość</th>
                    <th style="padding: 10px; text-align: right;">Cena szt.</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsHtml}
                </tbody>
              </table>
              
              <p style="text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px;">
                Suma: ${totalPln} zł
              </p>

              <div style="margin-top: 30px; padding: 15px; background-color: #fff7ed; border-left: 4px solid #f97316;">
                <strong>Wskazówka:</strong> Sprawdź adres w systemie kuriera przed wygenerowaniem etykiety.
              </div>
            </div>
          `
        };

         await transporter.sendMail(mailOptions).then(() => {
          console.log(`Payment confirmation email sent to ${mailOptions.to}`);
        }).catch(err => console.error('Email error:', err));

        await transporter.sendMail(adminMailOptions).then(() => {
          console.log(`Payment confirmation email sent to ${adminMailOptions.to}`);
        }).catch(err => console.error('Email error:', err));
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(500).send();
  }
});

module.exports = router;