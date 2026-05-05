import React from "react";

export const DashboardPreview: React.FC = () => {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Main Dashboard Window */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform hover:-translate-y-1 transition-transform duration-500">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="h-6 w-48 bg-slate-200 rounded-full"></div>
        </div>
        
        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Total Students</p>
              <h4 className="text-2xl font-bold text-slate-900 leading-none">1,248</h4>
              <p className="text-xs text-green-600 font-medium mt-1">↑ 12% from last month</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Attendance Rate</p>
              <h4 className="text-2xl font-bold text-slate-900 leading-none">94.2%</h4>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
                <div className="bg-primary h-full w-[94%] rounded-full"></div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Learning Gaps</p>
              <h4 className="text-2xl font-bold text-slate-900 leading-none">58</h4>
              <p className="text-xs text-amber-600 font-medium mt-1">Found in Mathematics</p>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h5 className="font-bold text-slate-800">Learning Analytics Performance</h5>
              <div className="flex gap-2">
                <div className="px-2 py-1 rounded bg-slate-100 text-[10px] font-bold text-slate-600">Month</div>
                <div className="px-2 py-1 rounded bg-slate-100 text-[10px] font-bold text-slate-600">Year</div>
              </div>
            </div>
            <div className="h-48 w-full bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex items-end justify-between px-8 pb-4 gap-4">
              <div className="w-full bg-primary/20 h-24 rounded-t-lg"></div>
              <div className="w-full bg-primary/40 h-32 rounded-t-lg"></div>
              <div className="w-full bg-primary/30 h-16 rounded-t-lg"></div>
              <div className="w-full bg-primary/60 h-40 rounded-t-lg"></div>
              <div className="w-full bg-primary/50 h-28 rounded-t-lg"></div>
              <div className="w-full bg-primary/80 h-36 rounded-t-lg"></div>
              <div className="w-full bg-primary/100 h-44 rounded-t-lg"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Accents */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};
