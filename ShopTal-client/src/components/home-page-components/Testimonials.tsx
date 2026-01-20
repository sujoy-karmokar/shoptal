import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "../shadcn-ui/card";

interface Testimonial {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  comment: string;
  verified: boolean;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    rating: 5,
    comment: "Amazing shopping experience! Fast delivery and excellent customer service. The product quality exceeded my expectations.",
    verified: true,
  },
  {
    id: "2",
    name: "Mike Chen",
    rating: 5,
    comment: "Found exactly what I was looking for at great prices. The website is easy to navigate and checkout was seamless.",
    verified: true,
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    rating: 5,
    comment: "Love the variety of products and the frequent deals. ShopTal has become my go-to online store!",
    verified: true,
  },
];

export default function Testimonials() {
  return (
    <section className="mb-14 bg-gradient-to-br from-white to-pink-50/30 rounded-2xl shadow-lg py-10 px-2 md:py-14 md:px-12 border border-pink-100">
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 bg-pink-600 text-white px-3 py-1 rounded-full text-xs md:text-sm font-semibold shadow animate-fade-in-down mb-2">
          <Quote className="w-4 h-4" /> Customer Reviews
        </span>
        <h2 className="text-3xl font-bold text-primary animate-fade-in-down mb-1">
          What Our Customers Say
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-pink-400 via-pink-300 to-pink-200 rounded-full mb-3 animate-fade-in-up" />
        <p className="text-base text-gray-500 animate-fade-in-up max-w-2xl mx-auto">
          Don&apos;t just take our word for it. Here&apos;s what our satisfied customers have to say about their shopping experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card
            key={testimonial.id}
            className="bg-white border border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <blockquote className="text-gray-700 mb-4 italic leading-relaxed">
                &ldquo;{testimonial.comment}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                  <span className="text-pink-600 font-semibold text-sm">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {testimonial.name}
                  </p>
                  {testimonial.verified && (
                    <p className="text-xs text-green-600 font-medium">
                      ✓ Verified Purchase
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <div className="inline-flex items-center gap-4 bg-white rounded-lg px-6 py-3 shadow-sm border border-pink-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-600">10,000+</p>
            <p className="text-xs text-gray-600">Happy Customers</p>
          </div>
          <div className="w-px h-8 bg-pink-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-600">4.8★</p>
            <p className="text-xs text-gray-600">Average Rating</p>
          </div>
          <div className="w-px h-8 bg-pink-200" />
          <div className="text-center">
            <p className="text-2xl font-bold text-pink-600">98%</p>
            <p className="text-xs text-gray-600">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
}