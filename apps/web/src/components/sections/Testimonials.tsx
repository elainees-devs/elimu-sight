import React from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "John Mwangi",
    role: "Headteacher, Greenhill Academy",
    quote: "ElimuSight has transformed how we identify and support struggling learners. Our performance has improved significantly.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Grace Wanjiku",
    role: "Math Teacher, Brookside School",
    quote: "The AI insights are accurate and practical. I now know exactly what my students need help with each week.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  },
  {
    name: "Mary Kamau",
    role: "Parent",
    quote: "As a parent, I finally understand my child's strengths and areas to improve. ElimuSight is a game changer!",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
  },
];

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl lg:text-4xl font-extrabold text-center text-slate-900 mb-16">
          What Schools Are Saying
        </h2>
        
        <div className="relative max-w-6xl mx-auto">
          {/* Decorative navigation buttons from image */}
          <button className="absolute -left-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-primary bg-white shadow-sm hover:bg-slate-50 opacity-50 lg:opacity-100">
             <ChevronLeft size={20} />
          </button>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 flex flex-col items-start relative overflow-hidden group hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="text-primary opacity-20 absolute top-4 left-4 scale-[4]">"</div>
                
                <div className="flex gap-1 mb-6 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400" fill="currentColor" />
                  ))}
                </div>
                
                <p className="text-slate-700 font-medium mb-8 leading-relaxed relative z-10 text-sm">
                  {t.quote}
                </p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <img 
                    src={t.image} 
                    alt={t.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" 
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{t.name}</h4>
                    <p className="text-slate-500 text-[10px] font-bold">{t.role}</p>
                    <div className="flex gap-0.5 mt-1">
                       {[...Array(5)].map((_, i) => <div key={i} className="w-1 h-1 rounded-full bg-emerald-500"></div>)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="absolute -right-12 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-primary bg-white shadow-sm hover:bg-slate-50 opacity-50 lg:opacity-100">
             <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};
