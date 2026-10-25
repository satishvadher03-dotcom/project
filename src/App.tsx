import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.tsx';
import { DashboardSecurityProvider } from './context/DashboardSecurityContext.tsx';
import { DashboardPasswordModal } from './components/DashboardPasswordModal.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { VisaTypesPage } from './pages/VisaTypesPage.tsx';
import { EligibilityCheckerPage } from './pages/EligibilityCheckerPage.tsx';
import { ApplicationFormPage } from './pages/ApplicationFormPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { BookConsultantPage } from './pages/BookConsultantPage.tsx';
import { ConsultantDashboardPage } from './pages/ConsultantDashboardPage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { testConnection } from './lib/firebase.ts';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [navParams, setNavParams] = useState<any>({});

  useEffect(() => {
    // Validate connection to Firestore as mandated by Firebase integration rules
    testConnection();
  }, []);

  const handleNavigate = (page: string, params?: any) => {
    setCurrentPage(page);
    setNavParams(params || {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <DashboardSecurityProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-blue-600 selection:text-white">
          {/* Global Dashboard Password Gate Modal */}
          <DashboardPasswordModal />

          {/* Navigation Bar with Dropdown Drawer */}
          <Navbar currentPage={currentPage} onNavigate={handleNavigate} />

          {/* Dynamic Page Content */}
          <main className="flex-1">
            {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
            {currentPage === 'visas' && (
              <VisaTypesPage onNavigate={handleNavigate} initialSearch={navParams?.search} />
            )}
            {currentPage === 'eligibility' && (
              <EligibilityCheckerPage onNavigate={handleNavigate} initialParams={navParams} />
            )}
            {currentPage === 'apply' && (
              <ApplicationFormPage onNavigate={handleNavigate} initialVisaId={navParams?.visaId} />
            )}
            {currentPage === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
            {currentPage === 'consultant-dashboard' && (
              <ConsultantDashboardPage onNavigate={handleNavigate} />
            )}
            {currentPage === 'consultant' && <BookConsultantPage onNavigate={handleNavigate} />}
            {(currentPage === 'admin' || currentPage === 'admin-dashboard') && (
              <AdminDashboardPage onNavigate={handleNavigate} />
            )}
            {(currentPage === 'login' || currentPage === 'logout') && (
              <LoginPage onNavigate={handleNavigate} isLogoutMode={currentPage === 'logout'} />
            )}
          </main>

          {/* Global Diplomatic Footer */}
          <Footer onNavigate={handleNavigate} />
        </div>
      </DashboardSecurityProvider>
    </AuthProvider>
  );
}
