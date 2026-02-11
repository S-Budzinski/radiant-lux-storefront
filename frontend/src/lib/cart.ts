import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  originalPrice: number;
  isBundle: boolean;
  bundleSize?: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getTotalSavings: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        set((state) => {
          // Sprawdź, czy produkt o tym ID już istnieje
          const existingItem = state.items.find((i) => i.id === item.id);
          
          if (existingItem) {
            // Jeśli istnieje, zaktualizuj tylko ilość
            return {
              items: state.items.map((i) =>
                i.id === item.id 
                  ? { ...i, quantity: i.quantity + item.quantity } 
                  : i
              ),
            };
          }
          
          // Jeśli nie istnieje, dodaj jako nowy
          return { items: [...state.items, item] };
        });
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        }));
      },
      
      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i
          ).filter((i) => i.quantity > 0), // Usuń jeśli ilość spadnie do 0
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalSavings: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + (item.originalPrice - item.price) * item.quantity,
          0
        );
      },
    }),
    {
      name: 'radiante-cart', // Klucz w localStorage
    }
  )
);

// Dane produktu i zestawów (bez zmian, potrzebne do importów)
export const PRODUCT = {
  id: 'radiante-lux240',
  name: 'Radianté Lux240',
  tagline: 'Profesjonalna Maska LED do Odmładzania Skóry',
  description: 'Zaawansowana technologia fototerapii LED w eleganckiej, elastycznej formie. Stworzona z myślą o profesjonalnych efektach w domowym zaciszu.',
  features: [
    'Redukcja zmarszczek i linii mimicznych',
    'Poprawa elastyczności i jędrności skóry',
    'Redukcja przebarwień i wyrównanie kolorytu',
    '7 kolorów światła LED dla różnych potrzeb',
    'Bezprzewodowa i elastyczna konstrukcja',
    'Certyfikowana jakość i bezpieczeństwo',
  ],
  specs: [
    { label: 'Technologia', value: '7-kolorowa terapia LED' },
    { label: 'Czas zabiegu', value: '10-20 minut' },
    { label: 'Zasilanie', value: 'USB-C, bezprzewodowe' },
    { label: 'Materiał', value: 'Elastyczny silikon medyczny' },
    { label: 'W zestawie', value: 'Maska, nakładka na szyję, kabel USB-C, paski' },
  ],
};

export const BUNDLE_OPTIONS = [
  {
    id: 'single',
    quantity: 1,
    label: '1 Maska',
    description: 'Normalna Cena',
    price: 550,
    originalPrice: 1100,
    savings: 50,
    popular: false,
    cheapest: false,
  },
  {
    id: 'double',
    quantity: 2,
    label: '2 Maski',
    description: 'Normalna Cena',
    price: 400,
    originalPrice: 1100,
    savings: 63,
    popular: true,
    cheapest: false,
  },
  {
    id: 'triple',
    quantity: 3,
    label: '3 Maski',
    description: 'Normalna Cena',
    price: 350,
    originalPrice: 1100,
    savings: 68,
    popular: false,
    cheapest: true,
  },
];