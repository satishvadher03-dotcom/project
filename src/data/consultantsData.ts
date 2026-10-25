import { Consultant } from '../types/visa.ts';

export const IMMIGRATION_CONSULTANTS: Consultant[] = [
  {
    id: 'cons-1',
    name: 'Eleanor Vance, Esq.',
    title: 'Senior Immigration Attorney & Former Consular Officer',
    country: 'United States & UK',
    rating: 4.96,
    reviewsCount: 342,
    specialties: ['Schengen Long-Stay', 'US B1/B2 & E-2 Visas', 'Rejection Appeals', 'Fast-Track eTA'],
    hourlyRate: 140,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    verified: true,
    licenseNumber: 'BAR-NY#7492109'
  },
  {
    id: 'cons-2',
    name: 'Dr. Hiroshi Tanaka',
    title: 'East Asia Visa Strategist & Diplomatic Liaison',
    country: 'Japan & Singapore',
    rating: 4.92,
    reviewsCount: 289,
    specialties: ['Japan eVisa & HSP', 'APAC Business Travel', 'Singapore Pass', 'Financial Sponsorship'],
    hourlyRate: 120,
    availableDays: ['Mon', 'Wed', 'Thu', 'Sat'],
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    verified: true,
    licenseNumber: 'JIA-REG#88341'
  },
  {
    id: 'cons-3',
    name: 'Sofia Al-Mansoor',
    title: 'Middle East & Schengen Relocation Consultant',
    country: 'UAE & EU',
    rating: 4.98,
    reviewsCount: 415,
    specialties: ['Dubai Golden Visa', 'Digital Nomad Indonesia', 'EU Type-D Visas', 'Family Sponsorship'],
    hourlyRate: 110,
    availableDays: ['Tue', 'Wed', 'Thu', 'Fri', 'Sun'],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300',
    verified: true,
    licenseNumber: 'DIFC-IMM#55209'
  },
  {
    id: 'cons-4',
    name: 'Marcus Sterling',
    title: 'Global Mobility Counsel & Border Law Specialist',
    country: 'Canada & Australia',
    rating: 4.89,
    reviewsCount: 198,
    specialties: ['Canada eTA & Express Entry', 'Australia Subclass 600', 'Complex Background Reviews'],
    hourlyRate: 135,
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    verified: true,
    licenseNumber: 'CICC-R#901452'
  }
];
