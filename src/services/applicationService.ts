import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { VisaApplication, Consultation } from '../types/visa.ts';

const LOCAL_STORAGE_APPS_KEY = 'auravisa_applications_store';
const LOCAL_STORAGE_CONSULT_KEY = 'auravisa_consultations_store';

const INITIAL_SEED_APPLICATIONS: VisaApplication[] = [
  {
    id: 'EV-2026-89410',
    applicantId: 'demo-applicant-001',
    applicantName: 'Alex Morgan',
    applicantEmail: 'alex.morgan.travels@example.com',
    nationality: 'United States',
    destinationCountry: 'Japan',
    visaType: 'Short-Term eVisa (Tourism)',
    passportNumber: 'US89214710',
    passportExpiry: '2030-08-15',
    dateOfBirth: '1992-04-12',
    travelDate: '2026-11-18',
    returnDate: '2026-12-02',
    purposeOfVisit: 'Autumn cultural exploration & photography in Kyoto and Tokyo',
    stayAddress: 'Shinjuku Granbell Hotel, Tokyo',
    status: 'approved',
    aiVerificationScore: 98,
    aiVerification: {
      score: 98,
      status: 'PASSED',
      mrzValid: true,
      detectedPassportNumber: 'US89214710',
      detectedName: 'Alex Morgan',
      detectedNationality: 'USA',
      detectedExpiryDate: '2030-08-15',
      validityMonthsRemaining: 46,
      photoClarityScore: 99,
      tamperRisk: 'LOW',
      anomalies: [],
      recommendations: ['Passport biometric checksum 100% verified', 'No Interpol stolen document matches', 'Travel history consistent with tourism'],
    },
    aiEstimatedDays: 2,
    aiEstimatedDate: 'Oct 28, 2026',
    aiConfidence: 99,
    aiRiskLevel: 'low',
    feeAmount: 37,
    paymentStatus: 'paid',
    eVisaNumber: 'JP-EV-990241-X',
    submittedAt: '2026-10-21T09:15:00Z',
    reviewedAt: '2026-10-23T14:30:00Z',
    officerNotes: 'Biometrics and travel itinerary verified. Standard 90-day single entry granted.',
    createdAt: '2026-10-21T09:15:00Z',
    updatedAt: '2026-10-23T14:30:00Z',
  },
  {
    id: 'EV-2026-90214',
    applicantId: 'traveler-user-002',
    applicantName: 'Elena Rostova',
    applicantEmail: 'elena.rostova@globaltravel.org',
    nationality: 'Canada',
    destinationCountry: 'Schengen (EU)',
    visaType: 'Unified Schengen Short Stay (Type C)',
    passportNumber: 'CA45129903',
    passportExpiry: '2027-02-10',
    dateOfBirth: '1988-11-23',
    travelDate: '2026-12-05',
    returnDate: '2026-12-24',
    purposeOfVisit: 'Attending Paris Fintech Congress & client presentations in Frankfurt',
    stayAddress: 'Hotel Le Marais, Paris, France',
    status: 'under_review',
    aiVerificationScore: 91,
    aiVerification: {
      score: 91,
      status: 'PASSED',
      mrzValid: true,
      detectedPassportNumber: 'CA45129903',
      detectedName: 'Elena Rostova',
      detectedNationality: 'CAN',
      detectedExpiryDate: '2027-02-10',
      validityMonthsRemaining: 15,
      photoClarityScore: 93,
      tamperRisk: 'LOW',
      anomalies: [],
      recommendations: ['Travel medical insurance meets 30,000 EUR threshold', 'Financial guarantee verified'],
    },
    aiEstimatedDays: 4,
    aiEstimatedDate: 'Oct 29, 2026',
    aiConfidence: 94,
    aiRiskLevel: 'low',
    feeAmount: 105,
    paymentStatus: 'paid',
    submittedAt: '2026-10-24T11:00:00Z',
    createdAt: '2026-10-24T11:00:00Z',
    updatedAt: '2026-10-24T16:20:00Z',
  },
  {
    id: 'EV-2026-91185',
    applicantId: 'traveler-user-003',
    applicantName: 'Tariq Al-Hamad',
    applicantEmail: 'tariq.alhamad@gulfventures.ae',
    nationality: 'United Arab Emirates',
    destinationCountry: 'United Kingdom',
    visaType: 'UK ETA & Standard Visitor eVisa',
    passportNumber: 'AE77239011',
    passportExpiry: '2028-09-30',
    dateOfBirth: '1985-06-19',
    travelDate: '2026-11-10',
    returnDate: '2026-11-20',
    purposeOfVisit: 'London Tech Week executive summit and trade meetings',
    stayAddress: 'The Dorchester, Mayfair, London',
    status: 'submitted',
    aiVerificationScore: 89,
    aiVerification: {
      score: 89,
      status: 'PASSED',
      mrzValid: true,
      detectedPassportNumber: 'AE77239011',
      detectedName: 'Tariq Al-Hamad',
      detectedNationality: 'ARE',
      detectedExpiryDate: '2028-09-30',
      validityMonthsRemaining: 23,
      photoClarityScore: 88,
      tamperRisk: 'LOW',
      anomalies: [],
      recommendations: ['Passport biometric checksum verified', 'Fast-track ETA eligible'],
    },
    aiEstimatedDays: 2,
    aiEstimatedDate: 'Oct 27, 2026',
    aiConfidence: 96,
    aiRiskLevel: 'low',
    feeAmount: 30,
    paymentStatus: 'paid',
    submittedAt: '2026-10-25T08:30:00Z',
    createdAt: '2026-10-25T08:30:00Z',
    updatedAt: '2026-10-25T08:30:00Z',
  },
  {
    id: 'EV-2026-92040',
    applicantId: 'traveler-user-004',
    applicantName: 'Lucas Silva',
    applicantEmail: 'lucas.silva.code@devmail.io',
    nationality: 'Brazil',
    destinationCountry: 'Indonesia',
    visaType: 'Remote Worker / Digital Nomad eVisa (E33G)',
    passportNumber: 'BR90184422',
    passportExpiry: '2027-01-14',
    dateOfBirth: '1995-03-08',
    travelDate: '2026-12-01',
    returnDate: '2027-11-30',
    purposeOfVisit: 'Remote software engineering from Canggu & Ubud, Bali',
    stayAddress: 'Villa Melati, Canggu, Bali',
    status: 'action_required',
    aiVerificationScore: 68,
    aiVerification: {
      score: 68,
      status: 'FLAGGED',
      mrzValid: true,
      detectedPassportNumber: 'BR90184422',
      detectedName: 'Lucas Silva',
      detectedNationality: 'BRA',
      detectedExpiryDate: '2027-01-14',
      validityMonthsRemaining: 14,
      photoClarityScore: 65,
      tamperRisk: 'MODERATE',
      anomalies: [
        'Passport validity (14 months) is less than Indonesia 18-month requirement for 1-year Nomad eVisa',
        'Uploaded remote employment contract signature missing company stamp',
      ],
      recommendations: [
        'Applicant must upload passport renewal acknowledgment or adjust to 6-month stay',
        'Provide verified bank statement showing foreign funds inflow for past 90 days',
      ],
    },
    aiEstimatedDays: 6,
    aiEstimatedDate: 'Nov 02, 2026',
    aiConfidence: 78,
    aiRiskLevel: 'high',
    feeAmount: 190,
    paymentStatus: 'paid',
    officerNotes: 'Flagged by AI: Passport expiry in Jan 2027 is below the required 18 months for the 1-year digital nomad permit. Please submit either an updated passport renewal proof or amended 180-day stay declaration.',
    actionRequiredReason: 'Passport validity must be minimum 18 months for 1-Year Indonesian Remote Worker Permit. Please upload renewed passport bio page or submit statement.',
    submittedAt: '2026-10-23T15:45:00Z',
    createdAt: '2026-10-23T15:45:00Z',
    updatedAt: '2026-10-24T18:10:00Z',
  },
];

const INITIAL_SEED_CONSULTATIONS: Consultation[] = [
  {
    id: 'CNS-2026-551',
    userId: 'demo-applicant-001',
    userName: 'Alex Morgan',
    userEmail: 'alex.morgan.travels@example.com',
    consultantId: 'cons-1',
    consultantName: 'Eleanor Vance, Esq.',
    consultantSpecialty: 'Schengen Long-Stay & Rejection Appeals',
    dateTime: '2026-10-28 14:00 GMT',
    duration: 45,
    topic: 'Strategy for applying for a 1-year Multiple Entry EU D-Visa',
    meetingType: 'video',
    status: 'scheduled',
    notes: 'Applicant holds valid Japan eVisa and wants to review EU residency pathways.',
    createdAt: '2026-10-24T10:00:00Z',
  },
];

function getLocalApps(): VisaApplication[] {
  const data = localStorage.getItem(LOCAL_STORAGE_APPS_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fall through
    }
  }
  localStorage.setItem(LOCAL_STORAGE_APPS_KEY, JSON.stringify(INITIAL_SEED_APPLICATIONS));
  return INITIAL_SEED_APPLICATIONS;
}

function saveLocalApps(apps: VisaApplication[]) {
  localStorage.setItem(LOCAL_STORAGE_APPS_KEY, JSON.stringify(apps));
}

function getLocalConsultations(): Consultation[] {
  const data = localStorage.getItem(LOCAL_STORAGE_CONSULT_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // fall through
    }
  }
  localStorage.setItem(LOCAL_STORAGE_CONSULT_KEY, JSON.stringify(INITIAL_SEED_CONSULTATIONS));
  return INITIAL_SEED_CONSULTATIONS;
}

function saveLocalConsultations(c: Consultation[]) {
  localStorage.setItem(LOCAL_STORAGE_CONSULT_KEY, JSON.stringify(c));
}

export const applicationService = {
  async getAllApplications(): Promise<VisaApplication[]> {
    try {
      const colRef = collection(db, 'applications');
      const snap = await getDocs(colRef);
      if (snap.empty) {
        // Seed initial applications into Firestore for instant officer experience
        const local = getLocalApps();
        for (const app of local) {
          await setDoc(doc(db, 'applications', app.id), app).catch(() => {});
        }
        return local;
      }
      return snap.docs.map((d) => d.data() as VisaApplication);
    } catch (err) {
      console.warn('Firestore fallback: reading applications from local storage', err);
      return getLocalApps();
    }
  },

  async getUserApplications(userId: string): Promise<VisaApplication[]> {
    try {
      const colRef = collection(db, 'applications');
      const q = query(colRef, where('applicantId', '==', userId));
      const snap = await getDocs(q);
      if (snap.empty) {
        const local = getLocalApps();
        return local.filter((a) => a.applicantId === userId || a.applicantId === 'demo-applicant-001');
      }
      return snap.docs.map((d) => d.data() as VisaApplication);
    } catch (err) {
      console.warn('Firestore query fallback for user applications', err);
      const local = getLocalApps();
      return local.filter((a) => a.applicantId === userId || a.applicantId === 'demo-applicant-001');
    }
  },

  async submitApplication(appData: Omit<VisaApplication, 'id' | 'createdAt' | 'updatedAt'>): Promise<VisaApplication> {
    const id = `EV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();
    const newApp: VisaApplication = {
      ...appData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    // Save locally immediately
    const local = getLocalApps();
    const updated = [newApp, ...local];
    saveLocalApps(updated);

    // Sync to Firestore
    try {
      await setDoc(doc(db, 'applications', id), newApp);
    } catch (err) {
      console.warn('Firestore write warning:', err);
    }

    return newApp;
  },

  async updateApplicationStatus(
    id: string,
    status: VisaApplication['status'],
    officerNotes?: string,
    actionRequiredReason?: string
  ): Promise<VisaApplication> {
    const now = new Date().toISOString();
    const local = getLocalApps();
    const index = local.findIndex((a) => a.id === id);

    let updatedApp: VisaApplication;
    if (index >= 0) {
      updatedApp = {
        ...local[index],
        status,
        officerNotes: officerNotes || local[index].officerNotes,
        actionRequiredReason: actionRequiredReason || local[index].actionRequiredReason,
        reviewedAt: now,
        updatedAt: now,
        eVisaNumber: status === 'approved' && !local[index].eVisaNumber
          ? `${local[index].destinationCountry.substring(0, 2).toUpperCase()}-EV-${Math.floor(100000 + Math.random() * 900000)}`
          : local[index].eVisaNumber,
      };
      local[index] = updatedApp;
      saveLocalApps([...local]);
    } else {
      throw new Error(`Application ${id} not found`);
    }

    try {
      const docRef = doc(db, 'applications', id);
      await updateDoc(docRef, {
        status,
        officerNotes: updatedApp.officerNotes,
        actionRequiredReason: updatedApp.actionRequiredReason,
        reviewedAt: updatedApp.reviewedAt,
        updatedAt: updatedApp.updatedAt,
        eVisaNumber: updatedApp.eVisaNumber,
      });
    } catch (err) {
      console.warn('Firestore update warning:', err);
    }

    return updatedApp;
  },

  async getConsultations(userId?: string): Promise<Consultation[]> {
    try {
      const colRef = collection(db, 'consultations');
      const snap = await getDocs(colRef);
      if (snap.empty) {
        const local = getLocalConsultations();
        for (const c of local) {
          await setDoc(doc(db, 'consultations', c.id), c).catch(() => {});
        }
        return userId ? local.filter((c) => c.userId === userId || c.userId === 'demo-applicant-001') : local;
      }
      const all = snap.docs.map((d) => d.data() as Consultation);
      return userId ? all.filter((c) => c.userId === userId || c.userId === 'demo-applicant-001') : all;
    } catch (err) {
      const local = getLocalConsultations();
      return userId ? local.filter((c) => c.userId === userId || c.userId === 'demo-applicant-001') : local;
    }
  },

  async bookConsultation(data: Omit<Consultation, 'id' | 'createdAt'>): Promise<Consultation> {
    const id = `CNS-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();
    const item: Consultation = {
      ...data,
      id,
      createdAt: now,
    };

    const local = getLocalConsultations();
    saveLocalConsultations([item, ...local]);

    try {
      await setDoc(doc(db, 'consultations', id), item);
    } catch (err) {
      console.warn('Firestore consultation save warning:', err);
    }

    return item;
  },

  async updateConsultationStatus(id: string, status: Consultation['status'], notes?: string): Promise<Consultation> {
    const local = getLocalConsultations();
    const index = local.findIndex((c) => c.id === id);
    if (index >= 0) {
      local[index] = {
        ...local[index],
        status,
        notes: notes !== undefined ? notes : local[index].notes,
      };
      saveLocalConsultations([...local]);
      try {
        await updateDoc(doc(db, 'consultations', id), {
          status,
          notes: local[index].notes,
        });
      } catch (err) {
        console.warn('Firestore consultation update warning:', err);
      }
      return local[index];
    }
    throw new Error(`Consultation ${id} not found`);
  },
};
