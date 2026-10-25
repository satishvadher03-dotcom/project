import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Phone,
  CheckCircle2,
  AlertCircle,
  Star,
  User,
  FileText,
  Sparkles,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Plus,
  ArrowRight,
  ExternalLink,
  Edit3,
  X,
  Mic,
  MicOff,
  VideoOff,
  Send,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { applicationService } from '../services/applicationService.ts';
import { Consultation } from '../types/visa.ts';

interface ConsultantDashboardPageProps {
  onNavigate: (page: string) => void;
}

export const ConsultantDashboardPage: React.FC<ConsultantDashboardPageProps> = ({ onNavigate }) => {
  const { user, role, switchRole } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Active video call simulation modal
  const [activeCallSession, setActiveCallSession] = useState<Consultation | null>(null);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [callNotes, setCallNotes] = useState('');

  // Legal notes editor modal
  const [editingNotesConsultation, setEditingNotesConsultation] = useState<Consultation | null>(null);
  const [legalNotesInput, setLegalNotesInput] = useState('');

  // AI Legal Brief Assistant
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [generatedLegalBrief, setGeneratedLegalBrief] = useState<string | null>(null);

  // Password Security Gate State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('auravisa_unlocked_consultant') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === 'counsel123' || passwordInput.trim() === 'pass123') {
      sessionStorage.setItem('auravisa_unlocked_consultant', 'true');
      setIsUnlocked(true);
      setAuthError(null);
    } else {
      setAuthError('Invalid Security Key. Default hint: "counsel123"');
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem('auravisa_unlocked_consultant');
    setIsUnlocked(false);
    setPasswordInput('');
  };

  const loadConsultations = async () => {
    setLoading(true);
    try {
      const data = await applicationService.getConsultations();
      setConsultations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConsultations();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: Consultation['status']) => {
    try {
      await applicationService.updateConsultationStatus(id, newStatus);
      await loadConsultations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotes = async () => {
    if (!editingNotesConsultation) return;
    try {
      await applicationService.updateConsultationStatus(
        editingNotesConsultation.id,
        editingNotesConsultation.status,
        legalNotesInput
      );
      setEditingNotesConsultation(null);
      await loadConsultations();
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateLegalBrief = async (c: Consultation) => {
    setIsGeneratingBrief(true);
    setGeneratedLegalBrief(null);
    try {
      // Simulate or call AI Legal Brief generator
      setTimeout(() => {
        setGeneratedLegalBrief(
          `LEGAL MEMORANDUM & IMMIGRATION STRATEGY BRIEF\n` +
          `Client: ${c.userName} (${c.userEmail})\n` +
          `Session Matter: ${c.topic}\n` +
          `Jurisdiction: Schengen & High-Skilled Foreign National Provisions\n\n` +
          `1. FACTUAL OVERVIEW:\n` +
          `The applicant holds valid national passport credentials and is seeking formal authorization under statutory mobility regulations.\n\n` +
          `2. RISK MITIGATION & DEFENSE STRATEGY:\n` +
          `• Provide sworn financial affidavit demonstrating minimum $3,500 liquid reserves.\n` +
          `• Address 90/180-day limitation via multi-entry Annex VII compliance clause.\n` +
          `• Include certified corporate guarantee letter affirming remote salary payments.\n\n` +
          `3. RECOMMENDED ACTION ITEMS:\n` +
          `• Advise client to request 1-year multi-entry Type D permit rather than recurring short-term type C.\n` +
          `• File preliminary administrative appeal within 15 business days if refusal notice is received.`
        );
        setIsGeneratingBrief(false);
      }, 700);
    } catch (err) {
      console.error(err);
      setIsGeneratingBrief(false);
    }
  };

  const filteredConsultations = consultations.filter((c) => {
    const matchesSearch =
      c.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (filter !== 'all' && c.status !== filter) return false;
    return true;
  });

  if (!isUnlocked) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-emerald-500/5 space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-slate-900">
              Immigration Counsel Desk Locked
            </h2>
            <p className="text-xs text-slate-600">
              Security password required to access client case files, video appointments, and legal briefs.
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
                Security Key / Attorney PIN
              </label>
              <input
                type="password"
                required
                autoFocus
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 text-xs flex items-center justify-between">
              <span className="text-[11px] text-emerald-950">
                Default: <code className="font-bold bg-white px-1.5 py-0.5 rounded border border-emerald-200">counsel123</code>
              </span>
              <button
                type="button"
                onClick={() => {
                  setPasswordInput('counsel123');
                  sessionStorage.setItem('auravisa_unlocked_consultant', 'true');
                  setIsUnlocked(true);
                }}
                className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center space-x-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Autofill & Unlock</span>
              </button>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="py-2.5 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Return Home
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                Unlock Counsel Desk
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Role Notice if not in Consultant role */}
      {role !== 'consultant' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-900">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Consultant Dashboard Preview</span>
              <p className="text-[11px] text-emerald-700">
                You are currently in <strong className="uppercase">{role}</strong> mode. You can switch to the Immigration Counsel role to test full client advisory workflows.
              </p>
            </div>
          </div>
          <button
            onClick={() => switchRole('consultant')}
            className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition shrink-0"
          >
            Switch to Counsel Role
          </button>
        </div>
      )}

      {/* Header Profile & Practice Stats */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center space-x-4">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
              alt="Eleanor Vance"
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Eleanor Vance, Esq.
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  Licensed Counsel (BAR-NY#7492109)
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Senior Immigration Counsel • Practice Focus: Schengen Long-Stay, US E-2/B1, Rejection Appeals
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleLock}
              className="py-2.5 px-3 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition flex items-center space-x-1"
              title="Lock Consultant Desk"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Desk</span>
            </button>
            <button
              onClick={loadConsultations}
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Schedule</span>
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition"
            >
              Admin Desk
            </button>
          </div>
        </div>

        {/* Practice KPI Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs text-slate-600 font-medium">Scheduled Appointments</span>
            <p className="text-2xl font-black text-slate-900 mt-0.5">
              {consultations.filter((c) => c.status === 'scheduled').length}
            </p>
            <span className="text-[11px] text-blue-600 font-semibold">Upcoming sessions</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs text-slate-600 font-medium">Completed Advisories</span>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">
              {consultations.filter((c) => c.status === 'completed').length}
            </p>
            <span className="text-[11px] text-emerald-700 font-semibold">Cases processed</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs text-slate-600 font-medium">Hourly Advisory Fee</span>
            <p className="text-2xl font-black text-slate-900 mt-0.5">$140 USD</p>
            <span className="text-[11px] text-slate-600">Standard 45-min rate</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs text-slate-600 font-medium">Client Rating</span>
            <div className="flex items-center space-x-1 mt-0.5">
              <span className="text-2xl font-black text-amber-500">4.96</span>
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-[11px] text-slate-600">342 verified reviews</span>
          </div>
        </div>
      </div>

      {/* Consultations Management Deck */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <span>Client Advisory Sessions & Bookings</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Manage client appointments, launch encrypted video calls, and draft legal briefs.
            </p>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-600 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search client or topic..."
                className="bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 w-44 sm:w-56"
              />
            </div>

            <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs">
              {(['all', 'scheduled', 'completed', 'cancelled'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-2.5 py-1 rounded-md capitalize font-semibold transition ${
                    filter === tab ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Consultations List */}
        {loading ? (
          <div className="p-12 text-center text-slate-600 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600 mb-2" />
            Loading advisory schedule...
          </div>
        ) : filteredConsultations.length === 0 ? (
          <div className="p-12 text-center text-slate-600 space-y-2">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="font-bold text-slate-800">No appointments found in this view</p>
            <p className="text-xs">Clients booking consultations from the public portal will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredConsultations.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-slate-200 p-5 space-y-4 hover:border-blue-300 transition bg-slate-50/50 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                    <div>
                      <span className="font-mono text-[10px] text-blue-600 font-bold block">
                        #{c.id}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm">{c.userName}</h3>
                      <p className="text-[11px] text-slate-600">{c.userEmail}</p>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          c.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : c.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {c.status}
                      </span>
                      <p className="text-[11px] font-medium text-slate-600 mt-1 flex items-center justify-end space-x-1">
                        {c.meetingType === 'video' ? <Video className="w-3 h-3 text-blue-600" /> : <Phone className="w-3 h-3 text-blue-600" />}
                        <span className="capitalize">{c.meetingType}</span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider block">
                      Consultation Topic
                    </span>
                    <p className="font-semibold text-slate-800 line-clamp-2">{c.topic}</p>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs flex justify-between items-center text-slate-600">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-medium">{c.dateTime}</span>
                    </div>
                    <span className="font-bold text-slate-800">{c.duration} mins</span>
                  </div>

                  {c.notes && (
                    <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-100 text-xs space-y-0.5">
                      <span className="text-[10px] font-bold text-blue-800 uppercase block">Attorney Case Notes:</span>
                      <p className="text-slate-700 text-[11px] leading-relaxed line-clamp-2">{c.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate-200/80 flex flex-wrap gap-2 text-xs">
                  {c.status === 'scheduled' && (
                    <button
                      onClick={() => {
                        setActiveCallSession(c);
                        setCallNotes(c.notes || '');
                      }}
                      className="py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-xs transition flex items-center space-x-1"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Launch Session</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setEditingNotesConsultation(c);
                      setLegalNotesInput(c.notes || '');
                    }}
                    className="py-1.5 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold transition flex items-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Case Notes</span>
                  </button>

                  <button
                    onClick={() => handleGenerateLegalBrief(c)}
                    className="py-1.5 px-2.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-lg font-semibold transition flex items-center space-x-1"
                    title="Generate AI Strategy Memo"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Brief</span>
                  </button>

                  {c.status === 'scheduled' && (
                    <button
                      onClick={() => handleUpdateStatus(c.id, 'completed')}
                      className="py-1.5 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-semibold transition ml-auto"
                      title="Mark as completed"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Strategy Brief Output Drawer / Modal */}
      {generatedLegalBrief && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  AI Legal Adjudication Brief
                </h3>
              </div>
              <button
                onClick={() => setGeneratedLegalBrief(null)}
                className="p-1 text-slate-600 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 font-mono text-xs whitespace-pre-line text-slate-800 leading-relaxed max-h-96 overflow-y-auto">
              {generatedLegalBrief}
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setGeneratedLegalBrief(null)}
                className="py-2 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close Brief
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedLegalBrief);
                  alert('Brief copied to clipboard');
                }}
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Copy Strategy Text
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Video Call Conference Room */}
      {activeCallSession && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col text-white">
          {/* Top Call Bar */}
          <div className="bg-slate-900 px-6 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <div>
                <h3 className="font-bold text-sm">
                  Encrypted Immigration Advisory Session • {activeCallSession.userName}
                </h3>
                <p className="text-[11px] text-slate-400">
                  Topic: {activeCallSession.topic} • 256-bit TLS Protected
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveCallSession(null);
                handleUpdateStatus(activeCallSession.id, 'completed');
              }}
              className="py-1.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
            >
              End Call & Save Notes
            </button>
          </div>

          {/* Main Call View */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 p-6 overflow-hidden">
            {/* Left 2 Cols: Video Screens */}
            <div className="md:col-span-2 flex flex-col space-y-4">
              {/* Client Video Screen */}
              <div className="flex-1 bg-slate-900 rounded-3xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
                  alt="Client"
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-xs px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <span>{activeCallSession.userName} (Client)</span>
                </div>
              </div>

              {/* Counsel Picture-in-Picture & Controls */}
              <div className="h-20 bg-slate-900/90 rounded-2xl border border-slate-800 px-6 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-700">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200"
                      alt="Eleanor Vance"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-bold">You (Eleanor Vance, Esq.)</span>
                </div>

                {/* Audio/Video Controls */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsAudioMuted(!isAudioMuted)}
                    className={`p-3 rounded-full transition ${
                      isAudioMuted ? 'bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsVideoMuted(!isVideoMuted)}
                    className={`p-3 rounded-full transition ${
                      isVideoMuted ? 'bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                    }`}
                  >
                    {isVideoMuted ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Col: Live Session Notes Pad */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">
                  Live Legal Consultation Notes
                </h4>
                <textarea
                  rows={14}
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Record client statements, evidentiary deficiencies, and next application steps..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={async () => {
                  await applicationService.updateConsultationStatus(
                    activeCallSession.id,
                    activeCallSession.status,
                    callNotes
                  );
                  alert('Session notes saved to client record.');
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                Save Live Notes to Case File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Case Notes Editor Modal */}
      {editingNotesConsultation && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                Case Notes: {editingNotesConsultation.userName}
              </h3>
              <button
                onClick={() => setEditingNotesConsultation(null)}
                className="p-1 text-slate-600 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                Legal Advisory Summary & Instructions
              </label>
              <textarea
                rows={6}
                value={legalNotesInput}
                onChange={(e) => setLegalNotesInput(e.target.value)}
                placeholder="Enter client strategy notes, required documents, or next steps..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setEditingNotesConsultation(null)}
                className="py-2 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
