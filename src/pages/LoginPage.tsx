import React, { useState } from 'react';
import {
  Lock,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  LogIn,
  LogOut,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Mail,
  Key,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types/visa.ts';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  isLogoutMode?: boolean;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, isLogoutMode }) => {
  const { user, role, signInWithGoogle, signInWithCredentials, loginAsDemoUser, signOutUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'credentials' | 'google' | 'roles'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('applicant');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Email / Password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setErrorMessage(null);
    try {
      await signInWithCredentials(email, selectedRole);
      setSuccessMessage('Authentication verified successfully.');
      setTimeout(() => {
        if (selectedRole === 'officer' || selectedRole === 'admin') {
          onNavigate('admin');
        } else {
          onNavigate('dashboard');
        }
      }, 400);
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google sign in
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await signInWithGoogle();
      setSuccessMessage('Signed in via Google successfully.');
      setTimeout(() => {
        onNavigate('dashboard');
      }, 400);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        'Google Sign-In popup was closed or restricted in this environment. You can use the Email or 1-Click Demo Profiles below.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Instant demo role switch
  const handleSelectDemoRole = (targetRole: UserRole) => {
    loginAsDemoUser(targetRole);
    setSuccessMessage(`Switched to ${targetRole.toUpperCase()} persona.`);
    setTimeout(() => {
      if (targetRole === 'officer' || targetRole === 'admin') {
        onNavigate('admin');
      } else {
        onNavigate('dashboard');
      }
    }, 300);
  };

  // Logout action
  const handleLogoutAction = async () => {
    setLoading(true);
    try {
      await signOutUser();
      setSuccessMessage('You have been securely signed out.');
      setErrorMessage(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          AuraVisa Portal Access
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
          Role-Based Access Control (RBAC) securing traveler records, consular queues, and administrative tools.
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Messages */}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="bg-amber-50 border border-amber-200 text-amber-900 p-3.5 rounded-xl text-xs flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* If user is ALREADY signed in: show active session & logout button */}
        {user ? (
          <div className="space-y-5">
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 space-y-3">
              <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider block">
                Active Session Detected
              </span>
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                  alt=""
                  className="w-12 h-12 rounded-xl object-cover border border-blue-300"
                />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{user.displayName}</h3>
                  <p className="text-xs text-slate-600">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200/80 text-blue-900 uppercase">
                    Role: {role}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  if (role === 'officer' || role === 'admin') {
                    onNavigate('admin');
                  } else {
                    onNavigate('dashboard');
                  }
                }}
                className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center space-x-1.5"
              >
                <span>Go to {role === 'officer' ? 'Consular Desk' : 'Dashboard'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={handleLogoutAction}
                className="py-3 px-4 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out (Logout)</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-600">Want to switch to another role or persona? Use the options below.</span>
            </div>
          </div>
        ) : null}

        {/* Authentication Navigation Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === 'credentials'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Email Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('google')}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === 'google'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Google Auth
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('roles')}
            className={`flex-1 py-2 rounded-lg transition ${
              activeTab === 'roles'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1-Click Personas
          </button>
        </div>

        {/* TAB 1: Email & Password Form */}
        {activeTab === 'credentials' && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.morgan@travels.com or cricnow35@gmail.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Password</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">Portal Role Access</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              >
                <option value="applicant">Applicant (Visa Tracker & Applications)</option>
                <option value="officer">Consular Officer / Admin (Review Queue & Approvals)</option>
                <option value="consultant">Immigration Attorney (Consultations Desk)</option>
              </select>
            </div>

            {/* Quick autofill helper pills */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider block">
                Quick Autofill Test Accounts:
              </span>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('alex.morgan.travels@example.com');
                    setSelectedRole('applicant');
                  }}
                  className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                >
                  Applicant Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('cricnow35@gmail.com');
                    setSelectedRole('officer');
                  }}
                  className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium"
                >
                  Consular Officer Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('eleanor.vance.law@example.com');
                    setSelectedRole('consultant');
                  }}
                  className="px-2 py-0.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium"
                >
                  Attorney Account
                </button>
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
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Authenticate & Enter Portal</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* TAB 2: Google Authentication */}
        {activeTab === 'google' && (
          <div className="space-y-4 text-center">
            <p className="text-xs text-slate-600">
              Sign in securely via Google identity provider with Firebase OAuth integration.
            </p>

            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl shadow-xs transition flex items-center justify-center space-x-2.5 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Connecting to Google Identity...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Sign In with Google</span>
                </>
              )}
            </button>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-left text-[11px] text-slate-600 flex items-start space-x-2">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Note: When signing in with email <strong className="text-slate-800">cricnow35@gmail.com</strong>, the system automatically assigns Consular Officer and Administrative permissions.
              </span>
            </div>
          </div>
        )}

        {/* TAB 3: 1-Click Fast Demo Personas */}
        {activeTab === 'roles' && (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSelectDemoRole('applicant')}
              className="w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between border-slate-200 hover:border-blue-400 hover:bg-blue-50/50"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-900 block">
                  1. Traveler / Applicant Persona (Alex Morgan)
                </span>
                <p className="text-[11px] text-slate-600">
                  Full access to file eVisas, use the AI scanner, and view applicant dashboard.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => handleSelectDemoRole('officer')}
              className="w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50"
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-indigo-950 block">
                    2. Consular Officer / Admin Persona (Chief Vance)
                  </span>
                  <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-1.5 py-0.2 rounded">
                    Admin Desk
                  </span>
                </div>
                <p className="text-[11px] text-indigo-800">
                  Adjudicate visa queue, evaluate AI fraud scores, and generate automated dispatches.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-600 shrink-0 ml-2" />
            </button>

            <button
              type="button"
              onClick={() => handleSelectDemoRole('consultant')}
              className="w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50"
            >
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-emerald-950 block">
                  3. Licensed Immigration Counsel Persona (Eleanor Vance, Esq.)
                </span>
                <p className="text-[11px] text-emerald-800">
                  Review applicant bookings, consultation topics, and legal notes.
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
