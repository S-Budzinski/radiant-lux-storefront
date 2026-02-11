const ShippingPolicy = () => (
  <main className="pt-32 pb-16 container mx-auto px-4 max-w-3xl text-zinc-300">
    <h1 className="text-3xl font-display font-bold text-[#d4af37] mb-8">Polityka Wysyłek</h1>
    <div className="space-y-6 text-sm leading-relaxed">
      <section>
        <h2 className="text-lg font-semibold text-white mb-2">1. Czas Realizacji</h2>
        <p>Zamówienia są realizowane w modelu dropshipping bezpośrednio od naszych dostawców zagranicznych (głównie Azja). Czas przetwarzania zamówienia wynosi 1-3 dni robocze.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-white mb-2">2. Czas Dostawy</h2>
        <p>Standardowy czas dostawy wynosi od <strong>10 do 20 dni roboczych</strong>. W wyjątkowych sytuacjach (święta, kontrole celne) czas ten może ulec wydłużeniu do 45 dni. Nie ponosimy odpowiedzialności za opóźnienia wynikające z działania przewoźników.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-white mb-2">3. Cła i Podatki</h2>
        <p>Klient jest importerem towaru. W rzadkich przypadkach mogą zostać naliczone opłaty celne, które pokrywa kupujący.</p>
      </section>
    </div>
  </main>
);
export default ShippingPolicy;