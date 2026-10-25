import { VisaTypeDetail } from '../types/visa.ts';

export const VISA_TYPES: VisaTypeDetail[] = [
  {
    id: 'jp-tourist-evisa',
    country: 'Japan',
    flag: '🇯🇵',
    name: 'Short-Term eVisa (Tourism)',
    category: 'Tourist',
    processingTimeNormal: '3 - 5 business days',
    processingTimeExpress: '24 - 48 hours',
    validityPeriod: '90 days from issue',
    stayDuration: 'Up to 90 days',
    governmentFee: 22,
    serviceFee: 15,
    popular: true,
    entryType: 'Single Entry',
    requirements: [
      'Passport valid for at least 6 months beyond intended stay',
      'Recent high-resolution passport photo with white background',
      'Flight itinerary reservation (confirmed or provisional)',
      'Proof of sufficient funds (bank statements for last 3 months)',
      'Hotel reservation or accommodation voucher'
    ],
    eligibilityDescription: 'Available for citizens of eligible countries traveling for tourism, sightseeing, or visiting acquaintances without receiving compensation.'
  },
  {
    id: 'schengen-evisa',
    country: 'Schengen (EU)',
    flag: '🇪🇺',
    name: 'Unified Schengen Short Stay (Type C)',
    category: 'Tourist',
    processingTimeNormal: '5 - 10 business days',
    processingTimeExpress: '3 business days',
    validityPeriod: '6 months to 1 year',
    stayDuration: '90 days within any 180-day window',
    governmentFee: 80,
    serviceFee: 25,
    popular: true,
    entryType: 'Multiple Entry',
    requirements: [
      'Valid passport with at least 2 blank pages issued within last 10 years',
      'Schengen travel medical insurance covering min €30,000 emergency care',
      'Round-trip flight booking and accommodation itinerary',
      'Proof of financial means (min €65/day for duration of stay)',
      'Employment verification letter or business registration'
    ],
    eligibilityDescription: 'Covers travel across all 29 Schengen member states for leisure, family visits, or business meetings without employment.'
  },
  {
    id: 'usa-esta-evisa',
    country: 'United States',
    flag: '🇺🇸',
    name: 'ESTA / B1-B2 e-Authorization',
    category: 'Tourist',
    processingTimeNormal: '24 - 72 hours',
    processingTimeExpress: '6 - 12 hours',
    validityPeriod: '2 years or until passport expires',
    stayDuration: 'Up to 90 days per visit',
    governmentFee: 21,
    serviceFee: 19,
    popular: true,
    entryType: 'Multiple Entry',
    requirements: [
      'e-Passport containing an electronic biometric chip (e-Symbol)',
      'Valid credit or debit card for DHS authorization fee',
      'Contact email and phone number',
      'US point of contact address (hotel or host)'
    ],
    eligibilityDescription: 'Electronic travel authorization under the Visa Waiver Program for eligible nationals entering by air or sea for tourism or business.'
  },
  {
    id: 'uk-standard-visitor',
    country: 'United Kingdom',
    flag: '🇬🇧',
    name: 'UK ETA & Standard Visitor eVisa',
    category: 'Tourist',
    processingTimeNormal: '3 business days',
    processingTimeExpress: '24 hours',
    validityPeriod: '2 years',
    stayDuration: 'Up to 6 months per trip',
    governmentFee: 12,
    serviceFee: 18,
    popular: true,
    entryType: 'Multiple Entry',
    requirements: [
      'Valid national passport',
      'Biometric digital photo matching UKVI specifications',
      'Details of travel dates and accommodation',
      'Proof of self-sufficiency without public funds'
    ],
    eligibilityDescription: 'Permits entry for holidays, visiting friends, business conferences, and short-term study up to 6 months.'
  },
  {
    id: 'uae-tourist-evisa',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    name: 'Dubai & UAE 30-Day Tourist eVisa',
    category: 'Tourist',
    processingTimeNormal: '24 - 48 hours',
    processingTimeExpress: '4 - 8 hours',
    validityPeriod: '60 days to enter',
    stayDuration: '30 days from date of entry',
    governmentFee: 95,
    serviceFee: 20,
    popular: true,
    entryType: 'Single Entry',
    requirements: [
      'Passport copy with minimum 6 months validity',
      'Passport-size photo with white background',
      'Confirmed return airline ticket with Emirates, flydubai, or partner airlines',
      'Hotel booking confirmation'
    ],
    eligibilityDescription: 'Fast-track electronic approval for leisure travelers visiting Dubai, Abu Dhabi, or any of the 7 Emirates.'
  },
  {
    id: 'bali-digital-nomad',
    country: 'Indonesia',
    flag: '🇮🇩',
    name: 'Remote Worker / Digital Nomad eVisa (E33G)',
    category: 'Digital Nomad',
    processingTimeNormal: '5 - 7 business days',
    processingTimeExpress: '48 hours',
    validityPeriod: '1 year',
    stayDuration: 'Up to 1 year renewable',
    governmentFee: 150,
    serviceFee: 40,
    popular: true,
    entryType: 'Multiple Entry',
    requirements: [
      'Passport valid for at least 18 months',
      'Proof of remote employment or contract with foreign company outside Indonesia',
      'Minimum annual foreign income statement of $60,000 USD or bank balance equivalent',
      'Proof of valid international health insurance'
    ],
    eligibilityDescription: 'Dedicated legal path for digital nomads to live in Bali and Indonesia tax-free on foreign income while working remotely.'
  },
  {
    id: 'australia-evisitor',
    country: 'Australia',
    flag: '🇦🇺',
    name: 'eVisitor (Subclass 651) / ETA',
    category: 'Tourist',
    processingTimeNormal: '1 - 2 business days',
    processingTimeExpress: '12 hours',
    validityPeriod: '12 months',
    stayDuration: '3 months per visit',
    governmentFee: 20,
    serviceFee: 15,
    popular: false,
    entryType: 'Multiple Entry',
    requirements: [
      'Passport from eligible European or ETA-designated territory',
      'Clean criminal background declaration',
      'Health declaration affirming no active tuberculosis'
    ],
    eligibilityDescription: 'Streamlined online authorization for business visitors and holidaymakers visiting Australia.'
  },
  {
    id: 'canada-eta',
    country: 'Canada',
    flag: '🇨🇦',
    name: 'Electronic Travel Authorization (eTA)',
    category: 'Tourist',
    processingTimeNormal: '24 hours',
    processingTimeExpress: '2 hours',
    validityPeriod: '5 years or until passport expires',
    stayDuration: 'Up to 6 months per entry',
    governmentFee: 7,
    serviceFee: 12,
    popular: false,
    entryType: 'Multiple Entry',
    requirements: [
      'Valid biometric passport from visa-exempt nation',
      'Valid payment method for $7 CAD IRCC fee',
      'Active email address'
    ],
    eligibilityDescription: 'Mandatory entry requirement for visa-exempt foreign nationals flying to or transiting through a Canadian airport.'
  },
  {
    id: 'singapore-evisa',
    country: 'Singapore',
    flag: '🇸🇬',
    name: 'SG Electronic Visa & Arrival Card',
    category: 'Business',
    processingTimeNormal: '1 - 3 business days',
    processingTimeExpress: '24 hours',
    validityPeriod: '9 weeks from date of issue',
    stayDuration: 'Up to 30 days per entry',
    governmentFee: 30,
    serviceFee: 18,
    popular: false,
    entryType: 'Multiple Entry',
    requirements: [
      'Passport valid for at least 6 months from arrival date',
      'Digital passport photo taken within last 3 months',
      'Local Singapore sponsor or registered visa agency guarantee',
      'Confirmed onward ticket'
    ],
    eligibilityDescription: 'Facilitates fast entry for business executives, delegates, and tourists visiting Singapore.'
  }
];
