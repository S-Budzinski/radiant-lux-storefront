import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { cn } from '@/lib/utils';

const CartPage = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalSavings } = useCart();

  const totalPrice = getTotalPrice();
  const totalSavings = getTotalSavings();

  if (items.length === 0) {
    return (
      <main className="pt-24 pb-16 min-h-screen flex flex-col items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-card border border-border flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Twój koszyk jest pusty
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Wygląda na to, że nie dodałeś jeszcze żadnych produktów. Sprawdź naszą ofertę i zadbaj o swoją skórę już dziś.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl btn-gold font-semibold text-lg"
          >
            Wróć do sklepu
          </Link>
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

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="card-luxury p-4 flex gap-4 md:gap-6 items-center"
              >
                {/* Image */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg bg-charcoal-light flex-shrink-0 p-2 border border-border">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-display font-semibold text-foreground text-lg truncate pr-4">
                        {item.name}
                      </h3>
                      {item.isBundle && (
                        <span className="badge-bundle text-xs">
                          Zestaw {item.bundleSize} szt.
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                      title="Usuń z koszyka"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-secondary/50 rounded-lg p-1 w-fit">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded bg-card hover:bg-border transition-colors text-foreground"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded bg-card hover:bg-border transition-colors text-foreground"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <div className="font-bold text-xl text-gold">
                        {item.price * item.quantity} zł
                      </div>
                      {item.quantity > 1 && (
                        <div className="text-xs text-muted-foreground">
                          {item.price} zł / szt.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mt-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Kontynuuj zakupy
            </Link>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card-luxury p-6 sticky top-24">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                Podsumowanie
              </h2>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-muted-foreground">
                  <span>Wartość produktów</span>
                  <span className="text-foreground">{totalPrice} zł</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Dostawa</span>
                  <span className="text-success font-medium">Gratis</span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-gold">
                    <span>Oszczędzasz</span>
                    <span>-{totalSavings} zł</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-end mb-8">
                <span className="text-lg font-medium text-foreground">Razem</span>
                <span className="text-3xl font-bold text-gold">{totalPrice} zł</span>
              </div>

              <Link
                to="/checkout"
                className="w-full py-4 rounded-xl btn-gold flex items-center justify-center gap-2 font-bold text-lg shine-effect"
              >
                Przejdź do dostawy <ArrowRight className="w-5 h-5" />
              </Link>
              
              <div className="mt-6 flex items-center justify-center gap-4 opacity-60 grayscale">
                <div className="h-6 w-10 bg-white/10 rounded"></div>
                <div className="h-6 w-10 bg-white/10 rounded"></div>
                <div className="h-6 w-10 bg-white/10 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CartPage;