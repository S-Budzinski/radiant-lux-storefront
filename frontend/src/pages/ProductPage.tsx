import { useEffect, useState } from 'react';
import { useToast } from "@/components/ui/use-toast"; // Upewnij się, że ścieżka jest poprawna
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart"; // Zakładam, że masz context lub hooka do koszyka, jeśli nie - zobacz niżej

// Typ produktu zgodny z bazą danych
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  // Jeśli używasz contextu koszyka (zakładam, że masz go w src/lib/cart.ts lub context)
  // Jeśli nie masz hooka useCart, musisz go stworzyć lub użyć localStorage bezpośrednio.
  // Tutaj zakładam prostą logikę dodawania do localStorage dla przykładu.
  
  const addToCart = (product: Product) => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = existingCart.findIndex((item: any) => item.id === product.id);

    if (existingItemIndex > -1) {
      existingCart[existingItemIndex].quantity += 1;
    } else {
      existingCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    // Wywołaj event, żeby odświeżyć licznik w nagłówku (jeśli taki masz)
    window.dispatchEvent(new Event("storage"));
    
    toast({
      title: "Dodano do koszyka",
      description: `${product.name} jest już w Twoim koszyku.`,
    });
  };

  useEffect(() => {
    // Pobieranie produktów z Twojego nowego backendu
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        // Sortujemy po cenie, żeby mieć kolejność: 1-pak, 2-pak, 3-pak
        const sorted = data.sort((a: Product, b: Product) => a.price - b.price);
        setProducts(sorted);
        if (sorted.length > 0) setSelectedId(sorted[1].id); // Domyślnie zaznacz środkowy (dwupak) - częsta taktyka sprzedażowa
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin h-10 w-10" /></div>;
  }

  const selectedProduct = products.find(p => p.id === selectedId) || products[0];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* LEWA STRONA: Zdjęcie */}
        <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden border">
           {selectedProduct && (
             <img 
               src={selectedProduct.image} 
               alt={selectedProduct.name} 
               className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
             />
           )}
           <div className="absolute top-4 left-4">
             <Badge className="bg-black text-white px-3 py-1">Bestseller</Badge>
           </div>
        </div>

        {/* PRAWA STRONA: Wybór wariantu */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">Radiant Lux Serum</h1>
            <p className="text-lg text-gray-500">
              Rewolucyjna formuła odmładzająca. Wybierz kurację dla siebie.
            </p>
          </div>

          {/* Wybór wariantów */}
          <div className="grid gap-4">
            {products.map((product) => (
              <div 
                key={product.id}
                onClick={() => setSelectedId(product.id)}
                className={`
                  cursor-pointer relative rounded-lg border-2 p-4 flex items-center justify-between transition-all
                  ${selectedId === product.id ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-6 h-6 rounded-full border flex items-center justify-center
                    ${selectedId === product.id ? 'border-black bg-black' : 'border-gray-300'}
                  `}>
                    {selectedId === product.id && <Check className="w-4 h-4 text-white" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold">{(product.price / 100).toFixed(2)} zł</span>
                  {product.id === products[2]?.id && ( // Przykład logiczny: najdroższy pakiet to "Najlepsza opcja"
                     <Badge variant="destructive" className="ml-2 block text-[10px] mt-1">Oszczędzasz 20%</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Podsumowanie i Przycisk */}
          <div className="pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600">Suma:</span>
              <span className="text-3xl font-bold">
                {selectedProduct ? (selectedProduct.price / 100).toFixed(2) : "0.00"} zł
              </span>
            </div>

            <Button 
              size="lg" 
              className="w-full text-lg py-6"
              onClick={() => selectedProduct && addToCart(selectedProduct)}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Dodaj do koszyka
            </Button>
            
            <p className="text-center text-xs text-gray-400 mt-4">
              Darmowa dostawa od 200 zł. 30 dni na zwrot. Płatność Stripe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}