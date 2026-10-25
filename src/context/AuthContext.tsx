import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleAuthProvider, signInWithPopup, signOut } from '../lib/firebase.ts';
import { UserProfile, UserRole } from '../types/visa.ts';

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  role: UserRole;
  isOfficerOrAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithCredentials: (email: string, role?: UserRole, displayName?: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  loginAsDemoUser: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const DEMO_USERS: Record<UserRole, UserProfile> = {
  applicant: {
    uid: 'demo-applicant-001',
    email: 'alex.morgan.travels@example.com',
    displayName: 'Alex Morgan',
    role: 'applicant',
    nationality: 'United States',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    createdAt: new Date().toISOString(),
  },
  officer: {
    uid: 'demo-officer-chief',
    email: 'cricnow35@gmail.com', // Admin email from user session metadata
    displayName: 'Chief Officer Vance',
    role: 'officer',
    nationality: 'United Kingdom',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    createdAt: new Date().toISOString(),
  },
  consultant: {
    uid: 'demo-consultant-eleanor',
    email: 'eleanor.vance.law@example.com',
    displayName: 'Eleanor Vance, Esq.',
    role: 'consultant',
    nationality: 'United States',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    createdAt: new Date().toISOString(),
  },
  admin: {
    uid: 'demo-admin-system',
    email: 'cricnow35@gmail.com',
    displayName: 'Director of Border Security',
    role: 'admin',
    nationality: 'Schengen Area',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    createdAt: new Date().toISOString(),
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Check saved local profile for persistent dev demo sessions
    const saved = localStorage.getItem('auravisa_active_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // If not saved, start as null so guest / logged out state works cleanly
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const userDoc = await getDoc(userDocRef);

          let role: UserRole = 'applicant';
          // Check if admin email
          if (fbUser.email === 'cricnow35@gmail.com') {
            role = 'officer';
          }

          if (userDoc.exists()) {
            const data = userDoc.data();
            const profile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || 'Traveler',
              role: (data.role as UserRole) || role,
              nationality: data.nationality || 'United States',
              avatarUrl: fbUser.photoURL || undefined,
              createdAt: data.createdAt || new Date().toISOString(),
            };
            setUser(profile);
            localStorage.setItem('auravisa_active_profile', JSON.stringify(profile));
          } else {
            const newProfile: UserProfile = {
              uid: fbUser.uid,
              email: fbUser.email || '',
              displayName: fbUser.displayName || 'Applicant',
              role,
              nationality: 'United States',
              avatarUrl: fbUser.photoURL || undefined,
              createdAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, newProfile).catch(() => {});
            setUser(newProfile);
            localStorage.setItem('auravisa_active_profile', JSON.stringify(newProfile));
          }
        } catch (error) {
          console.error('Error fetching/syncing user document:', error);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const fbUser = result.user;
      let role: UserRole = 'applicant';
      if (fbUser.email === 'cricnow35@gmail.com') {
        role = 'officer';
      }
      const profile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || 'Authorized User',
        role,
        avatarUrl: fbUser.photoURL || undefined,
        createdAt: new Date().toISOString(),
      };
      setUser(profile);
      localStorage.setItem('auravisa_active_profile', JSON.stringify(profile));
    } catch (error) {
      console.error('Error during Google sign-in:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithCredentials = async (email: string, targetRole: UserRole = 'applicant', displayName?: string) => {
    setIsLoading(true);
    try {
      const roleToAssign: UserRole = email.toLowerCase().includes('officer') || email === 'cricnow35@gmail.com'
        ? 'officer'
        : email.toLowerCase().includes('consultant')
        ? 'consultant'
        : targetRole;

      const profile: UserProfile = {
        uid: `user-${Date.now().toString(36)}`,
        email,
        displayName: displayName || email.split('@')[0].replace('.', ' '),
        role: roleToAssign,
        nationality: 'United States',
        avatarUrl: roleToAssign === 'officer'
          ? DEMO_USERS.officer.avatarUrl
          : roleToAssign === 'consultant'
          ? DEMO_USERS.consultant.avatarUrl
          : DEMO_USERS.applicant.avatarUrl,
        createdAt: new Date().toISOString(),
      };

      // Save to Firestore if possible
      try {
        await setDoc(doc(db, 'users', profile.uid), profile);
      } catch (e) {
        // non-blocking
      }

      setUser(profile);
      localStorage.setItem('auravisa_active_profile', JSON.stringify(profile));
    } finally {
      setIsLoading(false);
    }
  };

  const signOutUser = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch (err) {
      console.warn('Sign out warning:', err);
    }
    setFirebaseUser(null);
    setUser(null);
    localStorage.removeItem('auravisa_active_profile');
  };

  const switchRole = (newRole: UserRole) => {
    const targetProfile = DEMO_USERS[newRole];
    setUser(targetProfile);
    localStorage.setItem('auravisa_active_profile', JSON.stringify(targetProfile));
  };

  const loginAsDemoUser = (targetRole: UserRole) => {
    const profile = DEMO_USERS[targetRole];
    setUser(profile);
    localStorage.setItem('auravisa_active_profile', JSON.stringify(profile));
  };

  const role: UserRole = user?.role || 'applicant';
  const isOfficerOrAdmin = !!user && (role === 'officer' || role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        role,
        isOfficerOrAdmin,
        signInWithGoogle,
        signInWithCredentials,
        signOutUser,
        switchRole,
        loginAsDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
