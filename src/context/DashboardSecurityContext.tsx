import React, { createContext, useContext, useState, useEffect } from 'react';

interface DashboardSecurityContextType {
  isUnlocked: boolean;
  dashboardPassword: string;
  isPasswordModalOpen: boolean;
  targetDashboardPage: string | null;
  verifyPassword: (password: string) => boolean;
  unlockWithPassword: (password: string) => boolean;
  lockDashboard: () => void;
  updateDashboardPassword: (newPassword: string) => void;
  requestDashboardAccess: (targetPage: string, onAuthorized: () => void) => void;
  closePasswordModal: () => void;
}

const DashboardSecurityContext = createContext<DashboardSecurityContextType | undefined>(undefined);

const DEFAULT_PASSWORD = 'admin2026';
const STORAGE_PWD_KEY = 'auravisa_dashboard_password';
const STORAGE_UNLOCKED_KEY = 'auravisa_dashboard_unlocked_session';

export const DashboardSecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dashboardPassword, setDashboardPassword] = useState<string>(() => {
    return localStorage.getItem(STORAGE_PWD_KEY) || DEFAULT_PASSWORD;
  });

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem(STORAGE_UNLOCKED_KEY) === 'true';
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [targetDashboardPage, setTargetDashboardPage] = useState<string | null>(null);
  const [pendingCallback, setPendingCallback] = useState<(() => void) | null>(null);

  const verifyPassword = (pwd: string) => {
    return pwd.trim() === dashboardPassword.trim();
  };

  const unlockWithPassword = (pwd: string) => {
    if (verifyPassword(pwd)) {
      setIsUnlocked(true);
      sessionStorage.setItem(STORAGE_UNLOCKED_KEY, 'true');
      setIsPasswordModalOpen(false);
      if (pendingCallback) {
        pendingCallback();
        setPendingCallback(null);
      }
      return true;
    }
    return false;
  };

  const lockDashboard = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem(STORAGE_UNLOCKED_KEY);
  };

  const updateDashboardPassword = (newPwd: string) => {
    setDashboardPassword(newPwd);
    localStorage.setItem(STORAGE_PWD_KEY, newPwd);
  };

  const requestDashboardAccess = (targetPage: string, onAuthorized: () => void) => {
    // If it's the applicant dashboard, it's open by default
    if (targetPage === 'dashboard') {
      onAuthorized();
      return;
    }

    // For protected dashboards (admin-dashboard or consultant-dashboard):
    if (isUnlocked) {
      onAuthorized();
    } else {
      setTargetDashboardPage(targetPage);
      setPendingCallback(() => onAuthorized);
      setIsPasswordModalOpen(true);
    }
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setTargetDashboardPage(null);
    setPendingCallback(null);
  };

  return (
    <DashboardSecurityContext.Provider
      value={{
        isUnlocked,
        dashboardPassword,
        isPasswordModalOpen,
        targetDashboardPage,
        verifyPassword,
        unlockWithPassword,
        lockDashboard,
        updateDashboardPassword,
        requestDashboardAccess,
        closePasswordModal,
      }}
    >
      {children}
    </DashboardSecurityContext.Provider>
  );
};

export const useDashboardSecurity = () => {
  const context = useContext(DashboardSecurityContext);
  if (!context) {
    throw new Error('useDashboardSecurity must be used within a DashboardSecurityProvider');
  }
  return context;
};
