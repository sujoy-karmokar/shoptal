"use client";
import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/shadcn-ui/button";
import { Loader2 } from "lucide-react";

interface StripePaymentFormProps {
  clientSecret: string;
  onPaymentSuccess: () => void;
}

export default function StripePaymentForm({
  clientSecret,
  onPaymentSuccess,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (!stripe || !elements) {
      setError("Stripe not loaded");
      setLoading(false);
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card element not found");
      setLoading(false);
      return;
    }
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );
    if (error) {
      setError(error.message || "Payment failed");
      setLoading(false);
      return;
    }
    if (paymentIntent && paymentIntent.status === "succeeded") {
      onPaymentSuccess();
    } else {
      setError("Payment did not succeed");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement
        options={{ hidePostalCode: true }}
        className="p-2 border rounded"
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Pay Now
      </Button>
    </form>
  );
}
