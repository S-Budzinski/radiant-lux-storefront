import { useEffect, useState } from 'react';
import { useToast } from "@/hooks/use-toast"; // Poprawiona ścieżka z Twojego repo
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, ShoppingCart } from "lucide-react";

// Definicja produktu
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

  useEffect(() => {
    // Pobieranie z backendu (zmienna środowiskowa VITE_API_URL)
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        // Sortujemy rosnąco po cenie: 1-pak, 2-pak, 3-pak
        const sorted = data.sort((a: Product, b: Product) => a.price - b.price);
        setProducts(sorted);
        if (sorted.length > 0) setSelectedId(sorted[1].id); // Domyślnie zaznacz środkowy (dwupak)
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = () => {
    const product = products.find(p => p.id === selectedId);
    if (!product) return;

    // Prosta logika koszyka w localStorage (zgodna z Twoim podejściem "zrobić prosto")
    const currentCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingIndex = currentCart.findIndex((item: any) => item.id === product.id);

    if (existingIndex >= 0) {
      currentCart[existingIndex].quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(currentCart));
    window.dispatchEvent(new Event("storage")); // Powiadamiamy inne komponenty

    toast({
      title: "Dodano do koszyka",
      description: `Wybrano: ${product.name}`,
    });
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;

  const selectedProduct = products.find(p => p.id === selectedId) || products[0];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Zdjęcie */}
        <div className="relative aspect-square overflow-hidden rounded-xl border bg-gray-100">
           {selectedProduct && (
             <img src={selectedProduct.image} alt={selectedProduct.name} className="h-full w-full object-cover transition-transform hover:scale-105" />
           )}
        </div>

        {/* Wybór pakietu */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-4xl font-bold">Radiant Lux Serum</h1>
            <p className="mt-2 text-muted-foreground">Wybierz swoją kurację.</p>
          </div>

          <div className="grid gap-4">
            {products.map((product) => (
              <div 
                key={product.id}
                onClick={() => setSelectedId(product.id)}
                className={`relative flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all hover:border-black ${selectedId === product.id ? 'border-2 border-black bg-accent/50' : 'border-border'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${selectedId === product.id ? 'bg-black text-white' : 'border-gray-400'}`}>
                    {selectedId === product.id && <Check className="h-3 w-3" />}
                  </div>
                  <div>
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-sm text-muted-foreground">{product.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">{(product.price / 100).toFixed(2)} zł</div>
                </div>
              </div>
            ))}
          </div>

          <Button size="lg" className="w-full text-lg" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-5 w-5" /> Dodaj do koszyka - {(selectedProduct?.price / 100).toFixed(2)} zł
          </Button>
        </div>
      </div>
    </div>
  );
}