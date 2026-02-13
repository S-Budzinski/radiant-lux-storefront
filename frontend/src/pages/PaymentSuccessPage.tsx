import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom'; // Dodano useSearchParams i useNavigate
import { CheckCircle, ShoppingBag, ArrowRight, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart';
import ReactPixel from 'react-facebook-pixel'; // Dodano Pixel

const PaymentSuccessPage = () => {
  const { clearCart, getTotalPrice, items } = useCart();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [isValidPayment, setIsValidPayment] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 1. Pobieramy parametry z adresu URL, które dodał Stripe
    const status = searchParams.get('redirect_status');
    const paymentIntent = searchParams.get('payment_intent');

    // 2. SPRAWDZENIE BEZPIECZEŃSTWA
    // Jeśli w linku nie ma statusu 'succeeded', to znaczy, że ktoś wszedł "z ulicy"
    if (status !== 'succeeded' || !paymentIntent) {
      // Opcja A: Przekieruj od razu na stronę główną
      // navigate('/'); 
      
      // Opcja B: Zostań, ale pokaż błąd i NIE wysyłaj pixela
      setIsValidPayment(false);
      setIsChecking(false);
      return; 
    }

    // Jeśli kod dotarł tutaj, to znaczy, że płatność jest prawdziwa (pochodzi ze Stripe)
    setIsValidPayment(true);

    // 3. Sprawdzamy, czy pixel już nie poszedł w tej sesji (zabezpieczenie przed odświeżaniem F5)
    // Używamy ID płatności jako klucza, żeby być pewnym
    const storageKey = `pixel_sent_${paymentIntent}`;
    const alreadySent = sessionStorage.getItem(storageKey);

    if (!alreadySent) {
      // 4. WYSYŁKA DANYCH DO FACEBOOKA (ROAS)
      // Pobieramy wartość zanim wyczyścimy koszyk
      const totalAmount = getTotalPrice(); 

      ReactPixel.track('Purchase', {
        value: totalAmount, // Kwota z koszyka
        currency: 'PLN',
        content_name: 'Zamówienie Radiant Lux',
        order_id: paymentIntent, // Unikalne ID ze Stripe
        content_ids: items.map(item => item.id), // ID produktów
        content_type: 'product',
        num_items: items.length
      });

      // Zaznaczamy w przeglądarce, że dla tego zamówienia pixel już poszedł
      sessionStorage.setItem(storageKey, 'true');
      
      // 5. Dopiero TERAZ czyścimy koszyk
      clearCart();
    }

    setIsChecking(false);

  }, [searchParams, clearCart, getTotalPrice, items]);

  // Jeśli trwa weryfikacja (ułamek sekundy), możesz pokazać loader lub nic
  if (isChecking) return null;

  // --- WERSJA DLA OSZUSTA / PRZYPADKOWEGO WEJŚCIA ---
  if (!isValidPayment) {
    return (
      <main className="pt-32 pb-16 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
            <XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Brak potwierdzenia płatności</h1>
            <p className="text-muted-foreground mb-8">Nie odnaleziono danych transakcji w adresie URL.</p>
            <Link to="/"><Button className="btn-gold">Wróć do sklepu</Button></Link>
        </div>
      </main>
    );
  }

  // --- WERSJA POPRAWNA (SUKCES) ---
  return (
    <main className="pt-32 pb-16 min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          <div className="card-luxury p-8 md:p-12 text-center animate-in fade-in zoom-in duration-500">
            
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