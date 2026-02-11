import { Mail, MapPin } from 'lucide-react';

const ContactData = () => (
  <main className="pt-32 pb-16 container mx-auto px-4 max-w-3xl text-zinc-300">
    <h1 className="text-3xl font-display font-bold text-[#d4af37] mb-8">Dane Kontaktowe</h1>
    <div className="card-luxury p-8 space-y-6">
      <div className="flex items-start gap-4">
        <Mail className="text-[#d4af37] w-6 h-6 mt-1" />
        <div>
          <h3 className="text-white font-semibold">Adres Email</h3>
          <p>kabu.biuro@gmail.com</p>
          <p className="text-xs text-zinc-500 mt-1">Odpowiadamy w ciągu 24h</p>
        </div>
      </div>
      <div className="flex items-start gap-4">
        <MapPin className="text-[#d4af37] w-6 h-6 mt-1" />
        <div>
          <h3 className="text-white font-semibold">Adres do korespondencji</h3>
          <p>Radianté</p>
          <p>ul. Saska 63l/2</p>
          <p>35-630 Rzeszów</p>
          <p className="text-xs text-zinc-500 mt-1">(To nie jest adres do zwrotów - prosimy o kontakt przed wysyłką)</p>
        </div>
      </div>
    </div>
  </main>
);
export default ContactData;