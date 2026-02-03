// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: [process.env.FRONTEND_URL, "https://twoja-domena-frontend.vercel.app"]
}));
app.use(express.json());

// 1. Endpoint do pobierania produktów
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Błąd pobierania produktów" });
  }
});

// 2. Endpoint Stripe Checkout
app.post('/api/create-checkout-session', async (req, res) => {
  const { cartItems } = req.body; // Oczekujemy tablicy [{ id, quantity }]

  try {
    // Pobierz produkty z bazy, aby upewnić się, że ceny są poprawne (security)
    const lineItems = await Promise.all(cartItems.map(async (item) => {
      const product = await prisma.product.findUnique({ where: { id: item.id } });
      return {
        price_data: {
          currency: 'pln',
          product_data: {
            name: product.name,
            images: [product.image], // Opcjonalnie pełny URL do obrazka
          },
          unit_amount: product.price,
        },
        quantity: item.quantity,
      };
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'blik'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd tworzenia płatności" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));