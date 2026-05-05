import React from "react";
import { Button } from "../shared/ui/Button";

export const Footer: React.FC = () => {
  return (
    <footer id="about" className="relative pt-24 pb-12 overflow-hidden bg-slate-950">
      {/* Background Image / Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=2000" 
          alt="Students" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 leading-tight">
            Ready to <span className="text-primary italic">Transform</span> Your School?
          </h2>
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Join 100+ schools and start making data-driven decisions that empower every learner in your care.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="px-12 h-14">
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" className="px-12 h-14 border-white text-white hover:bg-white/10">
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              ElimuSight
            </span>
          </div>

          <p className="text-slate-500 text-sm">
            © 2026 ElimuSight. All rights reserved. Designed for the future of African education.
          </p>

          <div className="flex gap-6 text-slate-500 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
