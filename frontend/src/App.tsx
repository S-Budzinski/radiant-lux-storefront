import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"; // Dodano useLocation tutaj
import Header from "./components/Header";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import NotFound from "./pages/NotFound";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import ShippingPolicy from "./pages/legal/ShippingPolicy";
import ReturnsPolicy from "./pages/legal/ReturnsPolicy";
import TermsOfService from "./pages/legal/TermsOfService";
import ContactData from "./pages/legal/ContactData";
import Footer from "./components/Footer";
import LegalNotice from "./pages/legal/LegalNotice";
import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import React, { useEffect } from 'react';
import ReactPixel from 'react-facebook-pixel';

const queryClient = new QueryClient();

// --- 1. TWORZYMY POMOCNICZY KOMPONENT DO ŚLEDZENIA ---
// Musi być osobno, żeby działał wewnątrz BrowserRoutera
const FacebookPixelTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Inicjalizacja Pixela - WKLEJ SWÓJ NUMER ID PONIŻEJ
    ReactPixel.init('470424833648423', undefined, { debug: true, autoConfig: true });
  }, []);

  useEffect(() => {
    // Śledzenie zmiany strony (PageView)
    ReactPixel.pageView();
  }, [location]);

  return null; // Ten komponent nic nie wyświetla, tylko działa w tle
};

// --- 2. GŁÓWNY KOMPONENT APLIKACJI ---
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* TUTAJ WSTAWIAMY NASZ TRACKER - wewnątrz BrowserRoutera */}
        <FacebookPixelTracker />
        
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/success" element={<PaymentSuccessPage />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/returns-policy" element={<ReturnsPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/contact" element={<ContactData />} />
              <Route path="/legal-notice" element={<LegalNotice />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer/>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;