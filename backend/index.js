require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression'); 
// Upewnij się, że masz: npm install compression helmet

const checkoutRoutes = require('./routes/checkout');
const productsRoutes = require('./routes/products');
const webhookRoutes = require('./routes/webhook');

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(compression());

const clientUrl = process.env.CLIENT_URL || '*';
app.use(cors({
  origin: clientUrl,
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true,
}));

// 1. Webhook (PRZED express.json)
app.use('/api/webhook', webhookRoutes);

// 2. Parser JSON
app.use(express.json());

// 3. Trasy
app.use('/api/products', productsRoutes);
app.use('/api', checkoutRoutes);

app.get('/', (req, res) => res.send('Kabu Shop Backend is running on Vercel!'));

// --- ZMIANA DLA VERCEL ---
// Eksportujemy app, zamiast robić app.listen
module.exports = app;
