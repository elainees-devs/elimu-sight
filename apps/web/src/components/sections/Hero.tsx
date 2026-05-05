import React from "react";


import { TrendingUp, BookOpen, Users, Check } from "lucide-react";
import { Button } from "../shared/ui/Button";
import { DashboardPreview } from "../dashboard/DashboardPreview";

export const HeroSection: React.FC = () => {
  return (
    <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-[1.1fr,1.3fr] gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8 max-w-2xl">
            <div>
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/5 text-primary border border-primary/10 text-xs font-bold mb-6">
                Smarter Decisions. Better Outcomes.
              </div>
              <h1 className="text-5xl lg:text-[76px] font-extrabold text-slate-900 leading-[1.05] tracking-tight mb-6 font-sans">
                AI-Powered Insights <br />
                for Every <span className="text-primary">Learner</span>
              </h1>
              <p className="text-lg lg:text-xl text-slate-500 leading-relaxed mb-8 max-w-xl">
                ElimuSight transforms school data into actionable intelligence. Identify learning gaps, predict performance and empower teachers, parents and students.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-slate-100 shadow-sm text-sm font-bold text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <TrendingUp size={18} />
                </div>
                Predict <br /> Performance
              </div>
              <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-slate-100 shadow-sm text-sm font-bold text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <BookOpen size={18} />
                </div>
                CBC Learning <br /> Analytics
              </div>
              <div className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl border border-slate-100 shadow-sm text-sm font-bold text-slate-700">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                  <Users size={18} />
                </div>
                Smart insights for <br /> Teachers & Parents
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="px-10 h-14 bg-primary text-white font-bold rounded-xl flex items-center gap-2">
                Get Started Free <span className="text-lg">→</span>
              </Button>
              <Button variant="outline" size="lg" className="px-10 h-14 border-primary text-primary font-bold rounded-xl flex items-center gap-2">
                Book a Demo <span className="text-lg">▶</span>
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check size={12} />
                </div>
                Trusted by schools across Kenya
            </div>
          </div>

          {/* Right Column */}
          <div className="relative pt-10">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
             <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
};

