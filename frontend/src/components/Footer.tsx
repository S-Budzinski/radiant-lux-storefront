import { Link } from 'react-router-dom';
import { ShieldAlert, Truck, Mail, Scale } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#d4af37]/20 text-zinc-400 pt-12 pb-6 text-sm">
      <div className="container mx-auto px-4">
        
        {/* Górna sekcja z kolumnami */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Kolumna 1: Marka */}
          <div className="space-y-4">
            <h3 className="text-xl font-display font-bold text-[#d4af37]">Radianté</h3>
            <p className="text-xs leading-relaxed">
              Dostarczamy luksusową pielęgnację bezpośrednio do Twojego domu. 
              Łączymy nowoczesną technologię z ponadczasowym pięknem.
            </p>
          </div>

          {/* Kolumna 2: Zakupy i Dostawa */}
          <div className="space-y-4">
            <h4 className="text-[#d4af37] font-semibold flex items-center gap-2">
              <Truck className="w-4 h-4" /> Dostawa i Zwroty
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shipping-policy" className="hover:text-[#d4af37] transition-colors">Polityka Wysyłek (10-20 dni)</Link></li>
              <li><Link to="/returns-policy" className="hover:text-[#d4af37] transition-colors">Polityka Zwrotów</Link></li>
              <li><Link to="/contact" className="hover:text-[#d4af37] transition-colors">Dane Kontaktowe</Link></li>
            </ul>
          </div>

          {/* Kolumna 3: Prawne */}
          <div className="space-y-4">
            <h4 className="text-[#d4af37] font-semibold flex items-center gap-2">
              <Scale className="w-4 h-4" /> Regulaminy
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/terms" className="hover:text-[#d4af37] transition-colors">Warunki Świadczenia Usług</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-[#d4af37] transition-colors">Polityka Prywatności</Link></li>
              <li><Link to="/legal-notice" className="hover:text-[#d4af37] transition-colors">Nota Prawna</Link></li>
            </ul>
          </div>

          {/* Kolumna 4: Ostrzeżenie (Wyróżnione) */}
          <div className="space-y-4">
            <h4 className="text-red-400 font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> Bezpieczeństwo
            </h4>
            <div className="bg-red-950/20 border border-red-900/30 p-3 rounded-lg text-[10px] leading-tight text-zinc-300">
              <p className="mb-2">
                <strong>UWAGA:</strong> Urządzenie elektryczne.
              </p>
              <p>
                Zabrania się użytkowania w pobliżu wody (wanna, prysznic, basen) oraz w zaparowanych pomieszczeniach. 
                Używać wyłącznie na sucho. Sklep nie ponosi odpowiedzialności za szkody wynikłe z nieprzestrzegania zasad bezpieczeństwa.
              </p>
            </div>
          </div>
        </div>

        {/* Dolna sekcja: Copyright */}
        <div className="border-t border-zinc-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>
            &copy; {currentYear} Radianté. Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex gap-4">
            {/* Tutaj możesz dodać ikony social media */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;