import React, { useState, useEffect } from "react";
import { Button } from "../shared/ui/Button";


export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#", active: true },
    { name: "Features", href: "#features" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "About Us", href: "#about" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-black text-2xl">E</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black text-slate-900 tracking-tighter">
              ElimuSight
            </span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">AI-Powered School Intel</span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-xs font-extrabold uppercase tracking-tight transition-all relative group ${
                link.active ? "text-slate-900" : "text-slate-500 hover:text-primary"
              }`}
            >
              {link.name}
              {link.active && <div className="absolute -bottom-1 left-0 w-full h-[3px] bg-primary rounded-full"></div>}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex font-extrabold text-xs uppercase tracking-tight text-slate-700 hover:bg-slate-100 border border-slate-200 px-6 h-10 rounded-xl">
            Login
          </Button>
          <Button className="font-extrabold text-xs uppercase tracking-tight bg-primary text-white px-6 h-10 rounded-xl shadow-lg shadow-primary/25 hover:scale-105 transition-transform">
            Book a Demo
          </Button>
        </div>
      </div>
    </header>
  );
};

