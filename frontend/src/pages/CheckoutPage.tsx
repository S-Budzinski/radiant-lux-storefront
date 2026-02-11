// s-budzinski/radiant-lux-storefront/frontend/src/pages/CheckoutPage.tsx
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/stripe';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Lock, CreditCard, ArrowLeft, User, Mail, MapPin, Phone } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { cn } from '@/lib/utils';
import StripePaymentForm from '@/components/StripePaymentForm';

const CheckoutPage = () => {
  const { items, getTotalPrice, getTotalSavings } = useCart();
  const [isPaymentStarted, setIsPaymentStarted] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalPrice = getTotalPrice();
  const totalSavings = getTotalSavings();

  if (items.length === 0) {
    return (
      <main className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-card border border-border flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              Brak produktów do opłacenia
            </h1>
            <p className="text-muted-foreground mb-8">
              Dodaj produkty do koszyka, aby kontynuować.
            </p>
            <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-gold font-semibold">
              Przeglądaj produkty
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Imię i nazwisko jest wymagane';
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Podaj poprawny e-mail';
    if (!formData.address) newErrors.address = 'Adres jest wymagany';
    if (!formData.city) newErrors.city = 'Miasto jest wymagane';
    if (!formData.zip) newErrors.zip = 'Kod pocztowy jest wymagany';
    if (!formData.phone) newErrors.phone = 'Numer telefonu jest wymagany';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayClick = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validate()) return;

  const [imie, nazwisko] = formData.name.split(' ');

  const res = await fetch('/api/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: formData.email,
      imie,
      nazwisko,
      adres: formData.address,
      miasto: formData.city,
      kod_pocztowy: formData.zip,
      telefon: formData.phone,
      total: totalPrice,
      items,
    }),
  });

  const data = await res.json();
  setClientSecret(data.clientSecret);
  setIsPaymentStarted(true);
};

const stripeAppearance = {
  theme: 'night' as const, // 'night' to gotowy ciemny motyw od Stripe
  
  variables: {
    colorPrimary: '#d4af37', // Twój złoty kolor (Gold)
    colorBackground: '#1c1c1c', // Ciemne tło (np. charcoal-light)
    colorText: '#ffffff', // Biały tekst
    colorDanger: '#df1b41', // Kolor błędów
    fontFamily: '"Inter", system-ui, sans-serif', // Twoja czcionka
    spacingUnit: '4px',
    borderRadius: '8px',
  },
  
  rules: {
    '.Input': {
      backgroundColor: '#2a2a2a', // Jaśniejsze tło dla pól input
      border: '1px solid #3a3a3a',
      color: '#ffffff',
    },
    '.Input:focus': {
      border: '1px solid #d4af37', // Złota obwódka po kliknięciu
      boxShadow: 'none',
    },
    '.Label': {
      color: '#a1a1aa', // Szary kolor etykiet (muted-foreground)
      fontWeight: '500',
    },
    '.Tab': {
      backgroundColor: '#1c1c1c',
      border: '1px solid #3a3a3a',
    },
    '.Tab--selected': {
      borderColor: '#d4af37',
      color: '#d4af37',
    },
  },
};



  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <Link to="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Wróć do koszyka
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
          Finalizacja zamówienia
        </h1>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left Side: Form or Stripe */}
          <div className="order-2 lg:order-1">
            {!isPaymentStarted ? (
              <div className="card-luxury p-6 md:p-8">
                <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Dane do wysyłki
                </h2>
                <form onSubmit={handlePayClick} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Imię i nazwisko</label>
                    <input
                      type="text"
                      className={cn("w-full bg-charcoal-light border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary", errors.name ? "border-red-500" : "border-border")}
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">E-mail</label>
                      <input
                        type="email"
                        className={cn("w-full bg-charcoal-light border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary", errors.email ? "border-red-500" : "border-border")}
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Telefon</label>
                      <input
                        type="tel"
                        className={cn("w-full bg-charcoal-light border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary", errors.phone ? "border-red-500" : "border-border")}
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Adres</label>
                    <input
                      type="text"
                      className={cn("w-full bg-charcoal-light border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary", errors.address ? "border-red-500" : "border-border")}
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Kod pocztowy</label>
                      <input
                        type="text"
                        className={cn("w-full bg-charcoal-light border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary", errors.zip ? "border-red-500" : "border-border")}
                        value={formData.zip}
                        onChange={(e) => setFormData({...formData, zip: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">Miasto</label>
                      <input
                        type="text"
                        className={cn("w-full bg-charcoal-light border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary", errors.city ? "border-red-500" : "border-border")}
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full mt-6 py-4 rounded-xl btn-gold text-lg font-bold">
                    Przejdź do płatności
                  </button>
                </form>
              </div>
            ) : (
              <div className="card-luxury p-6 md:p-8 animate-slide-in-left">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground">Płatność</h2>
                    <p className="text-sm text-muted-foreground">Bezpieczna płatność przez Stripe</p>
                  </div>
                </div>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-charcoal-light">
                  <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    {clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance, locale: 'pl' }}>
                      <StripePaymentForm />
                    </Elements>
                  )}
                  <p className="text-xs text-muted-foreground">Karta kredytowa, BLIK, Apple Pay, Google Pay</p>
                </div>
                <button onClick={() => setIsPaymentStarted(false)} className="mt-4 text-sm text-primary hover:underline">
                  Edytuj dane dostawy
                </button>
              </div>
            )}
          </div>

          {/* Right Side: Order Summary */}
          <div className="order-1 lg:order-2">
            <div className="card-luxury p-6 md:p-8 sticky top-24">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">Podsumowanie zamówienia</h2>
              <div className="space-y-4 pb-6 border-b border-border">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-charcoal-light overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium text-foreground text-sm">{item.name}</h3>
                          <span className="text-xs text-muted-foreground">Ilość: {item.quantity}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-foreground">{item.price * item.quantity} zł</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="py-4 space-y-2 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Produkty</span>
                  <span className="text-foreground">{totalPrice} zł</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Dostawa</span>
                  <span className="text-success font-medium">GRATIS</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Oszczędzasz</span>
                  <span className="text-success font-medium">-{totalSavings} zł</span>
                </div>
              </div>
              <div className="py-4 flex justify-between items-center">
                <span className="text-lg font-semibold text-foreground">Do zapłaty</span>
                <span className="text-3xl font-bold text-gold">{totalPrice} zł</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;