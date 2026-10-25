import React from 'react';
import { ShieldCheck, Lock, Globe2, FileCheck2, Award } from 'lucide-react';

export const Footer: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 text-slate-600 text-sm">
      {/* Trust & Security Badges row */}
      <div className="border-b border-slate-200/80 bg-slate-50/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">ICAO Doc 9303</p>
                <p className="text-[11px] text-slate-600">Standard Machine-Readable Passports</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">256-bit TLS Encryption</p>
                <p className="text-[11px] text-slate-600">Bank-Grade PII Security Isolation</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">AI Document Biometrics</p>
                <p className="text-[11px] text-slate-600">Instant OCR & Tamper Detection</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-lg">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Licensed Immigration Counsel</p>
                <p className="text-[11px] text-slate-600">Accredited Bar & CICC Practitioners</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                Aura<span className="text-blue-600">Visa</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              The next-generation electronic visa processing network. Combining real-time machine-learning document validation, predictive processing forecasts, and certified immigration expertise for sovereign border security and smooth traveler mobility.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-600">
              <Globe2 className="w-4 h-4 text-blue-600" />
              <span>Available in 190+ jurisdictions worldwide</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              eVisa Portals
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('visas')} className="hover:text-blue-600 transition">
                  Tourist & Holiday eVisas
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('visas')} className="hover:text-blue-600 transition">
                  Digital Nomad & Remote Permits
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('visas')} className="hover:text-blue-600 transition">
                  Business & Executive e-Pass
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('visas')} className="hover:text-blue-600 transition">
                  Transit & Airport Clearances
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              AI Tools & Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('eligibility')} className="hover:text-blue-600 transition">
                  AI Eligibility Checker
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('apply')} className="hover:text-blue-600 transition">
                  Passport OCR Scanner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-blue-600 transition">
                  Predictive Processing Timeline
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('consultant')} className="hover:text-blue-600 transition">
                  Book Immigration Lawyer
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Governance & Admin
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('admin')} className="hover:text-blue-600 font-semibold text-indigo-700 transition">
                  Consular Officer Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('login')} className="hover:text-blue-600 transition">
                  Role-Based Access (RBAC)
                </button>
              </li>
              <li>
                <span className="text-slate-600">Privacy & PII Protection</span>
              </li>
              <li>
                <span className="text-slate-600">Terms of Consular Filing</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600">
          <p>© {new Date().getFullYear()} AuraVisa Consular Technologies Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 text-[11px]">
            Final travel authorization remains subject to immigration officer review at ports of entry.
          </p>
        </div>
      </div>
    </footer>
  );
};
