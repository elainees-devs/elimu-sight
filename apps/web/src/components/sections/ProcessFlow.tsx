import React from "react";
import { 
  Database, 
  Brain, 
  Lightbulb, 
  Users, 
  TrendingUp 
} from "lucide-react";

const steps = [
  { 
    title: "1. Collect Data", 
    desc: "Upload or sync student data including marks, attendance and assessments.",
    icon: Database,
    color: "bg-indigo-500" 
  },
  { 
    title: "2. AI Analysis", 
    desc: "Our AI models analyze patterns, trends and learning gaps in real-time.",
    icon: Brain,
    color: "bg-emerald-500" 
  },
  { 
    title: "3. Generate Insights", 
    desc: "Actionable insights and recommendations are generated instantly.",
    icon: Lightbulb,
    color: "bg-amber-500" 
  },
  { 
    title: "4. Take Action", 
    desc: "Teachers and parents receive insights to support targeted interventions.",
    icon: Users,
    color: "bg-primary" 
  },
  { 
    title: "5. Improve Outcomes", 
    desc: "Better decisions lead to improved performance and learner success.",
    icon: TrendingUp,
    color: "bg-cyan-500" 
  },
];

export const ProcessFlow: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl font-extrabold text-slate-900">How ElimuSight Works</h2>
        </div>

        <div className="flex flex-col md:flex-row items-start justify-between gap-8 relative">
          {/* Connecting Arrows (Desktop) */}
          <div className="absolute top-10 left-12 right-12 h-px border-t border-dashed border-slate-300 -z-0 hidden md:block"></div>

          {steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center flex-1 z-10">
              <div className={`w-20 h-20 rounded-full ${step.color} border-8 border-white shadow-lg flex items-center justify-center mb-6 text-white group hover:scale-110 transition-transform duration-300`}>
                <step.icon size={32} />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 mb-3">{step.title}</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed px-4">
                {step.desc}
              </p>
              {idx < steps.length - 1 && (
                 <div className="md:hidden w-px h-12 border-l border-dashed border-slate-300 my-4"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
