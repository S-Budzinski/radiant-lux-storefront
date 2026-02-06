/**
 * Run with: node prisma/seed.js
 * Make sure DATABASE_URL is set.
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      sku: 'MASKA-RADIANTE',
      name: 'Maska LED Radianté',
      description: 'Maska hamująca starzenie się. Kuracja światłem czerwonym',
      price: 89.99,
      image: '',
    },
    {
       sku: 'MASKA-RADIANTE-2PAK',
      name: '2x Maska LED Radianté ',
      description: 'Maska hamująca starzenie się. Kuracja światłem czerwonym',
      price: 89.99,
      image: '',
    },
    {
      sku: 'MASKA-RADIANTE-3PAK',
      name: '3x Maska LED Radianté',
      description: 'Maska hamująca starzenie się. Kuracja światłem czerwonym',
      price: 89.99,
      image: '',
    }
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: p,
      create: p
    });
  }
  console.log('Seed finished');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
