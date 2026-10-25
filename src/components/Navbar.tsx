import React, { useState } from 'react';
import {
  Globe,
  ShieldCheck,
  FileText,
  UserCheck,
  Calendar,
  Sparkles,
  LayoutDashboard,
  LogOut,
  LogIn,
  ChevronDown,
  Compass,
  Menu,
  X,
  Lock,
  Briefcase,
  Sliders,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types/visa.ts';
import { DashboardSecurityDrawer, DASHBOARD_PASSWORDS, DashboardType } from './DashboardSecurityDrawer.tsx';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, role, isOfficerOrAdmin, switchRole, signOutUser } = useAuth();
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDashboardOpen, setMobileDashboardOpen] = useState(false);

  const handleSignOut = async () => {
    await signOutUser();
    onNavigate('login');
  };

  const isDashboardUnlocked = (type: DashboardType): boolean => {
    return sessionStorage.getItem(`auravisa_unlocked_${type}`) === 'true';
  };

  const handleMobileDashboardClick = (type: DashboardType) => {
    setIsMobileMenuOpen(false);
    if (type === 'applicant') onNavigate('dashboard');
    else if (type === 'consultant') onNavigate('consultant-dashboard');
    else if (type === 'admin') onNavigate('admin-dashboard');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top diplomatic banner */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3 text-[11px] font-medium">
          <span className="inline-flex items-center text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse mr-1.5"></span>
            Border Gate Verification Online
          </span>
          <span className="hidden sm:inline text-slate-400">•</span>
          <span className="hidden sm:inline text-slate-300">ICAO Doc 9303 Compliant Machine-Readable eVisa</span>
        </div>

        {/* Quick Role Switcher */}
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 text-[11px]">
            {user ? 'Active Persona:' : 'Test Personas:'}
          </span>
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 transition"
              title="Switch role to test different portal permissions"
            >
              <span className="capitalize">
                {user ? (role === 'officer' ? 'Consular Officer' : role === 'consultant' ? 'Legal Counsel' : role) : 'Select Persona'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isRoleMenuOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Test Portal Dashboards
                </div>
                <button
                  onClick={() => {
                    switchRole('applicant');
                    setIsRoleMenuOpen(false);
                    onNavigate('dashboard');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition ${
                    user && role === 'applicant' ? 'font-bold text-blue-600 bg-blue-50/70' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">Traveler / Applicant</span>
                    <span className="text-[10px] text-slate-600">Applicant Tracking Dashboard</span>
                  </div>
                  {user && role === 'applicant' && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                </button>

                <button
                  onClick={() => {
                    switchRole('consultant');
                    setIsRoleMenuOpen(false);
                    onNavigate('consultant-dashboard');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition ${
                    user && role === 'consultant' ? 'font-bold text-emerald-700 bg-emerald-50/70' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">Immigration Attorney</span>
                    <span className="text-[10px] text-slate-600">Consultant Desk & Client Sessions</span>
                  </div>
                  {user && role === 'consultant' && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                </button>

                <button
                  onClick={() => {
                    switchRole('officer');
                    setIsRoleMenuOpen(false);
                    onNavigate('admin-dashboard');
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-indigo-50 transition ${
                    user && (role === 'officer' || role === 'admin') ? 'font-bold text-indigo-700 bg-indigo-50/70' : 'text-slate-700'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">Consular Officer / Admin</span>
                    <span className="text-[10px] text-slate-600">Admin Dashboard & Queue</span>
                  </div>
                  {user && (role === 'officer' || role === 'admin') && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900">
                  Aura<span className="text-blue-600">Visa</span>
                </span>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                  AI Portal
                </span>
              </div>
              <p className="text-[10px] text-slate-600 font-medium tracking-wide">
                Global Electronic Travel Authority
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                currentPage === 'home' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Home
            </button>

            <button
              onClick={() => onNavigate('visas')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                currentPage === 'visas' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Visa Types
            </button>

            <button
              onClick={() => onNavigate('eligibility')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ${
                currentPage === 'eligibility' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>AI Eligibility</span>
            </button>

            <button
              onClick={() => onNavigate('apply')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                currentPage === 'apply' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Apply eVisa
            </button>

            <button
              onClick={() => onNavigate('consultant')}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center space-x-1 ${
                currentPage === 'consultant' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-slate-600" />
              <span>Book Lawyer</span>
            </button>

            {/* Unified Password-Protected Dashboards Dropdown Drawer */}
            <DashboardSecurityDrawer
              currentPage={currentPage}
              onNavigate={onNavigate}
              userRole={role}
            />
          </nav>

          {/* User profile / login actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2.5 pl-3 border-l border-slate-200">
                <div
                  onClick={() => {
                    if (role === 'officer' || role === 'admin') onNavigate('admin-dashboard');
                    else if (role === 'consultant') onNavigate('consultant-dashboard');
                    else onNavigate('dashboard');
                  }}
                  className="flex items-center space-x-2 cursor-pointer hover:opacity-85 transition"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full border border-blue-200 object-cover"
                  />
                  <div className="text-left text-xs">
                    <p className="font-semibold text-slate-800 leading-tight truncate max-w-[110px]">
                      {user.displayName.split(' ')[0]}
                    </p>
                    <span className="text-[10px] text-blue-600 font-medium capitalize">
                      {role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-red-700 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg transition"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-500" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition flex items-center space-x-1.5"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Login</span>
              </button>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <button
            onClick={() => {
              onNavigate('home');
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Globe className="w-4 h-4 text-slate-600" />
            <span>Home</span>
          </button>
          <button
            onClick={() => {
              onNavigate('visas');
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Compass className="w-4 h-4 text-slate-600" />
            <span>Visa Types Directory</span>
          </button>
          <button
            onClick={() => {
              onNavigate('eligibility');
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>AI Eligibility Checker</span>
          </button>
          <button
            onClick={() => {
              onNavigate('apply');
              setIsMobileMenuOpen(false);
            }}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Apply eVisa</span>
          </button>

          {/* Password-protected dashboards in mobile */}
          <div className="pt-2 pb-1 border-t border-slate-100">
            <span className="px-3 text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Protected Dashboards (Password PIN Protected)
            </span>
            <button
              onClick={() => handleMobileDashboardClick('applicant')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 mb-1"
            >
              <div className="flex items-center space-x-2">
                <LayoutDashboard className="w-4 h-4" />
                <span>Traveler Dashboard</span>
              </div>
              <span className="text-[10px] font-mono text-blue-600">travel123</span>
            </button>
            <button
              onClick={() => handleMobileDashboardClick('consultant')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 mb-1"
            >
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>Consultant Dashboard</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600">counsel123</span>
            </button>
            <button
              onClick={() => handleMobileDashboardClick('admin')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-800"
            >
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </div>
              <span className="text-[10px] font-mono text-indigo-600">admin123</span>
            </button>
          </div>

          {user ? (
            <button
              onClick={() => {
                handleSignOut();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold bg-red-50 text-red-700 mt-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out ({user.displayName.split(' ')[0]})</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onNavigate('login');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 text-white mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Login</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
