import productMain from '@/assets/product-main.png';
import productRed from '@/assets/product-red.png';
import productFeatures from '@/assets/product-features.png';
import { cn } from '@/lib/utils';

const featureSections = [
  {
    image: productRed,
    title: 'Zaawansowana terapia LED',
    description:
      'Maska wykorzystuje 290 diod LED o różnych długościach fal, aby skutecznie stymulować produkcję kolagenu i redukować zmarszczki. Czerwone światło przenika głęboko w skórę, przyspieszając regenerację komórkową.',
    features: ['290 diod LED', 'Głęboka penetracja', 'Stymulacja kolagenu'],
  },
  {
    image: productFeatures,
    title: 'Komfort i wygoda użytkowania',
    description:
      'Zaprojektowana z myślą o maksymalnym komforcie. Ultralekka konstrukcja (tylko 0.2kg) i regulowany pasek sprawiają, że możesz cieszyć się terapią podczas codziennych czynności.',
    features: ['Waga tylko 0.2kg', 'Grubość 0.3cm', 'Regulowany pasek'],
  },
  {
    image: productMain,
    title: 'Profesjonalne rezultaty w domu',
    description:
      'Technologia stosowana w gabinetach kosmetycznych teraz dostępna w Twoim domu. Regularne stosowanie maski zapewnia widoczne efekty już po 2 tygodniach - jędrniejsza, bardziej promienna skóra.',
    features: ['Efekty po 2 tygodniach', 'Jakość gabinetowa', 'Bezpieczna dla każdej cery'],
  },
];

const ProductFeatureSections = () => {
  return (
    <section className="mt-16 md:mt-24">
      <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-12">
        Odkryj <span className="text-gold-gradient">możliwości</span> maski
      </h2>

      <div className="space-y-16 md:space-y-24">
        {featureSections.map((section, index) => (
          <div
            key={index}
            className={cn(
              'grid md:grid-cols-2 gap-8 md:gap-12 items-center',
              index % 2 === 1 && 'md:flex-row-reverse'
            )}
          >
            {/* Image */}
            <div
              className={cn(
                'relative',
                index % 2 === 1 && 'md:order-2'
              )}
            >
              <div className="aspect-square md:aspect-[4/3] rounded-2xl bg-gradient-to-br from-charcoal-light to-charcoal overflow-hidden border border-border">
                <img
                  src={section.image}
                  alt={section.title}
                  className="w-full h-full object-contain p-6"
                />
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl -z-10 blur-2xl" />
            </div>

            {/* Content */}
            <div className={cn(index % 2 === 1 && 'md:order-1')}>
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
                {section.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {section.description}
              </p>
              
              {/* Feature tags */}
              <div className="flex flex-wrap gap-2">
                {section.features.map((feature, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductFeatureSections;
