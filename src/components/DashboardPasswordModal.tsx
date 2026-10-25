import React, { useState } from 'react';
import {
  Lock,
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useDashboardSecurity } from '../context/DashboardSecurityContext.tsx';

export const DashboardPasswordModal: React.FC = () => {
  const {
    isPasswordModalOpen,
    dashboardPassword,
    targetDashboardPage,
    unlockWithPassword,
    updateDashboardPassword,
    closePasswordModal,
  } = useDashboardSecurity();

  const [enteredPassword, setEnteredPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Change password mode
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isPasswordModalOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const success = unlockWithPassword(enteredPassword);
    if (!success) {
      setErrorMessage('Incorrect dashboard password. Default is admin2026.');
    }
  };

  const handleQuickUnlock = () => {
    setEnteredPassword(dashboardPassword);
    unlockWithPassword(dashboardPassword);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    updateDashboardPassword(newPassword);
    setSuccessMessage('Dashboard password updated successfully.');
    setIsChangingPassword(false);
    setNewPassword('');
    setConfirmPassword('');
    // Automatically unlock with new password
    unlockWithPassword(newPassword);
  };

  const targetTitle =
    targetDashboardPage === 'admin-dashboard' || targetDashboardPage === 'admin'
      ? 'Consular Admin Dashboard'
      : targetDashboardPage === 'consultant-dashboard'
      ? 'Immigration Counsel Dashboard'
      : 'Management Dashboard';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                Dashboard Password Gate
              </h3>
              <p className="text-xs text-slate-600">Accessing: {targetTitle}</p>
            </div>
          </div>

          <button
            onClick={closePasswordModal}
            className="p-1 rounded-lg text-slate-600 hover:text-slate-800 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Main unlock form */}
        {!isChangingPassword ? (
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Enter Dashboard Password or PIN
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={enteredPassword}
                  onChange={(e) => setEnteredPassword(e.target.value)}
                  placeholder="Enter security password"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-600 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Helper Hint */}
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 text-xs text-indigo-900 flex items-center justify-between">
              <div>
                <span className="font-bold block text-[11px]">Default Password:</span>
                <span className="font-mono text-indigo-700 font-semibold">{dashboardPassword}</span>
              </div>
              <button
                type="button"
                onClick={handleQuickUnlock}
                className="py-1 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition"
              >
                1-Click Quick Unlock
              </button>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(true);
                  setErrorMessage(null);
                }}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                Set / Change Password
              </button>

              <button
                type="submit"
                className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center space-x-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock Dashboard</span>
              </button>
            </div>
          </form>
        ) : (
          /* Change password form */
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">New Dashboard Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 4 chars)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="text-xs text-slate-600 hover:text-slate-800 font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
              >
                Save New Password & Unlock
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
