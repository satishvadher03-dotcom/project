import React, { useEffect, useState } from 'react';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  FileText,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Eye,
  RefreshCw,
  Send,
  UserCheck,
  Check,
  Download,
  AlertCircle,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { applicationService } from '../services/applicationService.ts';
import { requestAIAutomatedDispatch } from '../services/aiService.ts';
import { VisaApplication } from '../types/visa.ts';

interface AdminPortalPageProps {
  onNavigate: (page: string) => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({ onNavigate }) => {
  const { user, role, isOfficerOrAdmin, switchRole } = useAuth();
  const [applications, setApplications] = useState<VisaApplication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'all' | 'submitted' | 'under_review' | 'flagged' | 'approved' | 'action_required'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedApp, setSelectedApp] = useState<VisaApplication | null>(null);

  // Officer adjudication inputs
  const [officerNotes, setOfficerNotes] = useState<string>('');
  const [actionReason, setActionReason] = useState<string>('');
  const [isGeneratingDispatch, setIsGeneratingDispatch] = useState<boolean>(false);
  const [generatedDispatch, setGeneratedDispatch] = useState<{
    dispatchReference: string;
    subject: string;
    officialBody: string;
    actionItems: string[];
  } | null>(null);

  const [isUpdatingStatus, setIsUpdatingStatus] = useState<boolean>(false);

  const loadApplications = async () => {
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
    loadApplications();
  }, []);

  // Filtered queue
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.passportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.destinationCountry.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === 'submitted') return app.status === 'submitted';
    if (filter === 'under_review') return app.status === 'under_review';
    if (filter === 'flagged') return (app.aiVerificationScore < 80) || (app.aiRiskLevel === 'high');
    if (filter === 'approved') return app.status === 'approved';
    if (filter === 'action_required') return app.status === 'action_required';
    return true;
  });

  // Generate automated AI status dispatch
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
        officerNotes: officerNotes || (targetStatus === 'approved' ? 'All criteria satisfied.' : 'Incomplete documentation.'),
      });
      setGeneratedDispatch(dispatch);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingDispatch(false);
    }
  };

  // Execute officer decision
  const handleUpdateStatus = async (newStatus: VisaApplication['status']) => {
    if (!selectedApp) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await applicationService.updateApplicationStatus(
        selectedApp.id,
        newStatus,
        officerNotes || 'Adjudicated by Consular Review Board',
        newStatus === 'action_required' ? (actionReason || 'Please upload updated document scans.') : undefined
      );

      setSelectedApp(updated);
      setGeneratedDispatch(null);
      await loadApplications();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* RBAC Verification Alert if currently in Applicant role */}
      {!isOfficerOrAdmin && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">
                Consular Officer / Administrator Role Required
              </p>
              <p className="text-xs text-amber-700">
                You are currently previewing in <span className="font-semibold uppercase">{role}</span> mode. Switch to Officer role to test full adjudication and status updates.
              </p>
            </div>
          </div>

          <button
            onClick={() => switchRole('officer')}
            className="py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-xs self-end sm:self-auto"
          >
            Switch to Consular Officer
          </button>
        </div>
      )}

      {/* Header & KPI Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Consular Border Control Adjudication Desk
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Visa Officer Management Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Review machine-vision passport OCR scans, assess AI fraud alerts, and issue automated diplomatic dispatches.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadApplications}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
              title="Refresh queue"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Queue</span>
            </button>
          </div>
        </div>

        {/* Counter Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs text-slate-600 font-medium">Pending Review</span>
            <p className="text-2xl font-black text-slate-900 mt-0.5">
              {applications.filter((a) => a.status === 'submitted' || a.status === 'under_review').length}
            </p>
            <span className="text-[11px] text-blue-600 font-semibold">Active queue</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs text-slate-600 font-medium">AI Flagged / High Risk</span>
            <p className="text-2xl font-black text-amber-600 mt-0.5">
              {applications.filter((a) => a.aiVerificationScore < 80 || a.aiRiskLevel === 'high').length}
            </p>
            <span className="text-[11px] text-amber-700 font-semibold">Requires officer check</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs text-slate-600 font-medium">Approved eVisas</span>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">
              {applications.filter((a) => a.status === 'approved').length}
            </p>
            <span className="text-[11px] text-emerald-700 font-semibold">Cleared for entry</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs text-slate-600 font-medium">Action Requested</span>
            <p className="text-2xl font-black text-indigo-600 mt-0.5">
              {applications.filter((a) => a.status === 'action_required').length}
            </p>
            <span className="text-[11px] text-indigo-700 font-semibold">Awaiting traveler reply</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search applicant name, passport number, ref ID..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`py-1.5 px-3 rounded-lg font-semibold transition ${
              filter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All ({applications.length})
          </button>
          <button
            onClick={() => setFilter('submitted')}
            className={`py-1.5 px-3 rounded-lg font-semibold transition ${
              filter === 'submitted' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Submitted
          </button>
          <button
            onClick={() => setFilter('flagged')}
            className={`py-1.5 px-3 rounded-lg font-semibold transition ${
              filter === 'flagged' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            AI Flagged
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`py-1.5 px-3 rounded-lg font-semibold transition ${
              filter === 'approved' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('action_required')}
            className={`py-1.5 px-3 rounded-lg font-semibold transition ${
              filter === 'action_required' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            Action Needed
          </button>
        </div>
      </div>

      {/* Applications Queue Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-600 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
            Synchronizing consular database queue...
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="p-16 text-center text-slate-600 space-y-2">
            <FileText className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="font-bold text-slate-800">No applications match filter</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Ref & Date</th>
                  <th className="py-3.5 px-4">Applicant & Nationality</th>
                  <th className="py-3.5 px-4">Destination & Visa</th>
                  <th className="py-3.5 px-4">AI Verification Score</th>
                  <th className="py-3.5 px-4">Predictive ETA</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Adjudicate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-blue-600 block">#{app.id}</span>
                      <span className="text-[11px] text-slate-600">
                        {app.submittedAt?.split('T')[0] || app.createdAt.split('T')[0]}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{app.applicantName}</span>
                      <span className="text-slate-600">{app.nationality} • {app.passportNumber}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">{app.destinationCountry}</span>
                      <span className="text-slate-600 truncate max-w-[140px] block">{app.visaType}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
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
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
                            FLAG
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 block">{app.aiEstimatedDate || '2 days'}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        {app.aiConfidence ? `${app.aiConfidence}% AI conf` : 'High confidence'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {app.status === 'approved' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Approved</span>
                        </span>
                      )}
                      {app.status === 'under_review' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-blue-100 text-blue-800">
                          <Clock className="w-3 h-3" />
                          <span>Under Review</span>
                        </span>
                      )}
                      {app.status === 'submitted' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-slate-100 text-slate-800">
                          <Clock className="w-3 h-3" />
                          <span>Submitted</span>
                        </span>
                      )}
                      {app.status === 'action_required' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-amber-100 text-amber-800">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Action Required</span>
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full font-bold text-[11px] bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3" />
                          <span>Rejected</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setOfficerNotes(app.officerNotes || '');
                          setActionReason(app.actionRequiredReason || '');
                          setGeneratedDispatch(null);
                        }}
                        className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition inline-flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Adjudication Review Drawer / Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-blue-600 text-base">
                    #{selectedApp.id}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 uppercase">
                    {selectedApp.status.replace('_', ' ')}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg mt-0.5">
                  Adjudicate {selectedApp.destinationCountry} eVisa
                </h3>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Applicant Bio & Passport Overview */}
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
                <span className="text-[10px] text-slate-600 uppercase block">Passport #</span>
                <span className="font-mono font-bold text-slate-900">{selectedApp.passportNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-600 uppercase block">Travel Window</span>
                <span className="font-semibold text-slate-900">{selectedApp.travelDate}</span>
              </div>
            </div>

            {/* AI Document & Fraud Verification Breakdown */}
            <div className="bg-blue-50/50 rounded-2xl border border-blue-200 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>AI Document Verification & Tamper Check</span>
                </h4>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Confidence: {selectedApp.aiVerificationScore}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-blue-100">
                  <span className="text-slate-600 block text-[11px]">MRZ Compliance</span>
                  <span className="font-bold text-emerald-600">ICAO 9303 Validated</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-blue-100">
                  <span className="text-slate-600 block text-[11px]">Passport Expiry</span>
                  <span className="font-semibold text-slate-800">{selectedApp.passportExpiry}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-blue-100">
                  <span className="text-slate-600 block text-[11px]">Interpol Stolen Check</span>
                  <span className="font-bold text-emerald-600">Clear (0 Hits)</span>
                </div>
              </div>

              {selectedApp.aiVerification?.anomalies && selectedApp.aiVerification.anomalies.length > 0 && (
                <div className="bg-amber-100/70 border border-amber-300 p-3 rounded-xl text-xs text-amber-900 space-y-1">
                  <span className="font-bold block">AI Flagged Anomalies:</span>
                  {selectedApp.aiVerification.anomalies.map((a, i) => (
                    <p key={i}>• {a}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Officer Notes & Justification */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Consular Officer Findings / Regulatory Notes
              </label>
              <textarea
                rows={2}
                value={officerNotes}
                onChange={(e) => setOfficerNotes(e.target.value)}
                placeholder="Enter regulatory justification, visa restrictions, or verification comments..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* AI Automated Status Dispatch Generator */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Automated AI Status Update & Diplomatic Dispatch
                </span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    disabled={isGeneratingDispatch}
                    onClick={() => handleGenerateDispatch('approved')}
                    className="py-1 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Draft Approval Dispatch</span>
                  </button>
                  <button
                    type="button"
                    disabled={isGeneratingDispatch}
                    onClick={() => handleGenerateDispatch('action_required')}
                    className="py-1 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs font-semibold transition flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Draft Action Request</span>
                  </button>
                </div>
              </div>

              {isGeneratingDispatch && (
                <p className="text-xs text-blue-600 font-semibold animate-pulse">
                  Gemini drafting formal consular dispatch...
                </p>
              )}

              {generatedDispatch && (
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs space-y-2 font-mono">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5 text-slate-600">
                    <span>REF: {generatedDispatch.dispatchReference}</span>
                    <span className="font-bold text-blue-600">{generatedDispatch.subject}</span>
                  </div>
                  <p className="text-slate-800 whitespace-pre-line text-[11px] leading-relaxed">
                    {generatedDispatch.officialBody}
                  </p>
                </div>
              )}
            </div>

            {/* Officer Decision Buttons */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close Drawer
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={() => handleUpdateStatus('action_required')}
                  className="py-2.5 px-4 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Request Traveler Action</span>
                </button>

                <button
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={() => handleUpdateStatus('rejected')}
                  className="py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Refuse Visa</span>
                </button>

                <button
                  type="button"
                  disabled={isUpdatingStatus}
                  onClick={() => handleUpdateStatus('approved')}
                  className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center space-x-1.5"
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
