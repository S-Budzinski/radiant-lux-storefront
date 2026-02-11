import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import productMain from '@/assets/3pic-mask.png';
import productOnBathroom from '@/assets/maskOnBathroom.png';
import productOnModel from '@/assets/maskOnModelBath.png';
import productOnTop from '@/assets/maskOnTopBathroom.png';
import productSet from '@/assets/maskSetFull.png';

const images = [
  { src: productMain, alt: 'Radianté Lux290 - widok główny' },
  { src: productOnBathroom, alt: 'Radianté Lux290 - w łazience' },
  { src: productOnModel, alt: 'Radianté Lux290 - Model' },
  { src: productOnTop, alt: 'Radianté Lux290 - Na blacie' },
  { src: productSet, alt: 'Radianté Lux290 - Zestaw' },
];

const ProductImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="aspect-square rounded-2xl bg-gradient-to-br from-charcoal-light to-charcoal overflow-hidden border border-border relative">
        <img
          src={images[currentIndex].src}
          alt={images[currentIndex].alt}
          className="w-full h-full object-contain p-8 transition-opacity duration-300"
        />
        
        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-primary/20 transition-colors"
          aria-label="Poprzednie zdjęcie"
        >
          <ChevronLeft className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-primary/20 transition-colors"
          aria-label="Następne zdjęcie"
        >
          <ChevronRight className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex justify-center gap-3 mt-4">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all',
              currentIndex === index
                ? 'border-primary shadow-glow'
                : 'border-border hover:border-primary/50'
            )}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-contain bg-charcoal p-1"
            />
          </button>
        ))}
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              'w-2 h-2 rounded-full transition-all',
              currentIndex === index
                ? 'bg-primary w-6'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            )}
            aria-label={`Zdjęcie ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImageCarousel;
