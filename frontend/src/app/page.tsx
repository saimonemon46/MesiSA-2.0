"use client";
import React, { useEffect, useState } from "react";

interface ServiceStatus {
  name: string;
  url: string;
  status: "checking" | "online" | "offline";
  details?: Record<string, unknown>;
}

const INITIAL_SERVICES: ServiceStatus[] = [
  { name: "Core Backend (Laravel API)", url: "http://localhost:8005/api/health", status: "checking" },
  { name: "AI & FRAG Engine (FastAPI)", url: "http://localhost:8006/healthz", status: "checking" },
];

export default function Home() {
  const [services, setServices] = useState<ServiceStatus[]>(INITIAL_SERVICES);

  useEffect(() => {
    INITIAL_SERVICES.forEach(async (srv, idx) => {
      try {
        const res = await fetch(srv.url, { mode: "cors" });
        if (res.ok) {
          const data = (await res.json()) as Record<string, unknown>;
          setServices((prev) => {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], status: "online", details: data };
            return copy;
          });
        } else {
          setServices((prev) => {
            const copy = [...prev];
            copy[idx] = { ...copy[idx], status: "offline" };
            return copy;
          });
        }
      } catch {
        setServices((prev) => {
          const copy = [...prev];
          copy[idx] = { ...copy[idx], status: "offline" };
          return copy;
        });
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-navy-900 bg-slate-900 flex items-center justify-center text-teal-400 font-bold text-lg shadow-sm">
              M
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Medi<span className="text-teal-600">SA</span>
            </span>
            <span className="ml-2 px-2.5 py-0.5 text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200 rounded-full">
              Federated RAG
            </span>
          </div>

          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#discovery" className="hover:text-slate-900 transition-colors">Healthcare Discovery</a>
            <a href="#research" className="hover:text-slate-900 transition-colors">Research Benchmarks</a>
            <span className="h-4 w-px bg-slate-200"></span>
            <span className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Dev Mode
            </span>
          </nav>
        </div>
      </header>

      {/* Main Hero */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full">
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Intelligent Healthcare Discovery
          </h1>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Finding the right department and specialist powered by distributed clinical evidence and Federated RAG.
          </p>
        </div>

        {/* Natural Language Query Card Mock */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-12 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Ask anything in natural language</span>
          </div>
          <div className="relative">
            <input
              type="text"
              readOnly
              placeholder="e.g., I've been having recurring headaches for 3 weeks. Which specialist should I see?"
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 text-base"
            />
            <button className="absolute right-2 top-2 px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm">
              Discover
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-600">Sample queries:</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded cursor-pointer hover:bg-slate-200">Recurring migranes</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded cursor-pointer hover:bg-slate-200">Joint pain after running</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded cursor-pointer hover:bg-slate-200">Chest tightness and fatigue</span>
          </div>
        </div>

        {/* System & Microservices Health Grid */}
        <div className="border-t border-slate-200 pt-8">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
            System Topology & Step 1 Verification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Frontend Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-800 text-base">Next.js 14 Frontend</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  ● Online
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                SSR / App Router UI with modern healthcare aesthetic (Navy & Teal).
              </p>
              <div className="text-xs text-slate-400">Port: 3005 (Local)</div>
            </div>

            {/* Backend Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-800 text-base">Laravel 11 Backend</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    services[0].status === "online"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  ● {services[0].status === "online" ? "Online" : "Pending Start"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Core REST API, Sanctum Auth, PostgreSQL + pgvector interface.
              </p>
              <div className="text-xs text-slate-400">Port: 8005 (Local)</div>
            </div>

            {/* AI Service Card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-slate-800 text-base">FastAPI AI Engine</span>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    services[1].status === "online"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  ● {services[1].status === "online" ? "Online" : "Pending Start"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Federated RAG across distributed hospital knowledge bases.
              </p>
              <div className="text-xs text-slate-400">Port: 8006 (Local)</div>
            </div>
          </div>
        </div>
      </main>

      {/* Safety Notice & Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            <strong className="text-slate-700">Clinical Disclaimer:</strong> MediSA provides informational matching based on hospital knowledge bases and does not provide clinical diagnoses.
          </p>
          <div className="flex items-center gap-4">
            <span>MediSA Engineering v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
