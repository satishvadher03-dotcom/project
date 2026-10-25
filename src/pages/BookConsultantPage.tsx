import React, { useState } from 'react';
import {
  Award,
  Calendar,
  Clock,
  Video,
  Phone,
  CheckCircle2,
  Star,
  Search,
  ArrowRight,
  ShieldCheck,
  X,
  FileCheck2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.tsx';
import { IMMIGRATION_CONSULTANTS } from '../data/consultantsData.ts';
import { applicationService } from '../services/applicationService.ts';
import { Consultant } from '../types/visa.ts';

interface BookConsultantPageProps {
  onNavigate: (page: string) => void;
}

export const BookConsultantPage: React.FC<BookConsultantPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [activeConsultant, setActiveConsultant] = useState<Consultant | null>(null);

  // Booking Form State
  const [bookingDate, setBookingDate] = useState<string>('2026-10-29');
  const [bookingTime, setBookingTime] = useState<string>('14:00 GMT');
  const [meetingType, setMeetingType] = useState<'video' | 'phone'>('video');
  const [topic, setTopic] = useState<string>('Strategy for Schengen Long-Stay Multiple Entry & Appeal');
  const [notes, setNotes] = useState<string>('');

  const [isBooking, setIsBooking] = useState<boolean>(false);
  const [bookedConfirmation, setBookedConfirmation] = useState<any | null>(null);

  const filteredConsultants = IMMIGRATION_CONSULTANTS.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.specialties.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;
    if (selectedSpecialty !== 'All') {
      return c.specialties.some((s) => s.toLowerCase().includes(selectedSpecialty.toLowerCase()));
    }
    return true;
  });

  const handleConfirmBooking = async () => {
    if (!activeConsultant) return;
    setIsBooking(true);
    try {
      const consultation = await applicationService.bookConsultation({
        userId: user?.uid || 'demo-applicant-001',
        userName: user?.displayName || 'Alex Morgan',
        userEmail: user?.email || 'alex.morgan.travels@example.com',
        consultantId: activeConsultant.id,
        consultantName: activeConsultant.name,
        consultantSpecialty: activeConsultant.specialties[0],
        dateTime: `${bookingDate} at ${bookingTime}`,
        duration: 45,
        topic,
        meetingType,
        status: 'scheduled',
        notes,
      });

      setBookedConfirmation(consultation);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>Accredited Immigration Law Network</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Consult a Licensed Immigration Specialist
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Connect 1-on-1 with registered bar attorneys and former diplomatic consular officers for complex visa petitions, digital nomad relocations, and refusal appeals.
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-600 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by lawyer, country, or specialty..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto text-xs">
          {['All', 'Schengen', 'US B1/B2', 'Nomad', 'Japan'].map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`py-1.5 px-3 rounded-lg font-semibold transition ${
                selectedSpecialty === spec
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Consultants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredConsultants.map((consultant) => (
          <div
            key={consultant.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition space-y-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <img
                  src={consultant.avatar}
                  alt={consultant.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 text-base">{consultant.name}</h3>
                    {consultant.verified && (
                      <span className="inline-flex items-center text-blue-600" title="Bar Verified">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{consultant.title}</p>
                  <div className="flex items-center space-x-3 text-xs pt-1">
                    <span className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                      {consultant.rating} ({consultant.reviewsCount})
                    </span>
                    <span className="text-slate-600 font-medium font-mono text-[11px]">
                      {consultant.licenseNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Specialties */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Core Jurisdictions & Specialties
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {consultant.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="text-xs text-slate-600 flex items-center justify-between pt-2 border-t border-slate-100">
                <span>Available: {consultant.availableDays.join(', ')}</span>
                <span className="font-bold text-slate-900 text-sm">
                  ${consultant.hourlyRate} USD <span className="text-xs text-slate-600 font-normal">/ session</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveConsultant(consultant);
                setBookedConfirmation(null);
              }}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center space-x-2"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book 1-on-1 Consultation</span>
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal / Dialog */}
      {activeConsultant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            {!bookedConfirmation ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <img
                      src={activeConsultant.avatar}
                      alt={activeConsultant.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{activeConsultant.name}</h3>
                      <p className="text-xs text-blue-600 font-semibold">{activeConsultant.country}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveConsultant(null)}
                    className="p-1 text-slate-600 hover:text-slate-800"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Select Meeting Format */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Session Format</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setMeetingType('video')}
                        className={`p-2.5 rounded-xl border text-left font-semibold transition flex items-center space-x-2 ${
                          meetingType === 'video'
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-slate-200 text-slate-700'
                        }`}
                      >
                        <Video className="w-4 h-4" />
                        <span>Encrypted HD Video</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setMeetingType('phone')}
                        className={`p-2.5 rounded-xl border text-left font-semibold transition flex items-center space-x-2 ${
                          meetingType === 'phone'
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-slate-200 text-slate-700'
                        }`}
                      >
                        <Phone className="w-4 h-4" />
                        <span>Direct Audio Call</span>
                      </button>
                    </div>
                  </div>

                  {/* Date & Time Picker */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">Preferred Date</label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">Time Slot</label>
                      <select
                        value={bookingTime}
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="10:00 GMT">10:00 AM GMT</option>
                        <option value="14:00 GMT">02:00 PM GMT</option>
                        <option value="16:30 GMT">04:30 PM GMT</option>
                        <option value="19:00 GMT">07:00 PM GMT</option>
                      </select>
                    </div>
                  </div>

                  {/* Topic & Notes */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Consultation Objective</label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. Visa rejection appeal, tax nomad questions"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Brief Background / Notes</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Share details or paste your previous visa reference numbers..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                    <span className="text-slate-600">45-minute Consultation Session:</span>
                    <span className="font-black text-slate-900 text-sm">
                      ${activeConsultant.hourlyRate} USD
                    </span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setActiveConsultant(null)}
                    className="py-2 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isBooking}
                    onClick={handleConfirmBooking}
                    className="py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                  >
                    {isBooking ? 'Confirming Appointment...' : 'Confirm Booking'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    Advisory Session Confirmed!
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Booking ref <span className="font-mono font-bold text-slate-800">#{bookedConfirmation.id}</span> with {bookedConfirmation.consultantName}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-left space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Time:</span>
                    <span className="font-bold text-slate-900">{bookedConfirmation.dateTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Format:</span>
                    <span className="font-semibold text-blue-600 capitalize">{bookedConfirmation.meetingType} Conference</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Topic:</span>
                    <span className="font-semibold text-slate-800">{bookedConfirmation.topic}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setActiveConsultant(null);
                      onNavigate('dashboard');
                    }}
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    View in Dashboard
                  </button>
                  <button
                    onClick={() => setActiveConsultant(null)}
                    className="py-2.5 px-4 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
