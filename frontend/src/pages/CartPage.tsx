import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cart';

const CartPage = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalSavings, clearCart } = useCart();
  const navigate = useNavigate();

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
              Twój koszyk jest pusty
            </h1>
            <p className="text-muted-foreground mb-8">
              Dodaj produkty do koszyka, aby kontynuować zakupy.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-gold font-semibold"
            >
              Przeglądaj produkty
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
          Twój koszyk
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="card-luxury p-4 md:p-6 flex flex-col sm:flex-row gap-4"
              >
                {/* Product Image */}
                <div className="w-full sm:w-32 h-32 rounded-lg bg-charcoal-light overflow-hidden flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        {item.isBundle && (
                          <span className="badge-bundle">
                            Zestaw {item.bundleSize} szt.
                          </span>
                        )}
                        <span className="badge-savings">
                          Oszczędzasz {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-auto pt-4 flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/20 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="text-xl font-bold text-gold">
                        {item.price * item.quantity} zł
                      </div>
                      <div className="text-sm text-muted-foreground line-through">
                        {item.originalPrice * item.quantity} zł
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors"
            >
              Wyczyść koszyk
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card-luxury p-6 sticky top-24">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                Podsumowanie
              </h2>

              <div className="space-y-3 pb-4 border-b border-border">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="text-foreground">{item.price * item.quantity} zł</span>
                  </div>
                ))}
              </div>

              <div className="py-4 border-b border-border">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Dostawa</span>
                  <span className="text-success font-medium">GRATIS</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Oszczędzasz</span>
                  <span className="text-success font-medium">-{totalSavings} zł</span>
                </div>
              </div>

              <div className="py-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-foreground">Razem</span>
                  <span className="text-2xl font-bold text-gold">{totalPrice} zł</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 px-6 rounded-xl btn-gold text-lg font-bold shine-effect"
              >
                Przejdź do płatności
              </button>

              <Link
                to="/"
                className="block text-center text-sm text-primary hover:underline mt-4"
              >
                ← Kontynuuj zakupy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;
