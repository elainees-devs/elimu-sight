import React from "react";

const stats = [
  { label: "Schools Onboard", value: "100+" },
  { label: "Students Impacted", value: "30,000+" },
  { label: "Improvement in Early Intervention", value: "85%" },
  { label: "Teacher Satisfaction", value: "95%" },
  { label: "Uptime & Data Security", value: "99.9%" },
];

export const StatsBar: React.FC = () => {
  return (
    <section className="bg-indigo-950 py-16 relative overflow-hidden">
      {/* Decorative background grid pattern or light rays from image */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-px h-full bg-white/20"></div>
        <div className="absolute top-0 left-2/4 w-px h-full bg-white/20"></div>
        <div className="absolute top-0 left-3/4 w-px h-full bg-white/20"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 md:gap-4 items-start">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center group flex flex-col items-center">
              {/* Optional small icon from image mockup */}
              <div className="text-white/20 mb-4 group-hover:text-primary transition-colors duration-500">
                 {/* SVG or simple shape placeholder for the icons above the stats */}
                 <div className="w-8 h-8 rounded border border-white/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-sm bg-white/10 group-hover:bg-primary/40 transition-colors"></div>
                 </div>
              </div>
              
              <div className="text-4xl lg:text-5xl font-black text-white mb-3 tracking-tighter">
                {stat.value}
              </div>
              <div className="text-indigo-200/60 text-[10px] uppercase font-extrabold tracking-widest leading-tight max-w-[120px] mx-auto">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
