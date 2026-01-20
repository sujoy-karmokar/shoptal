"use client";
import dynamic from "next/dynamic";

const CheckoutForm = dynamic(() => import("./CheckoutForm"), {
  loading: () => <p>Loading...</p>,
});

export default function CheckoutPage() {
  return <CheckoutForm />;
}