import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Trash2 } from "lucide-react";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
  }, []);

  const removeItem = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event("storage")); // Refresh header logic
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.map(i => ({ id: i.id, quantity: i.quantity })) })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
      alert("Błąd połączenia z płatnościami.");
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) return <div className="py-20 text-center">Twój koszyk jest pusty.</div>;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold">Twój koszyk</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <Card key={item.id} className="flex items-center justify-between p-4">
               <div className="flex items-center gap-4">
                 <img src={item.image} alt={item.name} className="h-16 w-16 rounded object-cover" />
                 <div>
                   <h3 className="font-semibold">{item.name}</h3>
                   <p className="text-sm text-muted-foreground">{item.quantity} x {(item.price / 100).toFixed(2)} zł</p>
                 </div>
               </div>
               <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                 <Trash2 className="h-5 w-5 text-red-500" />
               </Button>
            </Card>
          ))}
        </div>
        <div>
          <Card>
            <CardHeader><CardTitle>Podsumowanie</CardTitle></CardHeader>
            <CardContent>
              <div className="flex justify-between text-lg font-bold">
                <span>Razem:</span>
                <span>{(total / 100).toFixed(2)} zł</span>
              </div>
            </CardContent>
            <Separator className="my-4" />
            <CardFooter>
              <Button className="w-full" size="lg" onClick={handleCheckout} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Przejdź do płatności
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}