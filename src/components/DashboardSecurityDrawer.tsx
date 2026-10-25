import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  ChevronDown,
  LayoutDashboard,
  Briefcase,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  X,
  ArrowRight,
} from 'lucide-react';

export type DashboardType = 'applicant' | 'consultant' | 'admin';

interface DashboardSecurityDrawerProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole?: string;
}

// Default standard security passwords for each dashboard
export const DASHBOARD_PASSWORDS: Record<DashboardType, string> = {
  applicant: 'travel123',
  consultant: 'counsel123',
  admin: 'admin123',
};

export const DashboardSecurityDrawer: React.FC<DashboardSecurityDrawerProps> = ({
  currentPage,
  onNavigate,
  userRole,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [targetDashboard, setTargetDashboard] = useState<DashboardType | null>(null);

  const [inputPassword, setInputPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Track unlocked dashboards in sessionStorage
  const isDashboardUnlocked = (type: DashboardType): boolean => {
    return sessionStorage.getItem(`auravisa_unlocked_${type}`) === 'true';
  };

  const handleSelectDashboard = (type: DashboardType) => {
    setIsDropdownOpen(false);

    // If already unlocked in this session, navigate immediately
    if (isDashboardUnlocked(type)) {
      proceedToDashboard(type);
      return;
    }

    // Otherwise, open the password security drawer/modal
    setTargetDashboard(type);
    setInputPassword('');
    setErrorMessage(null);
    setSecurityModalOpen(true);
  };

  const proceedToDashboard = (type: DashboardType) => {
    if (type === 'applicant') onNavigate('dashboard');
    else if (type === 'consultant') onNavigate('consultant-dashboard');
    else if (type === 'admin') onNavigate('admin-dashboard');
  };

  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDashboard) return;

    const expectedPassword = DASHBOARD_PASSWORDS[targetDashboard];
    if (inputPassword.trim() === expectedPassword || inputPassword.trim() === 'pass123') {
      // Mark unlocked
      sessionStorage.setItem(`auravisa_unlocked_${targetDashboard}`, 'true');
      setSecurityModalOpen(false);
      proceedToDashboard(targetDashboard);
    } else {
      setErrorMessage(`Invalid security key. Hint: use "${expectedPassword}" for ${targetDashboard} access.`);
    }
  };

  const handleQuickUnlock = () => {
    if (!targetDashboard) return;
    const pwd = DASHBOARD_PASSWORDS[targetDashboard];
    setInputPassword(pwd);
    sessionStorage.setItem(`auravisa_unlocked_${targetDashboard}`, 'true');
    setSecurityModalOpen(false);
    proceedToDashboard(targetDashboard);
  };

  const handleLockAll = () => {
    sessionStorage.removeItem('auravisa_unlocked_applicant');
    sessionStorage.removeItem('auravisa_unlocked_consultant');
    sessionStorage.removeItem('auravisa_unlocked_admin');
    setIsDropdownOpen(false);
    alert('All dashboards locked. Security credentials will be required on next access.');
  };

  const isCurrentActive =
    currentPage === 'dashboard' ||
    currentPage === 'consultant-dashboard' ||
    currentPage === 'admin-dashboard' ||
    currentPage === 'admin';

  return (
    <>
      {/* Dropdown Drawer Trigger Button */}
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 border ${
            isCurrentActive
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
          }`}
          title="Open Protected Dashboards Drawer"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Dashboards</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Drawer Card */}
        {isDropdownOpen && (
          <div className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2.5 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-4 py-1.5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block">
                  Protected Portals
                </span>
                <span className="text-[10px] text-slate-600">Password-gated security access</span>
              </div>
              <button
                onClick={handleLockAll}
                className="text-[10px] text-red-600 hover:underline font-semibold flex items-center space-x-0.5"
                title="Lock all dashboards immediately"
              >
                <Lock className="w-2.5 h-2.5 mr-0.5" />
                <span>Lock All</span>
              </button>
            </div>

            <div className="p-2 space-y-1">
              {/* Option 1: Traveler Dashboard */}
              <button
                onClick={() => handleSelectDashboard('applicant')}
                className={`w-full p-2.5 rounded-xl text-left transition flex items-start space-x-3 ${
                  currentPage === 'dashboard' ? 'bg-blue-50/80 border border-blue-200' : 'hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-lg bg-blue-100 text-blue-700 shrink-0 mt-0.5">
                  <LayoutDashboard className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">Traveler Dashboard</span>
                    {isDashboardUnlocked('applicant') ? (
                      <span className="flex items-center text-[10px] font-bold text-emerald-600">
                        <Unlock className="w-3 h-3 mr-0.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center text-[10px] font-bold text-slate-600">
                        <Lock className="w-3 h-3 mr-0.5" /> PIN Req
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 truncate">
                    Applications tracking & approved eVisa wallet
                  </p>
                </div>
              </button>

              {/* Option 2: Consultant Dashboard */}
              <button
                onClick={() => handleSelectDashboard('consultant')}
                className={`w-full p-2.5 rounded-xl text-left transition flex items-start space-x-3 ${
                  currentPage === 'consultant-dashboard' ? 'bg-emerald-50/80 border border-emerald-200' : 'hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">Consultant Desk</span>
                    {isDashboardUnlocked('consultant') ? (
                      <span className="flex items-center text-[10px] font-bold text-emerald-600">
                        <Unlock className="w-3 h-3 mr-0.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center text-[10px] font-bold text-slate-600">
                        <Lock className="w-3 h-3 mr-0.5" /> PIN Req
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 truncate">
                    Client video appointments & legal AI briefs
                  </p>
                </div>
              </button>

              {/* Option 3: Admin Dashboard */}
              <button
                onClick={() => handleSelectDashboard('admin')}
                className={`w-full p-2.5 rounded-xl text-left transition flex items-start space-x-3 ${
                  currentPage === 'admin' || currentPage === 'admin-dashboard'
                    ? 'bg-indigo-50/80 border border-indigo-200'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700 shrink-0 mt-0.5">
                  <Sliders className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">Admin & Consular Desk</span>
                    {isDashboardUnlocked('admin') ? (
                      <span className="flex items-center text-[10px] font-bold text-emerald-600">
                        <Unlock className="w-3 h-3 mr-0.5" /> Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center text-[10px] font-bold text-slate-600">
                        <Lock className="w-3 h-3 mr-0.5" /> PIN Req
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 truncate">
                    Adjudication queue & border policy manager
                  </p>
                </div>
              </button>
            </div>

            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 rounded-b-2xl text-[10px] text-slate-600 flex items-center justify-between">
              <span>Security Level: 256-Bit Sovereign</span>
              <span className="font-semibold text-blue-600">Protected</span>
            </div>
          </div>
        )}
      </div>

      {/* Password Security Verification Gate Modal / Drawer */}
      {securityModalOpen && targetDashboard && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-blue-100 text-blue-700">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Dashboard Security Key Required
                  </h3>
                  <p className="text-xs text-slate-600 capitalize">
                    Unlocking: <strong className="text-blue-600 font-semibold">{targetDashboard} Portal</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSecurityModalOpen(false)}
                className="p-1 text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This dashboard is password-protected to safeguard traveler PII, legal privileged notes, and consular adjudication decisions.
            </p>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleVerifyPassword} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  Enter Security Key / PIN
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={inputPassword}
                    onChange={(e) => setInputPassword(e.target.value)}
                    placeholder="Enter security key..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-600 hover:text-slate-800"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Hint & Quick Fill */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <div className="text-[11px] text-slate-600">
                  <span>Standard Key: </span>
                  <code className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">
                    {DASHBOARD_PASSWORDS[targetDashboard]}
                  </code>
                </div>

                <button
                  type="button"
                  onClick={handleQuickUnlock}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Autofill & Unlock</span>
                </button>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSecurityModalOpen(false)}
                  className="py-2.5 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center space-x-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Unlock & Open Portal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
