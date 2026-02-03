import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart';

const Header = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl md:text-2xl font-bold text-gold-gradient">
              Radianté
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Produkt
            </Link>
            <Link 
              to="/#reviews" 
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              Opinie
            </Link>
            <Link 
              to="/#faq" 
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              FAQ
            </Link>
          </nav>

          {/* Cart */}
          <Link 
            to="/cart" 
            className="relative flex items-center gap-2 p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
            <span className="hidden md:inline text-sm font-medium">Koszyk</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
