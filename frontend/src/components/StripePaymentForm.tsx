import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

export default function StripePaymentForm() {
  const stripe = useStripe();
  const elements = useElements();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
      },
    });
  };

  return (
    <form onSubmit={submit} className="space-y-6 bg-slate-500">
      <PaymentElement />
      <button className="w-full py-4 rounded-xl btn-gold font-bold">
        Zapłać
      </button>
    </form>
  );
}
