import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  RefreshCw,
  Plane,
  Award,
} from 'lucide-react';
import { requestAIEligibility } from '../services/aiService.ts';
import { EligibilityResult } from '../types/visa.ts';

interface EligibilityCheckerPageProps {
  onNavigate: (page: string, params?: any) => void;
  initialParams?: { origin?: string; destination?: string };
}

export const EligibilityCheckerPage: React.FC<EligibilityCheckerPageProps> = ({
  onNavigate,
  initialParams,
}) => {
  const [formData, setFormData] = useState({
    nationality: initialParams?.origin || 'United States',
    destinationCountry: initialParams?.destination || 'Japan',
    travelPurpose: 'Tourism & Sightseeing',
    stayDurationDays: 14,
    passportValidityMonths: 24,
    fundsAvailableUSD: 3500,
    hasPriorRefusals: false,
    employmentStatus: 'Employed Full-Time',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<EligibilityResult | null>(null);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const evaluation = await requestAIEligibility(formData);
      setResult(evaluation);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Consular Regulation Engine</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          AI Visa Eligibility Diagnostic
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Evaluate your border admissibility, calculate your pass probability, and identify required documents before filing your application.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Questionnaire Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleEvaluate} className="space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Traveler Profile & Itinerary Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Passport Nationality
                </label>
                <select
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany (EU)</option>
                  <option value="India">India</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Singapore">Singapore</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Destination Country
                </label>
                <select
                  value={formData.destinationCountry}
                  onChange={(e) => setFormData({ ...formData, destinationCountry: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Japan">Japan</option>
                  <option value="Schengen (EU)">Schengen Area (EU)</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Indonesia">Indonesia (Bali Nomad)</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Purpose of Trip</label>
                <select
                  value={formData.travelPurpose}
                  onChange={(e) => setFormData({ ...formData, travelPurpose: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Tourism & Sightseeing">Tourism & Sightseeing</option>
                  <option value="Business Conferences & Meetings">Business Meetings</option>
                  <option value="Remote Work / Digital Nomad">Remote Work / Digital Nomad</option>
                  <option value="Transit / Connecting Flight">Airport Transit</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Duration of Stay</label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={formData.stayDurationDays}
                  onChange={(e) => setFormData({ ...formData, stayDurationDays: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Passport Validity Remaining (Months)
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={formData.passportValidityMonths}
                  onChange={(e) => setFormData({ ...formData, passportValidityMonths: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Available Travel Funds (USD)
                </label>
                <input
                  type="number"
                  step="100"
                  value={formData.fundsAvailableUSD}
                  onChange={(e) => setFormData({ ...formData, fundsAvailableUSD: Number(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Employment Status</label>
                <select
                  value={formData.employmentStatus}
                  onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Employed Full-Time">Employed Full-Time</option>
                  <option value="Remote Contractor / Freelancer">Remote Contractor / Freelancer</option>
                  <option value="Business Owner / Founder">Business Owner / Founder</option>
                  <option value="Student">Student</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Prior Visa Refusals?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasPriorRefusals: false })}
                    className={`py-2 px-2 text-xs rounded-xl font-semibold border transition ${
                      !formData.hasPriorRefusals
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    No Prior Refusals
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasPriorRefusals: true })}
                    className={`py-2 px-2 text-xs rounded-xl font-semibold border transition ${
                      formData.hasPriorRefusals
                        ? 'border-amber-600 bg-amber-50 text-amber-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Yes, Refusal on Record
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing against Diplomatic Regulations...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run AI Eligibility Diagnostic</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Col: AI Diagnostic Output */}
        <div className="lg:col-span-5 space-y-4">
          {result ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 animate-in fade-in duration-300">
              {/* Score Meter */}
              <div className="text-center space-y-2 border-b border-slate-100 pb-4">
                <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                  AI Admissibility Rating
                </span>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-4xl font-black text-slate-900">{result.probability}%</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {result.category}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full transition-all duration-500 ${
                      result.probability >= 80
                        ? 'bg-emerald-500'
                        : result.probability >= 60
                        ? 'bg-blue-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${result.probability}%` }}
                  ></div>
                </div>
              </div>

              {/* Recommended Visa Category */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] text-slate-600 uppercase font-bold">
                  Recommended Travel Authorization
                </span>
                <p className="font-bold text-slate-900 text-sm">{result.recommendedVisaType}</p>
                <p className="text-slate-600 leading-relaxed text-[11px] pt-1">
                  {result.riskAssessment}
                </p>
              </div>

              {/* Strengths */}
              {result.strengths.length > 0 && (
                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-900 block">Verified Strengths:</span>
                  {result.strengths.map((str, i) => (
                    <div key={i} className="flex items-start space-x-2 text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Weaknesses / Flags */}
              {result.weaknesses.length > 0 && (
                <div className="space-y-2 text-xs bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-900 block">Attention Required:</span>
                  {result.weaknesses.map((w, i) => (
                    <div key={i} className="flex items-start space-x-2 text-amber-800">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Required Documents */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-slate-900 block">Required Submission Documents:</span>
                <ul className="space-y-1.5 text-slate-600">
                  {result.requiredDocuments.map((doc, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* AI Advice note */}
              <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-100 text-xs text-blue-900 space-y-1">
                <span className="font-bold block">Consular Advisor Tip:</span>
                <p className="leading-relaxed">{result.adviceNotes}</p>
              </div>

              {/* Direct Route to Apply */}
              <button
                onClick={() => onNavigate('apply')}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center space-x-1.5"
              >
                <span>Proceed to Apply for this eVisa</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-3xl border border-slate-200/80 p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">Awaiting Traveler Parameters</h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Fill in your destination, passport validity, and financial status, then click "Run AI Diagnostic".
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
