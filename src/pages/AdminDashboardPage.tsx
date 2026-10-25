import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Search,
  Filter,
  Sparkles,
  RefreshCw,
  Eye,
  Send,
  Users,
  Settings,
  Sliders,
  DollarSign,
  Activity,
  Globe2,
  FileText,
  Download,
  X,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { applicationService } from '../services/applicationService.ts';
import { requestAIAutomatedDispatch } from '../services/aiService.ts';
import { VisaApplication } from '../types/visa.ts';

interface AdminDashboardPageProps {
  onNavigate: (page: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const { user, role, isOfficerOrAdmin, switchRole } = useAuth();
  const [activeTab, setActiveTab] = useState<'queue' | 'analytics' | 'policies' | 'users'>('queue');
  const [applications, setApplications] = useState<VisaApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'submitted' | 'under_review' | 'flagged' | 'approved' | 'action_required'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected application for deep-dive review
  const [selectedApp, setSelectedApp] = useState<VisaApplication | null>(null);
  const [officerNotes, setOfficerNotes] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [isGeneratingDispatch, setIsGeneratingDispatch] = useState(false);
  const [generatedDispatch, setGeneratedDispatch] = useState<{
    dispatchReference: string;
    subject: string;
    officialBody: string;
    actionItems: string[];
  } | null>(null);

  // Policy Settings state
  const [policies, setPolicies] = useState({
    strictPassportExpiry6Months: true,
    autoApproveHighConfidenceAI: false,
    requireSchengenMedicalInsurance: true,
    expressFastTrackAvailable: true,
    maxDailyApplicationsCap: 500,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await applicationService.getAllApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.passportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.destinationCountry.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'submitted') return app.status === 'submitted';
    if (filter === 'under_review') return app.status === 'under_review';
    if (filter === 'flagged') return app.aiVerificationScore < 80 || app.aiRiskLevel === 'high';
    if (filter === 'approved') return app.status === 'approved';
    if (filter === 'action_required') return app.status === 'action_required';
    return true;
  });

  const handleGenerateDispatch = async (targetStatus: 'approved' | 'action_required' | 'rejected') => {
    if (!selectedApp) return;
    setIsGeneratingDispatch(true);
    try {
      const dispatch = await requestAIAutomatedDispatch({
        applicationId: selectedApp.id,
        applicantName: selectedApp.applicantName,
        destinationCountry: selectedApp.destinationCountry,
        visaType: selectedApp.visaType,
        newStatus: targetStatus,
        officerNotes: officerNotes || (targetStatus === 'approved' ? 'Biometrics and itinerary confirmed.' : 'Incomplete documentation.'),
      });
      setGeneratedDispatch(dispatch);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingDispatch(false);
    }
  };

  const handleUpdateStatus = async (newStatus: VisaApplication['status']) => {
    if (!selectedApp) return;
    try {
      const updated = await applicationService.updateApplicationStatus(
        selectedApp.id,
        newStatus,
        officerNotes || 'Adjudicated by Consular Review Board',
        newStatus === 'action_required' ? (actionReason || 'Please upload updated document scans.') : undefined
      );
      setSelectedApp(updated);
      setGeneratedDispatch(null);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Analytics calculations
  const totalRevenue = applications.reduce((acc, a) => acc + (a.paymentStatus === 'paid' ? a.feeAmount : 0), 0);
  const approvedCount = applications.filter((a) => a.status === 'approved').length;
  const flaggedCount = applications.filter((a) => a.aiVerificationScore < 80 || a.aiRiskLevel === 'high').length;
  const approvalRate = applications.length ? Math.round((approvedCount / applications.length) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* RBAC Notice if user is not in Officer/Admin mode */}
      {!isOfficerOrAdmin && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-bold">Officer / Admin Role Required for Production Actions</span>
              <p className="text-[11px] text-amber-700">
                You are currently in <strong className="uppercase">{role}</strong> preview. Switch to Consular Officer mode for full adjudication authority.
              </p>
            </div>
          </div>
          <button
            onClick={() => switchRole('officer')}
            className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold transition shrink-0"
          >
            Switch to Officer Mode
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Sovereign Immigration Authority
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Consular & Administrative Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Consolidated intelligence on cross-border applications, AI document fraud alerts, policy configuration, and revenue.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadData}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Sync Database</span>
            </button>
            <button
              onClick={() => onNavigate('consultant-dashboard')}
              className="py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition"
            >
              Consultant Desk
            </button>
          </div>
        </div>

        {/* Global Performance Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs text-slate-600 font-medium">Total Dossiers Logged</span>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{applications.length}</p>
            <span className="text-[11px] text-blue-600 font-semibold">{applications.filter((a) => a.status === 'under_review').length} in active review</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs text-slate-600 font-medium">Consular Approval Rate</span>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{approvalRate}%</p>
            <span className="text-[11px] text-emerald-700 font-semibold">{approvedCount} issued eVisas</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs text-slate-600 font-medium">AI Flagged / Tamper Alert</span>
            <p className="text-2xl font-black text-amber-600 mt-0.5">{flaggedCount}</p>
            <span className="text-[11px] text-amber-700 font-semibold">Consular inspection needed</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs text-slate-600 font-medium">Total Government Fees</span>
            <p className="text-2xl font-black text-slate-900 mt-0.5">${totalRevenue.toLocaleString()} USD</p>
            <span className="text-[11px] text-slate-600">Settled to treasury</span>
          </div>
        </div>
      </div>

      {/* Main Admin Navigation Tabs */}
      <div className="flex rounded-2xl bg-slate-200/70 p-1 text-xs font-bold w-full max-w-xl mx-auto shadow-xs">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'queue' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Adjudication Queue</span>
        </button>

        <button
          onClick={() => setActiveTab('policies')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'policies' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Border Policies</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'users' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Staff & Roles</span>
        </button>
      </div>

      {/* TAB 1: Adjudication Queue */}
      {activeTab === 'queue' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search applicant name, passport, ref ID..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {(['all', 'submitted', 'under_review', 'flagged', 'approved', 'action_required'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`py-1.5 px-3 rounded-lg font-semibold capitalize transition ${
                    filter === s
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-slate-100 rounded-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Ref & Date</th>
                  <th className="py-3 px-4">Traveler & Passport</th>
                  <th className="py-3 px-4">Destination</th>
                  <th className="py-3 px-4">AI Verification</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-blue-600 block">#{app.id}</span>
                      <span className="text-[11px] text-slate-600">{app.submittedAt?.split('T')[0] || app.createdAt.split('T')[0]}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{app.applicantName}</span>
                      <span className="text-slate-600">{app.nationality} • {app.passportNumber}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 block">{app.destinationCountry}</span>
                      <span className="text-slate-600 truncate max-w-[130px] block">{app.visaType}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-black text-sm ${
                          app.aiVerificationScore >= 85
                            ? 'text-emerald-600'
                            : app.aiVerificationScore >= 70
                            ? 'text-blue-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {app.aiVerificationScore}%
                      </span>
                      {app.aiVerificationScore < 80 && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
                          RISK
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase inline-block ${
                          app.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : app.status === 'action_required'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setOfficerNotes(app.officerNotes || '');
                          setActionReason(app.actionRequiredReason || '');
                          setGeneratedDispatch(null);
                        }}
                        className="py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition"
                      >
                        Adjudicate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Border Policies */}
      {activeTab === 'policies' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Border Policy & Machine Rules</h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Configure sovereign security thresholds for automated passport validation.
            </p>
          </div>

          <div className="space-y-4 max-w-2xl text-xs">
            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50">
              <div>
                <span className="font-bold text-slate-900 block">Strict 6-Month Passport Expiry Enforcement</span>
                <p className="text-slate-600 text-[11px]">
                  Automatically flags or rejects documents expiring in under 180 days from intended travel date.
                </p>
              </div>
              <input
                type="checkbox"
                checked={policies.strictPassportExpiry6Months}
                onChange={(e) => setPolicies({ ...policies, strictPassportExpiry6Months: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50">
              <div>
                <span className="font-bold text-slate-900 block">Auto-Approval for High-Confidence Biometrics (&gt;95%)</span>
                <p className="text-slate-600 text-[11px]">
                  Bypasses manual officer queue when Interpol, MRZ, and financial records are 100% verified.
                </p>
              </div>
              <input
                type="checkbox"
                checked={policies.autoApproveHighConfidenceAI}
                onChange={(e) => setPolicies({ ...policies, autoApproveHighConfidenceAI: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-slate-50">
              <div>
                <span className="font-bold text-slate-900 block">VIP Express Fast-Track Processing Active</span>
                <p className="text-slate-600 text-[11px]">
                  Allows travelers to pay +$25 for priority queue with 24-hour turnaround service-level agreement.
                </p>
              </div>
              <input
                type="checkbox"
                checked={policies.expressFastTrackAvailable}
                onChange={(e) => setPolicies({ ...policies, expressFastTrackAvailable: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => alert('Border control rules successfully synchronized across consular nodes.')}
                className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition"
              >
                Apply Updated Policies
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Staff & User Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Consular Staff & Authorized Agents</h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Review credentialed officers, attorneys, and traveler permissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 space-y-2">
              <span className="text-[10px] font-bold text-indigo-800 uppercase block">Chief Officer (Admin)</span>
              <p className="font-bold text-slate-900 text-sm">Chief Officer Vance</p>
              <p className="text-slate-600 font-mono text-[11px]">cricnow35@gmail.com</p>
              <span className="inline-block px-2 py-0.5 bg-indigo-100 text-indigo-900 rounded font-bold">
                FULL ADJUDICATION PRIVILEGES
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 space-y-2">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block">Licensed Counsel</span>
              <p className="font-bold text-slate-900 text-sm">Eleanor Vance, Esq.</p>
              <p className="text-slate-600 font-mono text-[11px]">eleanor.vance.law@example.com</p>
              <span className="inline-block px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded font-bold">
                LEGAL ADVISORY ROLE
              </span>
            </div>

            <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 space-y-2">
              <span className="text-[10px] font-bold text-blue-800 uppercase block">Applicant Persona</span>
              <p className="font-bold text-slate-900 text-sm">Alex Morgan</p>
              <p className="text-slate-600 font-mono text-[11px]">alex.morgan.travels@example.com</p>
              <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-bold">
                TRAVELER USER ROLE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Adjudication Deep-Dive Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-blue-600">#{selectedApp.id}</span>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  Adjudicate {selectedApp.destinationCountry} ({selectedApp.visaType})
                </h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 text-slate-600 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Traveler Bio */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-600 uppercase block">Traveler</span>
                <span className="font-bold text-slate-900">{selectedApp.applicantName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-600 uppercase block">Nationality</span>
                <span className="font-semibold text-slate-900">{selectedApp.nationality}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-600 uppercase block">Passport Number</span>
                <span className="font-mono font-bold text-slate-900">{selectedApp.passportNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-600 uppercase block">Expiry Date</span>
                <span className="font-semibold text-slate-900">{selectedApp.passportExpiry}</span>
              </div>
            </div>

            {/* AI Document & Biometrics */}
            <div className="bg-blue-50/60 rounded-2xl border border-blue-200 p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-900 uppercase">AI Fraud & Tamper Analysis</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Score: {selectedApp.aiVerificationScore}%
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">
                ICAO Doc 9303 checksum verified. Facial symmetry matches high-resolution passport standard. Zero hits on Interpol Stolen and Lost Travel Documents (SLTD) database.
              </p>
            </div>

            {/* Officer Notes */}
            <div className="space-y-1 text-xs">
              <label className="font-bold text-slate-700 block">Consular Finding Notes</label>
              <textarea
                rows={2}
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                placeholder="Enter justification, statutory entry stipulations, or notes..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* AI Diplomatic Dispatch Generator */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 uppercase tracking-wider">
                  Automated AI Status Update & Dispatch
                </span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    disabled={isGeneratingDispatch}
                    onClick={() => handleGenerateDispatch('approved')}
                    className="py-1 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-semibold transition flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Draft Approval Dispatch</span>
                  </button>
                  <button
                    type="button"
                    disabled={isGeneratingDispatch}
                    onClick={() => handleGenerateDispatch('action_required')}
                    className="py-1 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg font-semibold transition flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Draft Action Notice</span>
                  </button>
                </div>
              </div>

              {generatedDispatch && (
                <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-[11px] space-y-1">
                  <p className="font-bold text-blue-600">{generatedDispatch.subject}</p>
                  <p className="text-slate-700 whitespace-pre-line leading-relaxed">{generatedDispatch.officialBody}</p>
                </div>
              )}
            </div>

            {/* Decision Actions */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
              <button
                onClick={() => setSelectedApp(null)}
                className="py-2 px-4 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 font-semibold"
              >
                Close Drawer
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus('action_required')}
                  className="py-2 px-4 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold transition flex items-center space-x-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Request Action</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus('rejected')}
                  className="py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold transition flex items-center space-x-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Refuse</span>
                </button>

                <button
                  onClick={() => handleUpdateStatus('approved')}
                  className="py-2 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Grant Official eVisa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
