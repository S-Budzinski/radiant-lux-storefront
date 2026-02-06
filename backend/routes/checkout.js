const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const nodemailer = require('nodemailer'); // <--- NOWOŚĆ
const SHIPPING_COST = 9.90;

// Konfiguracja wysyłki maili (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // Dodaj to, aby naprawić błąd "self-signed certificate"
  tls: {
    rejectUnauthorized: false
  }
});

function toCents(amount) {
  return Math.round(Number(amount) * 100);
}

router.post('/create-checkout-session', async (req, res) => {
  try {
    console.log('[create-checkout-session] Start');
    const { items, customer, successUrl, cancelUrl, promoCode } = req.body;

    if (!items?.length || !customer?.email) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    // 1. Logika rabatowa
    const discountMultiplier = (promoCode === 'XMASKABU10') ? 0.9 : 1.0; 
    const originalTotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
    const totalAmount = Math.round(((originalTotal * discountMultiplier) + SHIPPING_COST) * 100); // W groszach

    // 2. Zapis zamówienia WRAZ Z PRODUKTAMI (OrderItem)
    // Prisma pozwala utworzyć powiązane rekordy w jednym zapytaniu!
    const order = await prisma.order.create({
      data: {
        email: customer.email,
        phone: customer.phone || '',
        firstName: customer.firstName || '',
        lastName: customer.lastName || '',
        address: customer.address || '',
        city: customer.city || '',
        postalCode: customer.postalCode || '',
        totalAmount,
        status: 'pending',
        // <--- TUTAJ JEST KLUCZ DO ZAPISU PRODUKTÓW:
        items: {
          create: items.map(item => ({
            productId: 0, // Jeśli nie masz ID numerycznego produktu w bazie, wpisz 0 lub obsłuż to inaczej
            name: item.name,
            price: item.price, // Cena jednostkowa oryginalna
            quantity: item.quantity
          }))
        }
      },
      include: {
        items: true // Zwróć utworzone zamówienie wraz z produktami
      }
    });

    // 3. Przygotowanie Stripe
    const line_items = items.map(it => {
      const images = (it.image && it.image.startsWith('http')) ? [it.image] : [];
      return {
        price_data: {
          currency: 'pln',
          product_data: { name: it.name, images },
          unit_amount: toCents(it.price * discountMultiplier),
        },
        quantity: it.quantity,
      };
    });

    line_items.push({
      price_data: {
        currency: 'pln',
        product_data: { 
          name: 'Dostawa',
          description: 'Szybka wysyłka'
        },
        unit_amount: toCents(SHIPPING_COST),
      },
      quantity: 1,
    });

    const sessionParams = {
      payment_method_types: ['card', 'blik'],
      mode: 'payment',
      line_items,
      customer_email: customer.email,
      metadata: {
        orderId: order.id.toString(),
        promoCode: promoCode || ''
      },
      success_url: successUrl || (process.env.CLIENT_URL + '/checkout-success?session_id={CHECKOUT_SESSION_ID}'),
      cancel_url: cancelUrl || (process.env.CLIENT_URL + '/cart'),
      locale: 'pl',
      billing_address_collection: 'required',
      allow_promotion_codes: true,
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Aktualizacja ID sesji
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    // 4. WYSYŁKA MAILA (Asynchronicznie - nie blokujemy odpowiedzi)
    // Tworzymy prostą listę produktów HTML
    const productsHtml = items.map(it => `
      <li>${it.name} x ${it.quantity} - ${(it.price * it.quantity).toFixed(2)} zł</li>
    `).join('');

    const mailOptions = {
      from: `"KabuStore" <${process.env.EMAIL_USER}>`,
      to: customer.email,
      subject: `Potwierdzenie zamówienia #${order.id}`,
      html: `
        <h1>Dziękujemy za zamówienie!</h1>
        <p>Cześć ${customer.firstName},</p>
        <p>Otrzymaliśmy Twoje zamówienie o numerze <strong>#${order.id}</strong>.</p>
        <p>Status: <strong>Oczekiwanie na płatność</strong></p>
        <h3>Szczegóły zamówienia:</h3>
        <ul>${productsHtml}</ul>
        <p><strong>Do zapłaty: ${(totalAmount / 100).toFixed(2)} zł</strong></p>
        <p>Wysyłka na adres: ${customer.address}, ${customer.postalCode} ${customer.city}</p>
        <hr>
        <p>Zespół Kabu</p>
      `
    };

    // Próba wysyłki (w logach zobaczysz czy poszło)
    await transporter.sendMail(mailOptions).then(info => {
      console.log('Email sent: ' + info.response);
    }).catch(error => {
      console.error('Email error:', error);
    });

    console.log(`[create-checkout-session] Order #${order.id} created, session: ${session.id}`);
    return res.json({ url: session.url, sessionId: session.id, orderId: order.id });

  } catch (err) {
    console.error('[create-checkout-session] ERROR:', err);
    // ... obsługa błędów bez zmian
    return res.status(500).json({ error: 'Error', details: err.message });
  }
});

module.exports = router;