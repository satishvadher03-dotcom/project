import React, { useState } from 'react';
import {
  Compass,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
  Shield,
  Plane,
} from 'lucide-react';
import { VISA_TYPES } from '../data/visaTypesData.ts';
import { VisaTypeDetail } from '../types/visa.ts';

interface VisaTypesPageProps {
  onNavigate: (page: string, params?: any) => void;
  initialSearch?: string;
}

export const VisaTypesPage: React.FC<VisaTypesPageProps> = ({ onNavigate, initialSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedVisaDetail, setSelectedVisaDetail] = useState<VisaTypeDetail | null>(null);

  const categories = ['All', 'Tourist', 'Business', 'Digital Nomad', 'Transit'];

  const filteredVisas = VISA_TYPES.filter((v) => {
    const matchesSearch =
      v.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedCategory !== 'All' && v.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Global Border Clearance Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          eVisa Types & Country Requirements
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Transparent sovereign consular fees, stay durations, and biometric entry prerequisites across major world jurisdictions.
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search country, visa type, or category..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`py-1.5 px-3 rounded-lg font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Visas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVisas.map((visa) => (
          <div
            key={visa.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{visa.flag}</span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  {visa.category}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base">{visa.country}</h3>
              <p className="text-xs text-slate-600 font-medium mb-3">{visa.name}</p>

              <div className="space-y-1.5 py-3 border-y border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Stay Allowed:</span>
                  <span className="font-semibold text-slate-800">{visa.stayDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Entry Type:</span>
                  <span className="font-semibold text-slate-800">{visa.entryType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Queue:</span>
                  <span className="font-semibold text-slate-800">{visa.processingTimeNormal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fast-Track Express:</span>
                  <span className="font-bold text-emerald-600">{visa.processingTimeExpress}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-100 text-slate-900 font-bold">
                  <span>Gov Consular Fee:</span>
                  <span className="text-blue-600 font-black">${visa.governmentFee} USD</span>
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <div className="flex gap-2">
                <button
                  onClick={() => onNavigate('apply', { visaId: visa.id })}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition text-center"
                >
                  Apply Online
                </button>
                <button
                  onClick={() => setSelectedVisaDetail(visa)}
                  className="py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  Prerequisites
                </button>
              </div>

              <button
                onClick={() => onNavigate('eligibility', { destination: visa.country })}
                className="w-full text-center text-[11px] font-semibold text-blue-600 hover:underline"
              >
                Check AI Eligibility for {visa.country} →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Prerequisites Detail Modal */}
      {selectedVisaDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-3xl">{selectedVisaDetail.flag}</span>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedVisaDetail.country}</h3>
                  <p className="text-xs text-slate-600 font-medium">{selectedVisaDetail.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedVisaDetail(null)}
                className="p-1 text-slate-600 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-600">Admissibility Criterion</span>
                <p className="text-slate-700 leading-relaxed">{selectedVisaDetail.eligibilityDescription}</p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-900 block">Mandatory Required Documents:</span>
                <ul className="space-y-2 text-slate-600">
                  {selectedVisaDetail.requirements.map((req, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-600 block">Standard Processing</span>
                  <span className="font-bold text-slate-800">{selectedVisaDetail.processingTimeNormal}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-600 block">Express Fast-Track</span>
                  <span className="font-bold text-emerald-600">{selectedVisaDetail.processingTimeExpress}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedVisaDetail(null)}
                className="py-2.5 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const id = selectedVisaDetail.id;
                  setSelectedVisaDetail(null);
                  onNavigate('apply', { visaId: id });
                }}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                Start {selectedVisaDetail.country} Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
