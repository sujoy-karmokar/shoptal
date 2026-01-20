import {
  Truck,
  Shield,
  HeadphonesIcon,
  CreditCard,
  RefreshCw,
  Award
} from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free delivery on orders over $50. Fast and reliable shipping worldwide.",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Your payment information is protected with bank-level security encryption.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Our customer service team is here to help you anytime, anywhere.",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    icon: CreditCard,
    title: "Easy Returns",
    description: "Not satisfied? Return any item within 30 days for a full refund.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    icon: RefreshCw,
    title: "Quality Guarantee",
    description: "All products come with our quality guarantee and warranty coverage.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    icon: Award,
    title: "Best Prices",
    description: "We offer competitive prices and regular deals to save you money.",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
  },
];

export default function Features() {
  return (
    <section className="mb-14">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-primary mb-4">
          Why Choose ShopTal?
        </h2>
        <p className="text-base text-gray-600 max-w-2xl mx-auto">
          We&apos;re committed to providing you with the best shopping experience possible.
          Here are just a few reasons why thousands of customers choose us.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-pink-100 hover:border-pink-300 group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <IconComponent className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors duration-200">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}