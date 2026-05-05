import React from "react";
import { Check } from "lucide-react";
import { Button } from "../shared/ui/Button";

const plans = [
  {
    name: "Starter",
    price: "2,000",
    description: "Perfect for small schools",
    features: [
      "Up to 200 Students",
      "Basic Analytics",
      "Fee Management",
      "Email & SMS Support",
    ],
    featured: false,
  },
  {
    name: "School Pro",
    price: "5,000",
    description: "Ideal for growing schools",
    features: [
      "Up to 1,000 Students",
      "Advanced Analytics",
      "CBC Learning Analytics",
      "Priority Support",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large schools & groups",
    features: [
      "Unlimited Students",
      "Custom Integrations",
      "Dedicated Account Manager",
      "24/7 Premium Support",
    ],
    featured: false,
  },
];

export const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
            Simple, Transparent Pricing
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`p-10 rounded-3xl border flex flex-col items-center text-center transition-all duration-300 ${
                plan.featured 
                ? "border-primary shadow-2xl scale-105 bg-white relative z-10" 
                : "border-slate-100 bg-slate-50 hover:bg-white hover:shadow-xl"
              }`}
            >
              {plan.featured && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-[10px] font-extrabold px-6 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg whitespace-nowrap">
                  Most Popular
                </div>
              )}
              
              <h3 className={`text-2xl font-extrabold mb-1 ${plan.featured ? "text-primary" : "text-slate-900"}`}>
                {plan.name}
              </h3>
              <p className="text-slate-500 text-xs font-bold mb-8 uppercase tracking-tighter">
                {plan.description}
              </p>
              
              <div className="mb-10 flex items-baseline gap-1">
                {plan.price !== "Custom" && (
                   <span className="text-xl font-extrabold text-slate-900 self-start mt-2">KSh</span>
                )}
                <span className="text-5xl font-black text-slate-900 tracking-tight">
                  {plan.price}
                </span>
                {plan.price !== "Custom" && (
                  <span className="text-slate-400 font-bold text-sm">/month</span>
                )}
              </div>

              <ul className="space-y-4 mb-12 w-full text-left inline-block max-w-[200px] mx-auto">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-3 text-slate-600 font-bold text-xs">
                    <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Check size={10} className="text-primary" strokeWidth={4} />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto w-full">
                <Button 
                   variant="outline"
                   className={`w-full h-12 rounded-xl border-primary text-primary font-bold transition-all duration-300 ${
                     plan.featured ? "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20" : "hover:bg-primary/5"
                   }`}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
