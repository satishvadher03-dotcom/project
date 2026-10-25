import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileSearch,
  Plane,
  Award,
  Users,
  Compass,
  FileCheck,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { VISA_TYPES } from '../data/visaTypesData.ts';

interface HomePageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [selectedOrigin, setSelectedOrigin] = useState('United States');
  const [selectedDestination, setSelectedDestination] = useState('Japan');

  const popularVisas = VISA_TYPES.filter((v) => v.popular).slice(0, 4);

  const handleQuickCheck = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('eligibility', { origin: selectedOrigin, destination: selectedDestination });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-blue-50/80 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-5">
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Next-Gen AI Biometric & Consular Clearance</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Electronic Visas made <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600">
                instant, predictive & secure
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Submit your eVisa application in under 5 minutes. Powered by real-time passport OCR verification, machine-learning fraud checks, and predictive consular timelines.
            </p>

            {/* Quick eVisa Destination Finder */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-xl shadow-blue-500/5 border border-slate-200 max-w-2xl mx-auto mt-6 text-left">
              <form onSubmit={handleQuickCheck} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                <div className="sm:col-span-5 space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Citizen / Passport Of
                  </label>
                  <select
                    value={selectedOrigin}
                    onChange={(e) => setSelectedOrigin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="United States">United States (USA)</option>
                    <option value="United Kingdom">United Kingdom (UK)</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany (EU)</option>
                    <option value="India">India</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Singapore">Singapore</option>
                  </select>
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Traveling To
                  </label>
                  <select
                    value={selectedDestination}
                    onChange={(e) => setSelectedDestination(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Japan">Japan (eVisa)</option>
                    <option value="Schengen (EU)">Schengen (EU 29)</option>
                    <option value="United States">United States (ESTA)</option>
                    <option value="United Kingdom">United Kingdom (ETA)</option>
                    <option value="United Arab Emirates">UAE / Dubai</option>
                    <option value="Indonesia">Indonesia (Bali Nomad)</option>
                    <option value="Canada">Canada (eTA)</option>
                    <option value="Australia">Australia (eVisitor)</option>
                  </select>
                </div>

                <div className="sm:col-span-3 pt-4 sm:pt-0">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-md shadow-blue-500/20 transition flex items-center justify-center space-x-1"
                  >
                    <span>Check AI</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={() => onNavigate('apply')}
                className="px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition shadow-sm flex items-center space-x-2"
              >
                <Plane className="w-4 h-4 text-sky-400" />
                <span>Start New eVisa Application</span>
              </button>

              <button
                onClick={() => onNavigate('eligibility')}
                className="px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition shadow-xs flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AI Eligibility Diagnostic</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Consular Queue Status Ticker */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE AI PROCESSING TELEMETRY:</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto text-xs">
              <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <span className="text-slate-600">Japan eVisa:</span>{' '}
                <span className="font-bold text-slate-800">36h avg (Fast)</span>
              </div>
              <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <span className="text-slate-600">Schengen:</span>{' '}
                <span className="font-bold text-amber-600">Normal workload</span>
              </div>
              <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <span className="text-slate-600">USA ESTA:</span>{' '}
                <span className="font-bold text-emerald-600">4h instant</span>
              </div>
              <div className="bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                <span className="text-slate-600">UAE eVisa:</span>{' '}
                <span className="font-bold text-emerald-600">12h expedited</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Counter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-blue-600 text-white rounded-3xl p-8 shadow-xl shadow-blue-500/10">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">99.4%</p>
            <p className="text-xs sm:text-sm text-blue-100">First-Time AI Verification Accuracy</p>
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">&lt; 24h</p>
            <p className="text-xs sm:text-sm text-blue-100">Average Turnaround for Approved eVisas</p>
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">190+</p>
            <p className="text-xs sm:text-sm text-blue-100">Eligible Passports & Territories</p>
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">100%</p>
            <p className="text-xs sm:text-sm text-blue-100">Paperless & Biometric Validated</p>
          </div>
        </div>
      </section>

      {/* Popular eVisa Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Destination Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Popular Electronic Visas
            </h2>
          </div>
          <button
            onClick={() => onNavigate('visas')}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center space-x-1 mt-2 sm:mt-0 transition"
          >
            <span>View all 15+ destinations</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularVisas.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl">{v.flag}</span>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    {v.category}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">
                  {v.country}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-1 mt-0.5 mb-3 font-medium">
                  {v.name}
                </p>

                <div className="space-y-1.5 py-3 border-y border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Stay Duration:</span>
                    <span className="font-semibold text-slate-800">{v.stayDuration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Processing:</span>
                    <span className="font-semibold text-emerald-600">{v.processingTimeExpress}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Gov Fee:</span>
                    <span className="font-bold text-slate-900">${v.governmentFee} USD</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center space-x-2">
                <button
                  onClick={() => onNavigate('apply', { visaId: v.id })}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition text-center"
                >
                  Apply eVisa
                </button>
                <button
                  onClick={() => onNavigate('visas', { search: v.country })}
                  className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg transition"
                  title="View details"
                >
                  <FileSearch className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How the AI eVisa System Works */}
      <section className="bg-slate-50 border-y border-slate-200/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Streamlined Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How the AI eVisa Platform Works
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              From application to diplomatic border registry clearance in four friction-free steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                STEP 01
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-3 mb-1">Select Visa Category</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose your destination country and purpose of travel (Tourism, Business, Nomad, or Transit).
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                STEP 02
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-3 mb-1">AI Passport OCR & Scan</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload your passport photo page. The AI engine instantly parses MRZ strings, verifies biometrics, and checks 6-month validity.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                STEP 03
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-3 mb-1">Predictive Time Forecast</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive an instant AI estimate of exact consular issuance date based on seasonal volume and bilateral agreements.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                STEP 04
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-3 mb-1">Instant eVisa Issuance</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Track status in real time. Once approved, download your official verified travel authorization with QR machine code.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Book a Consultant CTA Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
              <Award className="w-3.5 h-3.5" />
              <span>Licensed Bar & CICC Practitioners</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Facing a complex case or prior visa refusal?
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              Book a 1-on-1 confidential video or audio consultation with our verified immigration attorneys. Review long-term residency options, digital nomad tax structures, and expedited visa appeals.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('consultant')}
                className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm transition shadow-md shadow-blue-500/25 flex items-center space-x-2"
              >
                <span>Schedule Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('eligibility')}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition border border-slate-700"
              >
                Check Free AI Assessment First
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
