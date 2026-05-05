import React from "react";
import { 
  Brain, 
  GraduationCap, 
  Users, 
  Eye, 
  Banknote, 
  Bus 
} from "lucide-react";

const features = [
  {
    title: "AI-Powered Analytics",
    description: "Predict performance and identify at-risk students early.",
    icon: Brain,
    color: { bg: "bg-purple-100", text: "text-purple-600" },
  },
  {
    title: "CBC Learning Insights",
    description: "Deep strand-level analytics with personalized learning recommendations.",
    icon: GraduationCap,
    color: { bg: "bg-emerald-100", text: "text-emerald-600" },
  },
  {
    title: "Teacher Support",
    description: "Get AI-suggested interventions and resources to boost class performance.",
    icon: Users,
    color: { bg: "bg-orange-100", text: "text-orange-600" },
  },
  {
    title: "Parent Intelligence",
    description: "Clear, easy-to-understand insights to support your child's growth.",
    icon: Eye,
    color: { bg: "bg-blue-100", text: "text-blue-600" },
  },
  {
    title: "Fee Management",
    description: "M-Pesa automation, reminders and flexible payment options.",
    icon: Banknote,
    color: { bg: "bg-rose-100", text: "text-rose-600" },
  },
  {
    title: "Safe School Transport",
    description: "Real-time tracking and alerts for school transport safety.",
    icon: Bus,
    color: { bg: "bg-cyan-100", text: "text-cyan-600" },
  },
];

export const FeatureCards: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-6">
            Everything You Need to Improve Learning Outcomes
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className={`${feature.color.bg} ${feature.color.text} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-white shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-xs font-extrabold text-slate-900 mb-2 leading-tight uppercase tracking-tight">{feature.title}</h3>
              <p className="text-[10px] text-slate-500 leading-tight">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
