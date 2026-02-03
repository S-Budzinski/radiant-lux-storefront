require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const prisma = new PrismaClient();

// 1. Webhook Stripe (Musi być przed express.json i cors dla tej ścieżki)
// UWAGA: Endpoint to /api/webhook
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    // Weryfikacja podpisu - to zabezpiecza przed oszustwami
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Obsługa zdarzenia: płatność zakończona sukcesem
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Aktualizacja statusu zamówienia w bazie
    try {
        await prisma.order.update({
            where: { stripeSession: session.id },
            data: { 
                status: 'paid',
                customerEmail: session.customer_details?.email 
            }
        });
        console.log(`Zamówienie ${session.id} opłacone.`);
    } catch (e) {
        console.error("Błąd aktualizacji bazy:", e);
    }
  }

  res.json({ received: true });
});

// 2. Standardowe Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// 3. Endpoint: Pobierz Produkty
app.get('/api/products', async (req, res) => {
  const products = await prisma.product.findMany();
  res.json(products);
});

// 4. Endpoint: Utwórz sesję płatności
app.post('/api/create-checkout-session', async (req, res) => {
  const { items } = req.body; // [{ id: '...', quantity: 1 }]

  try {
    // Pobierz dane produktów z bazy (bezpieczeństwo ceny)
    const dbProducts = await prisma.product.findMany({
        where: { id: { in: items.map(i => i.id) } }
    });

    const lineItems = items.map(item => {
        const product = dbProducts.find(p => p.id === item.id);
        return {
            price_data: {
                currency: 'pln',
                product_data: { name: product.name, images: [product.image] },
                unit_amount: product.price,
            },
            quantity: item.quantity,
        };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });

    // Zapisz intencję zamówienia w bazie
    await prisma.order.create({
        data: {
            stripeSession: session.id,
            amount: session.amount_total,
            status: 'pending'
        }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));