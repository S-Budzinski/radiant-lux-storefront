import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Lock, CreditCard, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { cn } from '@/lib/utils';

const CheckoutPage = () => {
  const { items, getTotalPrice, getTotalSavings } = useCart();
  const [isPaymentStarted, setIsPaymentStarted] = useState(false);

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
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-gold font-semibold"
            >
              Przeglądaj produkty
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handlePayClick = () => {
    setIsPaymentStarted(true);
  };

  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Wróć do koszyka
        </Link>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
          Checkout
        </h1>

        <div className="relative overflow-hidden">
          <div className="flex transition-all duration-500 ease-out">
            {/* Stripe Payment Section (Left) */}
            <div
              className={cn(
                'w-full lg:w-1/2 flex-shrink-0 transition-all duration-500',
                isPaymentStarted 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-full absolute'
              )}
            >
              {isPaymentStarted && (
                <div className="card-luxury p-6 md:p-8 mr-0 lg:mr-4 animate-slide-in-left h-fit">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl font-semibold text-foreground">
                        Płatność
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Bezpieczna płatność przez Stripe
                      </p>
                    </div>
                  </div>

                  {/* Stripe Embed Placeholder */}
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-charcoal-light">
                    <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">
                      Stripe Payment Embed
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Tu pojawi się formularz płatności Stripe z opcjami:<br />
                      Karta kredytowa, BLIK, Apple Pay, Google Pay
                    </p>
                    
                    {/* Mock payment options */}
                    <div className="mt-6 space-y-3">
                      <div className="p-4 rounded-lg bg-card border border-border flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-foreground" />
                        </div>
                        <span className="text-sm text-foreground">Karta płatnicza</span>
                      </div>
                      <div className="p-4 rounded-lg bg-card border border-border flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                          BLIK
                        </div>
                        <span className="text-sm text-foreground">BLIK</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Section (Center → Right) */}
            <div
              className={cn(
                'w-full flex-shrink-0 transition-all duration-500 ease-out',
                isPaymentStarted 
                  ? 'lg:w-1/2 translate-x-0' 
                  : 'lg:w-full lg:max-w-2xl lg:mx-auto translate-x-0'
              )}
            >
              <div className="card-luxury p-6 md:p-8">
                <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                  Podsumowanie zamówienia
                </h2>

                {/* Items */}
                <div className="space-y-4 pb-6 border-b border-border">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-charcoal-light overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-foreground text-sm">
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              {item.isBundle && (
                                <span className="badge-bundle text-xs">
                                  Bundle {item.bundleSize}×
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                Ilość: {item.quantity}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold text-foreground">
                              {item.price * item.quantity} zł
                            </span>
                            <div className="text-xs text-muted-foreground line-through">
                              {item.originalPrice * item.quantity} zł
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price breakdown */}
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

                {/* Total */}
                <div className="py-4 border-b border-border">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-foreground">Do zapłaty</span>
                    <span className="text-3xl font-bold text-gold">{totalPrice} zł</span>
                  </div>
                </div>

                {/* Pay Button */}
                <div className="pt-6">
                  <button
                    onClick={handlePayClick}
                    disabled={isPaymentStarted}
                    className={cn(
                      'w-full py-4 px-6 rounded-xl text-lg font-bold transition-all duration-300',
                      isPaymentStarted
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'btn-gold shine-effect'
                    )}
                  >
                    {isPaymentStarted ? (
                      <span className="flex items-center justify-center gap-2">
                        <Lock className="w-5 h-5" />
                        Wybierz metodę płatności
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Lock className="w-5 h-5" />
                        Zapłać {totalPrice} zł
                      </span>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                    <Lock className="w-3 h-3" />
                    Bezpieczna płatność szyfrowana SSL
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
