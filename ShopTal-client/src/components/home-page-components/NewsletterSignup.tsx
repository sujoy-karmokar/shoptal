"use client";

import { useState } from "react";
import { Button } from "../shadcn-ui/button";
import { Input } from "../shadcn-ui/input";
import { Mail, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsSubscribed(true);
      toast.success("Successfully subscribed to our newsletter!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <section className="mb-14 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg py-10 px-6 md:py-14 md:px-12 border border-green-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Welcome to ShopTal!
          </h2>
          <p className="text-green-700">
            Thank you for subscribing. You&apos;ll receive our latest updates and exclusive offers.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-14 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl shadow-lg py-10 px-6 md:py-14 md:px-12 border border-pink-200">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-pink-600" />
        </div>
        <h2 className="text-3xl font-bold text-primary mb-4">
          Stay Updated with Latest Deals
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Subscribe to our newsletter and be the first to know about new arrivals,
          exclusive deals, and special promotions. Join thousands of happy shoppers!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 h-12 border-pink-200 focus:border-pink-400 focus:ring-pink-400"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 px-8 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 whitespace-nowrap"
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>

        <p className="text-xs text-gray-500 mt-4">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}