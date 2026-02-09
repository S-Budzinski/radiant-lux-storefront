import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart';

const PaymentSuccessPage = () => {
  const { clearCart } = useCart();

  // Wyczyszczenie koszyka po wejściu na stronę sukcesu
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="pt-32 pb-16 min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          <div className="card-luxury p-8 md:p-12 text-center animate-in fade-in zoom-in duration-500">
            
            {/* Ikona sukcesu z animacją */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-success animate-bounce" />
            </div>

            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Dziękujemy za zamówienie!
            </h1>
            
            <p className="text-muted-foreground text-lg mb-8">
              Płatność została przyjęta pomyślnie. Potwierdzenie zamówienia oraz szczegóły wysłaliśmy na Twój adres email.
            </p>

            <div className="space-y-4">
              <div className="bg-charcoal-light p-4 rounded-xl border border-border mb-8">
                <p className="text-sm text-muted-foreground">
                  Status zamówienia: <span className="text-success font-semibold">Opłacone</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Paczka zostanie nadana w ciągu 24 godzin.
                </p>
              </div>

              <Link to="/">
                <Button className="w-full btn-gold h-12 text-lg font-bold group">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Wróć do sklepu
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PaymentSuccessPage;