"use client";

import { motion, type Variants } from "framer-motion";
import { ArrowUpRight, Cpu, LineChart, Layers, Briefcase } from "lucide-react";

// Animation Variants for the Staggered Cascade
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const item: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function BentoGrid() {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[220px]"
    >
      {/* 1. Main Hero Card */}
      <motion.div variants={item} className="lg:col-span-2 row-span-2 rounded-3xl border border-slate-800 bg-slate-900/40 backdrop-blur-md p-8 flex flex-col justify-between group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="z-10">
          <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase">Technical Product Manager</span>
          <h1 className="mt-4 text-4xl lg:text-6xl font-bold tracking-tight text-white font-sans">
            Arnav Bhomia
          </h1>
          <p className="mt-6 text-base text-slate-400 max-w-lg leading-relaxed">
            Architecting agentic AI workflows and scaling enterprise B2B platforms from 0 to 1. Transforming complex data pipelines into intuitive product experiences.
          </p>
        </div>
        <div className="z-10 flex gap-4 mt-8">
          <button className="px-6 py-2.5 rounded-full bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)]">
            View Case Studies
          </button>
          <button className="px-6 py-2.5 rounded-full bg-slate-800 text-slate-200 font-medium text-sm hover:bg-slate-700 transition-colors border border-slate-700">
            Resume
          </button>
        </div>
      </motion.div>

      {/* 2. DEFCOM Impact Card */}
      <motion.div variants={item} className="rounded-3xl border border-slate-800 bg-gradient-to-br from-indigo-950/40 to-slate-900/50 p-6 flex flex-col justify-between group cursor-pointer hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <LineChart className="text-indigo-400 w-5 h-5" />
          </div>
          <ArrowUpRight className="text-slate-500 w-4 h-4 group-hover:text-indigo-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </div>
        <div>
          <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
            ₹3.6 Cr
          </div>
          <p className="text-sm text-slate-400 mt-2 font-medium">Annual Savings Locked</p>
          <p className="text-xs text-slate-500 mt-1">DEFCOM B2B Engine</p>
        </div>
      </motion.div>

      {/* 3. HubEye Card */}
      <motion.div variants={item} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer hover:border-violet-500/50 transition-all duration-300 hover:-translate-y-1">
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl group-hover:bg-violet-500/40 transition-all duration-700" />
        <div className="flex justify-between items-start z-10">
          <div className="p-2 bg-violet-500/10 rounded-lg">
            <Cpu className="text-violet-400 w-5 h-5" />
          </div>
          <ArrowUpRight className="text-slate-500 w-4 h-4 group-hover:text-violet-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </div>
        <div className="z-10">
          <h3 className="text-xl font-bold text-slate-200">HubEye</h3>
          <p className="text-sm text-slate-400 mt-2">Agentic AI Digital Twin Copilot</p>
        </div>
      </motion.div>

      {/* 4. Experience Card (New) */}
      <motion.div variants={item} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between group">
        <div className="flex items-center gap-3">
          <Briefcase className="text-slate-400 w-5 h-5" />
          <h3 className="text-sm font-medium text-slate-300">Experience</h3>
        </div>
        <div className="mt-4">
          <p className="text-lg font-semibold text-slate-200">Delhivery</p>
          <p className="text-sm text-indigo-400">PM Intern | MidMile</p>
          <p className="text-xs text-slate-500 mt-2">Feb 2026 — Present</p>
        </div>
      </motion.div>

      {/* 5. Core Skills Card (New) */}
      <motion.div variants={item} className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-center group relative overflow-hidden">
        <div className="flex items-center gap-3 mb-6">
          <Layers className="text-slate-400 w-5 h-5" />
          <h3 className="text-sm font-medium text-slate-300">Technical Arsenal</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {["System Design", "API Specifications", "B2B SaaS", "0 to 1 Lifecycle", "PostgreSQL", "Python", "Data Pipelines", "A/B Testing"].map((skill) => (
            <span key={skill} className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-md text-xs text-slate-300 font-medium">
              {skill}
            </span>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
}