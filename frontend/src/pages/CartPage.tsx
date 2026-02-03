import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Loader2, ArrowRight } from "lucide-react";

// Typy
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Ładowanie koszyka z LocalStorage przy wejściu
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const newCart = cart.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage"));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // --- INTEGRACJA ZE STRIPE ---
  const handleCheckout = async () => {
    setIsRedirecting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Wysyłamy do backendu tylko ID i ilość
          cartItems: cart.map(item => ({ id: item.id, quantity: item.quantity })),
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Przekierowanie do strony płatności Stripe
        window.location.href = data.url;
      } else {
        console.error("Błąd Stripe:", data.error);
        alert("Wystąpił błąd podczas inicjowania płatności.");
      }
    } catch (error) {
      console.error("Błąd połączenia:", error);
      alert("Nie udało się połączyć z serwerem płatności.");
    } finally {
      setIsRedirecting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Twój koszyk jest pusty</h2>
        <p className="text-gray-500 mb-8">Wybierz jeden z naszych pakietów, aby rozpocząć.</p>
        <Button onClick={() => window.location.href = '/'}>Wróć do sklepu</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Twój koszyk</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista produktów */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.id} className="flex flex-col sm:flex-row items-center p-4 gap-4">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md" />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-500 text-sm">{(item.price / 100).toFixed(2)} zł / szt.</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, -1)}>-</Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, 1)}>+</Button>
              </div>

              <div className="text-right min-w-[100px]">
                <div className="font-bold">{((item.price * item.quantity) / 100).toFixed(2)} zł</div>
              </div>

              <Button variant="ghost" size="icon" className="text-red-500" onClick={() => removeItem(item.id)}>
                <Trash2 className="w-5 h-5" />
              </Button>
            </Card>
          ))}
        </div>

        {/* Podsumowanie */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Podsumowanie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Wartość produktów</span>
                <span>{(totalAmount / 100).toFixed(2)} zł</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Dostawa</span>
                <span className="text-green-600 font-medium">0.00 zł</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Do zapłaty</span>
                <span>{(totalAmount / 100).toFixed(2)} zł</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full py-6 text-lg" 
                onClick={handleCheckout}
                disabled={isRedirecting}
              >
                {isRedirecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Przetwarzanie...
                  </>
                ) : (
                  <>
                    Przejdź do płatności <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-4 flex justify-center gap-2 grayscale opacity-70">
            {/* Tutaj możesz dodać ikony płatności jako SVG lub img jeśli masz */}
            <div className="text-xs text-center text-gray-400">Bezpieczne płatności obsługiwane przez Stripe</div>
          </div>
        </div>
      </div>
    </div>
  );
}