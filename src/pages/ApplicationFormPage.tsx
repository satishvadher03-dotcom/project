import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  FileText,
  User,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Scan,
  Calendar,
  Lock,
  Clock,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { VISA_TYPES } from '../data/visaTypesData.ts';
import { applicationService } from '../services/applicationService.ts';
import { requestAIDocumentVerification, requestAIPrediction } from '../services/aiService.ts';
import { AIDocumentVerification, AIPrediction } from '../types/visa.ts';

interface ApplicationFormPageProps {
  onNavigate: (page: string, params?: any) => void;
  initialVisaId?: string;
}

export const ApplicationFormPage: React.FC<ApplicationFormPageProps> = ({
  onNavigate,
  initialVisaId,
}) => {
  const { user } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [selectedVisaId, setSelectedVisaId] = useState<string>(
    initialVisaId || 'jp-tourist-evisa'
  );
  const [isExpress, setIsExpress] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Travel
    destinationCountry: 'Japan',
    visaType: 'Short-Term eVisa (Tourism)',
    travelDate: '2026-11-20',
    returnDate: '2026-12-05',
    purposeOfVisit: 'Tourism & sightseeing in Tokyo & Kyoto',
    stayAddress: 'Shinjuku Granbell Hotel, Tokyo',

    // Step 2: Personal
    fullName: user?.displayName || 'Alex Morgan',
    email: user?.email || 'alex.morgan.travels@example.com',
    nationality: user?.nationality || 'United States',
    dateOfBirth: '1992-04-12',
    gender: 'Female',
    phoneNumber: '+1 (555) 349-8120',

    // Step 3: Passport & AI verification
    passportNumber: 'US89214710',
    issuingCountry: 'United States',
    passportExpiry: '2030-08-15',
    documentType: 'Ordinary Biometric Passport (P<USA)',
  });

  // AI Verification state
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [aiVerification, setAiVerification] = useState<AIDocumentVerification | null>(null);

  // AI Prediction state
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [aiPrediction, setAiPrediction] = useState<AIPrediction | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  const selectedVisa = VISA_TYPES.find((v) => v.id === selectedVisaId) || VISA_TYPES[0];

  useEffect(() => {
    if (selectedVisa) {
      setFormData((prev) => ({
        ...prev,
        destinationCountry: selectedVisa.country,
        visaType: selectedVisa.name,
      }));
    }
  }, [selectedVisaId]);

  // Run AI Document Verification
  const handleRunDocumentVerification = async () => {
    setIsScanning(true);
    try {
      const result = await requestAIDocumentVerification({
        passportNumber: formData.passportNumber,
        fullName: formData.fullName,
        nationality: formData.nationality,
        dateOfBirth: formData.dateOfBirth,
        expiryDate: formData.passportExpiry,
        documentType: formData.documentType,
        issuingCountry: formData.issuingCountry,
      });
      setAiVerification(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  // Run AI Prediction when reaching step 4
  useEffect(() => {
    if (step === 4) {
      const fetchPrediction = async () => {
        setIsPredicting(true);
        try {
          const prediction = await requestAIPrediction({
            nationality: formData.nationality,
            destinationCountry: formData.destinationCountry,
            visaType: formData.visaType,
            travelDate: formData.travelDate,
            isExpress,
          });
          setAiPrediction(prediction);
        } catch (err) {
          console.error(err);
        } finally {
          setIsPredicting(false);
        }
      };
      fetchPrediction();
    }
  }, [step, isExpress]);

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      const totalFee = selectedVisa.governmentFee + selectedVisa.serviceFee + (isExpress ? 25 : 0);

      const newApp = await applicationService.submitApplication({
        applicantId: user?.uid || 'demo-applicant-001',
        applicantName: formData.fullName,
        applicantEmail: formData.email,
        nationality: formData.nationality,
        destinationCountry: formData.destinationCountry,
        visaType: formData.visaType,
        passportNumber: formData.passportNumber,
        passportExpiry: formData.passportExpiry,
        dateOfBirth: formData.dateOfBirth,
        travelDate: formData.travelDate,
        returnDate: formData.returnDate,
        purposeOfVisit: formData.purposeOfVisit,
        stayAddress: formData.stayAddress,
        status: 'submitted',
        aiVerificationScore: aiVerification?.score || 92,
        aiVerification: aiVerification || {
          score: 92,
          status: 'PASSED',
          mrzValid: true,
          photoClarityScore: 94,
          tamperRisk: 'LOW',
          anomalies: [],
          recommendations: ['Document checksum matches official registry'],
        },
        aiEstimatedDays: aiPrediction?.estimatedDays || (isExpress ? 1 : 3),
        aiEstimatedDate: aiPrediction?.estimatedDate || 'Nov 02, 2026',
        aiConfidence: aiPrediction?.confidenceScore || 95,
        aiRiskLevel: aiPrediction?.riskLevel || 'low',
        feeAmount: totalFee,
        paymentStatus: 'paid',
        submittedAt: new Date().toISOString(),
      });

      setSubmittedAppId(newApp.id);

      // Trigger approval celebration
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    } catch (err) {
      console.error('Failed to submit application:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Autofill sample biometric passport credentials
  const handleAutofillBiometrics = () => {
    setFormData((prev) => ({
      ...prev,
      fullName: 'Alex Morgan',
      passportNumber: 'US89214710',
      issuingCountry: 'United States',
      passportExpiry: '2030-08-15',
      dateOfBirth: '1992-04-12',
      documentType: 'Ordinary Biometric Passport (P<USA)',
    }));
    handleRunDocumentVerification();
  };

  if (submittedAppId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl shadow-blue-500/5 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
              Application Successfully Filed
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900">
              eVisa Reference #{submittedAppId}
            </h1>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your application for <span className="font-semibold text-slate-800">{formData.destinationCountry}</span> ({formData.visaType}) has been logged with diplomatic border control.
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-left space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-600">Applicant:</span>
              <span className="font-semibold text-slate-800">{formData.fullName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-600">Passport Number:</span>
              <span className="font-semibold font-mono text-slate-800">{formData.passportNumber}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200/60">
              <span className="text-slate-600">AI Document Integrity Score:</span>
              <span className="font-bold text-emerald-600">
                {aiVerification?.score || 95}% (Verified)
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-600">AI Predictive Approval Date:</span>
              <span className="font-semibold text-blue-600">{aiPrediction?.estimatedDate || 'Within 48 hours'}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition"
            >
              Go to Applicant Dashboard
            </button>
            <button
              onClick={() => onNavigate('admin')}
              className="py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-sm font-semibold transition"
            >
              View in Consular Queue (Officer Mode)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Page Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Biometric & ICAO Doc 9303 Verified Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Electronic Visa Application
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Complete the 4 steps below for instant verification and predictive timeline forecasting.
        </p>
      </div>

      {/* Step Indicator Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <button
            onClick={() => setStep(1)}
            className={`py-2 px-1 rounded-xl font-semibold transition flex flex-col items-center ${
              step === 1
                ? 'bg-blue-600 text-white shadow-xs'
                : step > 1
                ? 'text-blue-600 bg-blue-50'
                : 'text-slate-600'
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider">Step 1</span>
            <span className="truncate w-full">Travel & Visa</span>
          </button>

          <button
            onClick={() => setStep(2)}
            className={`py-2 px-1 rounded-xl font-semibold transition flex flex-col items-center ${
              step === 2
                ? 'bg-blue-600 text-white shadow-xs'
                : step > 2
                ? 'text-blue-600 bg-blue-50'
                : 'text-slate-600'
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider">Step 2</span>
            <span className="truncate w-full">Personal Bio</span>
          </button>

          <button
            onClick={() => setStep(3)}
            className={`py-2 px-1 rounded-xl font-semibold transition flex flex-col items-center ${
              step === 3
                ? 'bg-blue-600 text-white shadow-xs'
                : step > 3
                ? 'text-blue-600 bg-blue-50'
                : 'text-slate-600'
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider">Step 3</span>
            <span className="truncate w-full">AI Document Scan</span>
          </button>

          <button
            onClick={() => setStep(4)}
            className={`py-2 px-1 rounded-xl font-semibold transition flex flex-col items-center ${
              step === 4
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600'
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider">Step 4</span>
            <span className="truncate w-full">Forecast & Pay</span>
          </button>
        </div>
      </div>

      {/* Main Multi-Step Form Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* STEP 1: Destination & Visa Category */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Select eVisa Type & Destination</span>
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Choose the country and entry category corresponding to your travel purpose.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Destination Country</label>
                <select
                  value={selectedVisaId}
                  onChange={(e) => setSelectedVisaId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                >
                  {VISA_TYPES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.flag} {v.country} - {v.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Processing Queue Priority</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExpress(false)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                      !isExpress
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    Standard Queue ({selectedVisa.processingTimeNormal})
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsExpress(true)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition flex items-center justify-center space-x-1 ${
                      isExpress
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Express Fast-Track (+$25)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Travel Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Intended Travel Date</label>
                <input
                  type="date"
                  value={formData.travelDate}
                  onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Return / Onward Departure</label>
                <input
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Purpose & Stay Address */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Purpose of Visit</label>
                <input
                  type="text"
                  value={formData.purposeOfVisit}
                  onChange={(e) => setFormData({ ...formData, purposeOfVisit: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Vacation, business conferences, family visit"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Accommodation / Destination Address</label>
                <input
                  type="text"
                  value={formData.stayAddress}
                  onChange={(e) => setFormData({ ...formData, stayAddress: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  placeholder="Hotel name or residential street address"
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition flex items-center space-x-1.5"
              >
                <span>Continue to Personal Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Personal Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>Traveler Identification Details</span>
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Ensure details match your passport exactly to prevent border delays.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Full Name (as in Passport)</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Nationality / Citizenship</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Contact Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Mobile Phone Number</label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(3);
                  if (!aiVerification) {
                    handleRunDocumentVerification();
                  }
                }}
                className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition flex items-center space-x-1.5"
              >
                <span>Continue to AI Document Scan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Passport Details & Live AI Document Scanner */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                  <Scan className="w-5 h-5 text-blue-600" />
                  <span>AI Document Verification & Biometrics</span>
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Machine-vision OCR scans passport MRZ strings, evaluates clarity, and checks tamper risk.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAutofillBiometrics}
                className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition self-start sm:self-auto"
              >
                Autofill Valid Sample Passport
              </button>
            </div>

            {/* Passport Scanner Simulation Box */}
            <div className="relative rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/40 p-6 text-center overflow-hidden">
              {isScanning && (
                <div className="absolute inset-0 bg-blue-900/10 backdrop-blur-xs flex flex-col items-center justify-center z-20">
                  <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-blue-900 mt-3 animate-pulse">
                    AI Scanning Passport MRZ & Biometric Checksum...
                  </p>
                </div>
              )}

              <div className="max-w-md mx-auto space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <Scan className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    ICAO 9303 Biometric Document Scanner
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Passport scan or camera capture is automatically validated against international travel databases.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleRunDocumentVerification}
                    className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
                  >
                    Run AI Verification Scan
                  </button>
                </div>
              </div>
            </div>

            {/* Passport Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Passport Number</label>
                <input
                  type="text"
                  value={formData.passportNumber}
                  onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Issuing Authority</label>
                <input
                  type="text"
                  value={formData.issuingCountry}
                  onChange={(e) => setFormData({ ...formData, issuingCountry: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Passport Expiry Date</label>
                <input
                  type="date"
                  value={formData.passportExpiry}
                  onChange={(e) => setFormData({ ...formData, passportExpiry: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Live AI Verification Result Card */}
            {aiVerification && (
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      AI Biometric & Fraud Verification Report
                    </h4>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      aiVerification.status === 'PASSED'
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}
                  >
                    STATUS: {aiVerification.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                    <span className="text-slate-600 block text-[11px]">Integrity Score</span>
                    <span className="text-lg font-extrabold text-blue-600">
                      {aiVerification.score}/100
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                    <span className="text-slate-600 block text-[11px]">MRZ Checksum</span>
                    <span className="text-sm font-bold text-emerald-600">
                      {aiVerification.mrzValid ? '100% Valid' : 'Invalid'}
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                    <span className="text-slate-600 block text-[11px]">Photo Clarity</span>
                    <span className="text-sm font-bold text-slate-800">
                      {aiVerification.photoClarityScore}% HD
                    </span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200/80">
                    <span className="text-slate-600 block text-[11px]">Tamper Risk</span>
                    <span className="text-sm font-bold text-emerald-600">
                      {aiVerification.tamperRisk}
                    </span>
                  </div>
                </div>

                {/* Recommendations & anomalies */}
                <div className="space-y-1.5 text-xs">
                  {aiVerification.recommendations.map((rec, i) => (
                    <div key={i} className="flex items-start space-x-2 text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                  {aiVerification.anomalies.map((anom, i) => (
                    <div key={i} className="flex items-start space-x-2 text-amber-700">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{anom}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-xs transition flex items-center space-x-1.5"
              >
                <span>Continue to Forecast & Pay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Review, AI Predictive Processing Time & Payment Simulation */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>Predictive Consular Timeline & Submission</span>
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Final review and official consular filing fees.
              </p>
            </div>

            {/* AI Predictive Processing Time Forecast Widget */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white rounded-2xl border border-blue-200 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                    AI Consular Turnaround Forecast
                  </h4>
                </div>
                {isPredicting ? (
                  <span className="text-xs text-blue-600 font-semibold animate-pulse">
                    Calculating diplomatic queue...
                  </span>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {aiPrediction?.confidenceScore || 95}% Confidence Score
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-blue-100">
                  <span className="text-xs text-slate-600 block">Projected Clearance Date</span>
                  <p className="text-2xl font-black text-slate-900 mt-0.5">
                    {aiPrediction?.estimatedDate || 'Oct 28, 2026'}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    Estimated {aiPrediction?.estimatedDays || (isExpress ? 1 : 3)} business days
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-blue-100 text-xs space-y-1.5 text-slate-600">
                  <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                    Queue Insights
                  </span>
                  <p>• Embassy seasonal workload: Low volume</p>
                  <p>• Biometric pre-clearance: Passed with zero interpol alerts</p>
                  <p>• {isExpress ? 'Express VIP Priority enabled' : 'Standard consular batch'}</p>
                </div>
              </div>
            </div>

            {/* Application Summary Box */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2 text-xs">
              <h4 className="font-bold text-slate-900">Application Overview</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 pt-1">
                <div>
                  <span className="block text-[10px] text-slate-600 uppercase">Applicant</span>
                  <span className="font-semibold text-slate-800">{formData.fullName}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-600 uppercase">Destination</span>
                  <span className="font-semibold text-slate-800">{formData.destinationCountry}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-600 uppercase">Passport</span>
                  <span className="font-mono font-semibold text-slate-800">{formData.passportNumber}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-600 uppercase">Travel Date</span>
                  <span className="font-semibold text-slate-800">{formData.travelDate}</span>
                </div>
              </div>
            </div>

            {/* Fee Breakdown */}
            <div className="border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Government Consular Fee:</span>
                <span className="font-semibold text-slate-800">${selectedVisa.governmentFee} USD</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>AuraVisa Secure Biometric Processing:</span>
                <span className="font-semibold text-slate-800">${selectedVisa.serviceFee} USD</span>
              </div>
              {isExpress && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>VIP Express Priority (24h turnaround):</span>
                  <span>+$25 USD</span>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Amount Due:</span>
                <span className="text-lg text-blue-600">
                  ${selectedVisa.governmentFee + selectedVisa.serviceFee + (isExpress ? 25 : 0)} USD
                </span>
              </div>
            </div>

            {/* Simulation Payment Notice */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center space-x-2 text-xs text-emerald-800">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Sandbox Mode Active: Clicking "Submit & Pay Fee" securely creates the application and registers your biometrics in the database.
              </span>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitApplication}
                className="py-3 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-500/20 transition flex items-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting to Border Control...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit & Pay Fee (${selectedVisa.governmentFee + selectedVisa.serviceFee + (isExpress ? 25 : 0)})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
