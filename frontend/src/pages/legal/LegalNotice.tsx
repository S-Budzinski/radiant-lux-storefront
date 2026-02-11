const LegalNotice = () => (
  <main className="pt-32 pb-16 container mx-auto px-4 max-w-3xl text-zinc-300">
    <h1 className="text-3xl font-display font-bold text-[#d4af37] mb-8">Informacje Prawne</h1>
    <div className="space-y-6 text-sm leading-relaxed">
    <section>
    <h2 className="text-lg font-semibold text-white mb-2">1. Charakter produktu</h2>
    <p>Maska LED wykorzystuje światło czerwone (ok. 630–660 nm) oraz/lub podczerwone (ok. 830–850 nm).</p>
    <p>Produkt przeznaczony jest wyłącznie do użytku kosmetycznego.</p>
    <p>Produkt nie stanowi urządzenia medycznego, o ile nie wskazano inaczej.</p>
    </section>

    <section>
    <h2 className="text-lg font-semibold text-white mb-2">2. Ostrzeżenia</h2>
    <p>Nie stosować w przypadku epilepsji światłoczułej.</p>
    <p>Nie stosować przy aktywnych chorobach skóry bez konsultacji lekarskiej.</p>
    <p>Nie używać na uszkodzoną skórę.</p>
    <p>Nie przekraczać zalecanego czasu ekspozycji.</p>
    </section>

    <section>
    <h2 className="text-lg font-semibold text-white mb-2">3. Ograniczenie odpowiedzialności</h2>
    <p>Sprzedawca nie ponosi odpowiedzialności za skutki wynikające z niewłaściwego użytkowania produktu.</p>
    <p>Wyniki stosowania produktu mogą różnić się w zależności od indywidualnych cech organizmu.</p>
    <p>Informacje zawarte na stronie nie stanowią porady medycznej.</p>
    </section>

    </div>
  </main>
);
export default LegalNotice;