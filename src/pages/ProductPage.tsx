import { Check, Shield, Truck, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BUNDLE_OPTIONS, PRODUCT, useCart } from '@/lib/cart';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import productImage from '@/assets/product-main.png';

const BundleCard = ({
  option,
  isSelected,
  onSelect,
}: {
  option: typeof BUNDLE_OPTIONS[0];
  isSelected: boolean;
  onSelect: () => void;
}) => {
  return (
    <button
      onClick={onSelect}
      className={cn(
        'relative w-full p-4 md:p-5 rounded-xl border-2 transition-all duration-300 text-left',
        isSelected
          ? 'border-primary bg-primary/5 shadow-glow'
          : 'border-border bg-card hover:border-primary/50'
      )}
    >
      {/* Badges */}
      {option.popular && (
        <span className="absolute -top-3 right-4 badge-popular">
          Najczęściej wybierane
        </span>
      )}
      {option.cheapest && (
        <span className="absolute -top-3 right-4 bg-success text-primary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
          Najlepsza cena
        </span>
      )}

      <div className="flex items-start justify-between gap-4">
        {/* Radio + Info */}
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
              isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
            )}
          >
            {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-foreground">
              {option.label}
            </h3>
            <p className="text-sm text-muted-foreground">{option.description}</p>
          </div>
        </div>

        {/* Price */}
        <div className="text-right">
          <div className="text-xl md:text-2xl font-bold text-gold">
            {option.price} zł
          </div>
          <div className="text-sm text-muted-foreground line-through">
            {option.originalPrice} zł
          </div>
        </div>
      </div>

      {/* Savings badge */}
      <div className="mt-3 flex items-center gap-2">
        <span className="badge-savings">Oszczędzasz {option.savings}%</span>
        {option.quantity > 1 && (
          <span className="badge-bundle">Bundle</span>
        )}
      </div>
    </button>
  );
};

const ProductPage = () => {
  const [selectedBundle, setSelectedBundle] = useState(BUNDLE_OPTIONS[1].id);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const selectedOption = BUNDLE_OPTIONS.find((o) => o.id === selectedBundle)!;

  const handleAddToCart = () => {
    addItem({
      id: `${PRODUCT.id}-${selectedBundle}`,
      name: selectedOption.quantity > 1 
        ? `${PRODUCT.name} (Zestaw ${selectedOption.quantity} szt.)`
        : PRODUCT.name,
      quantity: 1,
      price: selectedOption.price * selectedOption.quantity,
      originalPrice: selectedOption.originalPrice * selectedOption.quantity,
      isBundle: selectedOption.quantity > 1,
      bundleSize: selectedOption.quantity,
      image: productImage,
    });
    toast.success('Dodano do koszyka!', {
      description: `${selectedOption.label} - ${selectedOption.price * selectedOption.quantity} zł`,
    });
  };

  const handleBuyNow = () => {
    addItem({
      id: `${PRODUCT.id}-${selectedBundle}`,
      name: selectedOption.quantity > 1 
        ? `${PRODUCT.name} (Zestaw ${selectedOption.quantity} szt.)`
        : PRODUCT.name,
      quantity: 1,
      price: selectedOption.price * selectedOption.quantity,
      originalPrice: selectedOption.originalPrice * selectedOption.quantity,
      isBundle: selectedOption.quantity > 1,
      bundleSize: selectedOption.quantity,
      image: productImage,
    });
    navigate('/checkout');
  };

  return (
    <main className="pt-20 md:pt-24 pb-16">
      {/* Promo Banner */}
      <div className="bg-primary/10 border-b border-primary/20 py-2 text-center">
        <p className="text-sm font-medium text-primary animate-pulse-gold">
          🔥 Oferta ograniczona czasowo! Oszczędź do 63% - tylko dzisiaj!
        </p>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative animate-slide-up">
            <div className="sticky top-24">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-charcoal-light to-charcoal overflow-hidden border border-border">
                <img
                  src={productImage}
                  alt={PRODUCT.name}
                  className="w-full h-full object-contain p-8"
                />
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="flex flex-col items-center text-center p-3 rounded-lg bg-card border border-border">
                  <Truck className="w-5 h-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">Darmowa dostawa</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-lg bg-card border border-border">
                  <Shield className="w-5 h-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">2 lata gwarancji</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-lg bg-card border border-border">
                  <RefreshCw className="w-5 h-5 text-primary mb-1" />
                  <span className="text-xs text-muted-foreground">30 dni zwrotu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-primary fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-foreground font-medium">„Doskonałe" 4.9/5</span>
              <span className="text-sm text-muted-foreground">| 2,750+ recenzji</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
              {PRODUCT.name}
            </h1>
            <p className="text-lg text-primary font-medium mb-6">
              {PRODUCT.tagline}
            </p>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {PRODUCT.features.slice(0, 3).map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Bundle Options */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-warning animate-pulse" />
                Oferta ograniczona czasowo!
              </p>
              <div className="space-y-3">
                {BUNDLE_OPTIONS.map((option) => (
                  <BundleCard
                    key={option.id}
                    option={option}
                    isSelected={selectedBundle === option.id}
                    onSelect={() => setSelectedBundle(option.id)}
                  />
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleBuyNow}
                className="w-full py-4 px-6 rounded-xl btn-gold text-lg font-bold shine-effect"
              >
                Kup teraz – {selectedOption.price * selectedOption.quantity} zł
              </button>
              <button
                onClick={handleAddToCart}
                className="w-full py-4 px-6 rounded-xl btn-outline-gold text-lg font-semibold"
              >
                Dodaj do koszyka
              </button>
            </div>

            {/* Payment methods */}
            <div className="flex items-center justify-center gap-4 py-4 border-t border-b border-border">
              <span className="text-xs text-muted-foreground">Akceptujemy:</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-foreground bg-secondary px-2 py-1 rounded">BLIK</span>
                <span className="text-xs font-medium text-foreground bg-secondary px-2 py-1 rounded">Visa</span>
                <span className="text-xs font-medium text-foreground bg-secondary px-2 py-1 rounded">Mastercard</span>
                <span className="text-xs font-medium text-foreground bg-secondary px-2 py-1 rounded">Apple Pay</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <section className="mt-16 md:mt-24">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">
            Dlaczego <span className="text-gold-gradient">Radianté Lux290</span>?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCT.features.map((feature, i) => (
              <div
                key={i}
                className="card-luxury p-6 hover:border-primary/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <p className="text-foreground font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Specs */}
        <section className="mt-16 md:mt-24">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">
            Specyfikacja
          </h2>
          <div className="max-w-2xl mx-auto card-luxury divide-y divide-border">
            {PRODUCT.specs.map((spec, i) => (
              <div key={i} className="flex justify-between py-4 px-6">
                <span className="text-muted-foreground">{spec.label}</span>
                <span className="text-foreground font-medium">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews Section */}
        <section id="reviews" className="mt-16 md:mt-24">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">
            Co mówią nasi klienci
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Anna K.',
                text: 'Po 2 tygodniach stosowania widzę niesamowitą różnicę! Skóra jest bardziej jędrna i promienne.',
              },
              {
                name: 'Marta S.',
                text: 'Kupilam zestaw dla siebie i mamy - obie jesteśmy zachwycone. Świetna jakość i widoczne efekty.',
              },
              {
                name: 'Karolina W.',
                text: 'Profesjonalna jakość w domu. Moja cera nigdy nie wyglądała lepiej. Polecam każdemu!',
              },
            ].map((review, i) => (
              <div key={i} className="card-luxury p-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      className="w-4 h-4 text-primary fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-foreground mb-4">{review.text}</p>
                <p className="text-sm font-medium text-primary">{review.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="mt-16 md:mt-24 max-w-2xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-8">
            Często zadawane pytania
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Jak często powinienem używać maski?',
                a: 'Zalecamy używanie maski 3-5 razy w tygodniu przez 10-20 minut na sesję dla optymalnych rezultatów.',
              },
              {
                q: 'Czy maska jest bezpieczna dla mojego typu skóry?',
                a: 'Tak, maska LED jest bezpieczna dla wszystkich typów skóry. Technologia LED nie emituje promieniowania UV.',
              },
              {
                q: 'Kiedy zobaczę pierwsze efekty?',
                a: 'Większość klientów zauważa poprawę w ciągu 2-4 tygodni regularnego stosowania.',
              },
            ].map((faq, i) => (
              <details key={i} className="card-luxury group">
                <summary className="p-5 cursor-pointer list-none flex items-center justify-between">
                  <span className="font-medium text-foreground">{faq.q}</span>
                  <span className="text-primary transition-transform group-open:rotate-180">
                    ↓
                  </span>
                </summary>
                <div className="px-5 pb-5 text-muted-foreground">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProductPage;
