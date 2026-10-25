import React, { useEffect, useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Calendar,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Plane,
  Upload,
  RefreshCw,
  QrCode,
  X,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { applicationService } from '../services/applicationService.ts';
import { VisaApplication, Consultation } from '../types/visa.ts';

interface DashboardPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const { user, role } = useAuth();
  const [applications, setApplications] = useState<VisaApplication[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'approved' | 'action'>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAppForEVisa, setSelectedAppForEVisa] = useState<VisaApplication | null>(null);
  const [actionModalApp, setActionModalApp] = useState<VisaApplication | null>(null);
  const [actionResponseText, setActionResponseText] = useState<string>('');

  // Password Security Gate State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('auravisa_unlocked_applicant') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === 'travel123' || passwordInput.trim() === 'pass123') {
      sessionStorage.setItem('auravisa_unlocked_applicant', 'true');
      setIsUnlocked(true);
      setAuthError(null);
    } else {
      setAuthError('Invalid Security Key. Default hint: "travel123"');
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem('auravisa_unlocked_applicant');
    setIsUnlocked(false);
    setPasswordInput('');
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const apps = await applicationService.getUserApplications(user?.uid || 'demo-applicant-001');
      const cons = await applicationService.getConsultations(user?.uid || 'demo-applicant-001');
      setApplications(apps);
      setConsultations(cons);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const filteredApps = applications.filter((app) => {
    if (filter === 'active') return app.status === 'submitted' || app.status === 'under_review';
    if (filter === 'approved') return app.status === 'approved';
    if (filter === 'action') return app.status === 'action_required';
    return true;
  });

  const handleResolveAction = async () => {
    if (!actionModalApp) return;
    try {
      await applicationService.updateApplicationStatus(
        actionModalApp.id,
        'under_review',
        `Applicant provided requested verification documents: "${actionResponseText || 'Updated passport scans uploaded'}"`
      );
      setActionModalApp(null);
      setActionResponseText('');
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-blue-500/5 space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900">
              Traveler Portal Locked
            </h2>
            <p className="text-xs text-slate-600">
              Security password required to access visa records, travel credentials, and consular correspondence.
            </p>
          </div>

          {authError && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-center space-x-2 text-left">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Security Key / Traveler PIN
              </label>
              <input
                type="password"
                required
                autoFocus
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100 text-xs flex items-center justify-between">
              <span className="text-[11px] text-blue-950">
                Default: <code className="font-bold bg-white px-1.5 py-0.5 rounded border border-blue-200">travel123</code>
              </span>
              <button
                type="button"
                onClick={() => {
                  setPasswordInput('travel123');
                  sessionStorage.setItem('auravisa_unlocked_applicant', 'true');
                  setIsUnlocked(true);
                }}
                className="text-[11px] font-bold text-blue-700 hover:underline flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Autofill & Unlock</span>
              </button>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="flex-1 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Return Home
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Unlock Portal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome & Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
            alt="Profile"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/20 shadow-xs"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-slate-900">
                Welcome, {user?.displayName?.split(' ')[0] || 'Traveler'}
              </h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase">
                {role}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Citizen of {user?.nationality || 'United States'} • Account active and synchronized with border control
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('apply')}
            className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center space-x-1.5"
          >
            <Plane className="w-3.5 h-3.5" />
            <span>Apply for New eVisa</span>
          </button>
          <button
            onClick={() => onNavigate('consultant')}
            className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Consultation</span>
          </button>
          <button
            onClick={handleLock}
            className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5 border border-slate-200"
            title="Lock Portal Session"
          >
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-600">Total Applications</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{applications.length}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-600">Approved eVisas</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">
            {applications.filter((a) => a.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-600">Under Review</span>
          <p className="text-2xl font-black text-blue-600 mt-1">
            {applications.filter((a) => a.status === 'under_review' || a.status === 'submitted').length}
          </p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-600">Action Required</span>
          <p className="text-2xl font-black text-amber-600 mt-1">
            {applications.filter((a) => a.status === 'action_required').length}
          </p>
        </div>
      </div>

      {/* Main Grid: Applications List + Scheduled Consultations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Applications */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              Your Visa Applications & Real-Time Tracking
            </h2>

            {/* Filter Pills */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  filter === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  filter === 'approved' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Approved
              </button>
              <button
                onClick={() => setFilter('action')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  filter === 'action' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Action Needed
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-600 text-sm">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
              Loading your travel dossiers...
            </div>
          ) : filteredApps.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
              <FileText className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <p className="font-bold text-slate-800">No applications found in this view</p>
                <p className="text-xs text-slate-600">Start an application to view live tracking and AI estimates.</p>
              </div>
              <button
                onClick={() => onNavigate('apply')}
                className="py-2 px-4 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Apply for an eVisa
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-base">
                          {app.destinationCountry} - {app.visaType}
                        </span>
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          #{app.id}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Passport: <span className="font-mono font-medium">{app.passportNumber}</span> • Travel: {app.travelDate}
                      </p>
                    </div>

                    {/* Status Badge */}
                    <div className="self-start sm:self-auto">
                      {app.status === 'approved' && (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>eVisa Approved</span>
                        </span>
                      )}
                      {app.status === 'under_review' && (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Under Consular Review</span>
                        </span>
                      )}
                      {app.status === 'submitted' && (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Submitted</span>
                        </span>
                      )}
                      {app.status === 'action_required' && (
                        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Action Required</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status Progress Steps */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-600 block">Step 1: AI Verification</span>
                      <span className="font-bold text-emerald-600 flex items-center justify-center space-x-1 mt-0.5">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{app.aiVerificationScore}% Validated</span>
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-600 block">Step 2: Predictive ETA</span>
                      <span className="font-bold text-blue-600 block mt-0.5">
                        {app.aiEstimatedDate || '2-3 Business Days'}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-600 block">Step 3: Border Clearance</span>
                      <span className="font-bold text-slate-800 capitalize block mt-0.5">
                        {app.status === 'approved' ? 'Issued' : 'In Progress'}
                      </span>
                    </div>
                  </div>

                  {/* Action Required Banner if flagged */}
                  {app.status === 'action_required' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-2">
                      <div className="flex items-center space-x-2 font-bold">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span>Officer Request: Additional Documentation Needed</span>
                      </div>
                      <p className="leading-relaxed">
                        {app.actionRequiredReason || app.officerNotes || 'Please upload an updated passport photograph and round-trip flight booking.'}
                      </p>
                      <button
                        onClick={() => setActionModalApp(app)}
                        className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition flex items-center space-x-1"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Requested Documents</span>
                      </button>
                    </div>
                  )}

                  {/* Actions footer */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-600">
                      Fee: ${app.feeAmount} USD ({app.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'})
                    </span>

                    <div className="flex items-center space-x-2">
                      {app.status === 'approved' && (
                        <button
                          onClick={() => setSelectedAppForEVisa(app)}
                          className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs transition flex items-center space-x-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>View Official eVisa Document</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Consultations & AI Insights */}
        <div className="space-y-6">
          {/* Scheduled Consultations */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Immigration Advisory Calls</span>
              </h3>
              <button
                onClick={() => onNavigate('consultant')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                + Book New
              </button>
            </div>

            {consultations.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-600 space-y-2">
                <p>No upcoming advisory consultations.</p>
                <button
                  onClick={() => onNavigate('consultant')}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Schedule an appointment with a licensed counsel
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {consultations.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{c.consultantName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                        {c.meetingType.toUpperCase()} CALL
                      </span>
                    </div>
                    <p className="text-slate-600 line-clamp-1">{c.topic}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-slate-600 text-[11px]">
                      <span>{c.dateTime}</span>
                      <span className="text-emerald-600 font-semibold">{c.duration} mins</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Visa Assistant & FAQ Quick Helper */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-200 p-5 space-y-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-xs text-blue-900 uppercase tracking-wider">
                AI Consular Assistant
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Have questions regarding 90/180-day Schengen rules, digital nomad tax liabilities, or passport validity rules?
            </p>
            <button
              onClick={() => onNavigate('eligibility')}
              className="w-full py-2 px-3 bg-white hover:bg-slate-50 text-blue-700 border border-blue-200 rounded-xl text-xs font-semibold shadow-xs transition text-center"
            >
              Run Instant AI Eligibility Check
            </button>
          </div>
        </div>
      </div>

      {/* Official Approved eVisa Document Modal */}
      {selectedAppForEVisa && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Official Electronic Visa (eVisa)
                  </h3>
                  <p className="text-xs text-slate-600">Sovereign Border Control Clearance</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedAppForEVisa(null)}
                className="p-1 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Credential Certificate View */}
            <div className="bg-slate-50 rounded-2xl border-2 border-slate-300 p-6 space-y-4 font-sans text-xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">
                    Authorizing State
                  </span>
                  <p className="text-lg font-black text-slate-900">
                    {selectedAppForEVisa.destinationCountry.toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">
                    eVisa Reference No.
                  </span>
                  <p className="font-mono font-bold text-blue-600 text-sm">
                    {selectedAppForEVisa.eVisaNumber || 'EV-9982410-OK'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-600 block text-[10px] uppercase">Traveler Name</span>
                  <p className="font-bold text-slate-900 text-sm">{selectedAppForEVisa.applicantName}</p>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px] uppercase">Nationality</span>
                  <p className="font-bold text-slate-900">{selectedAppForEVisa.nationality}</p>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px] uppercase">Passport Number</span>
                  <p className="font-mono font-bold text-slate-900">{selectedAppForEVisa.passportNumber}</p>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px] uppercase">Visa Category</span>
                  <p className="font-semibold text-slate-900">{selectedAppForEVisa.visaType}</p>
                </div>
              </div>

              {/* Simulated Machine-Readable Zone (MRZ) */}
              <div className="bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px] text-slate-800 tracking-widest leading-relaxed">
                <div>{`EV${selectedAppForEVisa.destinationCountry.substring(0, 3).toUpperCase()}${selectedAppForEVisa.applicantName.replace(' ', '<<').toUpperCase()}<<<<<<<<<<<<<<<<<<`}</div>
                <div>{`${selectedAppForEVisa.passportNumber}4USA9204128M3008152<<<<<<<<<<<<<<04`}</div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>BIOMETRIC CLEARANCE ACTIVE</span>
                </div>
                <QrCode className="w-8 h-8 text-slate-800" />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedAppForEVisa(null)}
                className="py-2.5 px-4 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Print / Save PDF Credential</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Required Document Upload Modal */}
      {actionModalApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span>Respond to Consular Request</span>
              </h3>
              <button
                onClick={() => setActionModalApp(null)}
                className="p-1 text-slate-600 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              For Application <span className="font-mono font-bold text-slate-800">#{actionModalApp.id}</span>
            </p>

            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
              <span className="font-bold block mb-1">Officer Remark:</span>
              <p>{actionModalApp.actionRequiredReason || actionModalApp.officerNotes}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Applicant Explanation & Document Note
              </label>
              <textarea
                rows={3}
                value={actionResponseText}
                onChange={(e) => setActionResponseText(e.target.value)}
                placeholder="e.g. Uploaded high-contrast passport bio-page scan and confirmed hotel reservation."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50">
              <Upload className="w-6 h-6 text-slate-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-800">Click to upload replacement document scans</p>
              <p className="text-[10px] text-slate-600">PDF, JPG, PNG up to 10MB</p>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setActionModalApp(null)}
                className="py-2 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveAction}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                Submit Documents for Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
