export type UserRole = 'applicant' | 'officer' | 'consultant' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  nationality?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'action_required'
  | 'approved'
  | 'rejected';

export interface AIDocumentVerification {
  score: number; // 0 - 100
  status: 'PASSED' | 'FLAGGED' | 'REJECTED';
  mrzValid: boolean;
  detectedPassportNumber?: string;
  detectedName?: string;
  detectedNationality?: string;
  detectedExpiryDate?: string;
  validityMonthsRemaining?: number;
  photoClarityScore: number; // 0 - 100
  tamperRisk: 'LOW' | 'MODERATE' | 'HIGH';
  anomalies: string[];
  recommendations: string[];
}

export interface AIPrediction {
  estimatedDays: number;
  estimatedDate: string;
  confidenceScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  bottlenecks: string[];
  tips: string[];
}

export interface VisaApplication {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  nationality: string;
  destinationCountry: string;
  visaType: string;
  passportNumber: string;
  passportExpiry: string;
  dateOfBirth?: string;
  travelDate: string;
  returnDate: string;
  purposeOfVisit: string;
  stayAddress?: string;
  status: ApplicationStatus;
  aiVerificationScore: number;
  aiVerification?: AIDocumentVerification;
  aiEstimatedDays: number;
  aiEstimatedDate: string;
  aiConfidence?: number;
  aiRiskLevel: 'low' | 'medium' | 'high';
  officerNotes?: string;
  actionRequiredReason?: string;
  feeAmount: number;
  paymentStatus: 'unpaid' | 'paid';
  eVisaNumber?: string;
  submittedAt?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Consultant {
  id: string;
  name: string;
  title: string;
  country: string;
  rating: number;
  reviewsCount: number;
  specialties: string[];
  hourlyRate: number;
  availableDays: string[];
  avatar: string;
  verified: boolean;
  licenseNumber: string;
}

export interface Consultation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  consultantId: string;
  consultantName: string;
  consultantSpecialty: string;
  dateTime: string;
  duration: number; // minutes
  topic: string;
  meetingType: 'video' | 'phone';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface VisaTypeDetail {
  id: string;
  country: string;
  flag: string;
  name: string;
  category: 'Tourist' | 'Business' | 'Digital Nomad' | 'Transit' | 'Student';
  processingTimeNormal: string;
  processingTimeExpress: string;
  validityPeriod: string;
  stayDuration: string;
  governmentFee: number;
  serviceFee: number;
  popular: boolean;
  entryType: 'Single Entry' | 'Multiple Entry';
  requirements: string[];
  eligibilityDescription: string;
}

export interface EligibilityResult {
  eligible: boolean;
  probability: number;
  category: string;
  riskAssessment: string;
  strengths: string[];
  weaknesses: string[];
  requiredDocuments: string[];
  recommendedVisaType: string;
  adviceNotes: string;
}
