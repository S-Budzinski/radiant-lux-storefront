const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Wyczyść stare dane (opcjonalne, ale zalecane przy zmianie koncepcji)
  await prisma.product.deleteMany({});

  await prisma.product.createMany({
    data: [
      { 
        id: "variant-1",
        name: "Radiant Serum - 1 Opakowanie", 
        description: "Idealne na start. Kuracja na 1 miesiąc.", 
        price: 14900, // 149.00 PLN
        image: "/product-main.png" // Upewnij się, że masz taki plik w frontend/public
      },
      { 
        id: "variant-2",
        name: "Radiant Serum - Dwupak", 
        description: "Zapas na 2 miesiące. Oszczędzasz 10%.", 
        price: 26900, // 269.00 PLN (zamiast 298.00)
        image: "/product-main.png" 
      },
      { 
        id: "variant-3",
        name: "Radiant Serum - Trójpak", 
        description: "Pełna kuracja 3 miesięczna. Najlepsza cena!", 
        price: 39900, // 399.00 PLN (zamiast 447.00)
        image: "/product-main.png" 
      },
    ]
  });
  
  console.log("Dodano 3 warianty produktu do bazy.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());