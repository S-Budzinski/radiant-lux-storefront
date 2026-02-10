import nodemailer from 'nodemailer';

// Konfiguracja transportera (tutaj przykład dla Gmaila)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface OrderDetails {
  orderId: string;
  total: number;
  customerEmail: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
}

export async function sendOrderEmails(details: OrderDetails) {
  const { 
    orderId, total, customerEmail, firstName, lastName, 
    address, city, postalCode, phone 
  } = details;

  const totalPLN = (total / 100).toFixed(2); // Stripe trzyma kwotę w groszach

  // 1. Mail do KLIENTA
  await transporter.sendMail({
    from: `"Radianté" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `Potwierdzenie zamówienia #${orderId} - Radianté Lux`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h1 style="color: #d4af37;">Dziękujemy za zamówienie!</h1>
        <p>Cześć ${firstName},</p>
        <p>Twoje zamówienie <strong>#${orderId}</strong> zostało opłacone i przyjęte do realizacji.</p>
        <p>Wkrótce otrzymasz kolejną wiadomość z informacją o wysyłce.</p>
        <hr style="border: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">Zespół Radianté Lux</p>
      </div>
    `,
  });

  // 2. Mail do ADMINA (Ty)
  await transporter.sendMail({
    from: `"Sklep Bot" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL, // Twój prywatny mail
    subject: `💰 Wpadło zamówienie za ${totalPLN} zł (Zamówienie #${orderId})`,
    html: `
      <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
        <h2 style="color: #2da44e; margin-top: 0;">Nowe Opłacone Zamówienie!</h2>
        
        <div style="background-color: #f6f8fa; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
          <p style="margin: 5px 0; font-size: 18px;"><strong>Kwota:</strong> ${totalPLN} PLN</p>
          <p style="margin: 5px 0;"><strong>ID Zamówienia:</strong> #${orderId}</p>
          <p style="margin: 5px 0;"><strong>Email Klienta:</strong> ${customerEmail}</p>
        </div>

        <h3>Dane do wysyłki:</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="padding: 5px 0; border-bottom: 1px solid #eee;"><strong>Imię i nazwisko:</strong> ${firstName} ${lastName}</li>
          <li style="padding: 5px 0; border-bottom: 1px solid #eee;"><strong>Adres:</strong> ${address}</li>
          <li style="padding: 5px 0; border-bottom: 1px solid #eee;"><strong>Miasto:</strong> ${postalCode} ${city}</li>
          <li style="padding: 5px 0; border-bottom: 1px solid #eee;"><strong>Telefon:</strong> ${phone}</li>
        </ul>

        <p style="margin-top: 20px; font-size: 12px; color: #666;">
          Wiadomość wygenerowana automatycznie przez system Vercel/Stripe.
        </p>
      </div>
    `,
  });
}