
import { Specialty, Doctor } from './types';

export const SPECIALTIES: Specialty[] = [
  'Medicina General',
  'Cardiología',
  'Pediatría',
  'Dermatología',
  'Neurología',
  'Oftalmología'
];

export const MOCK_DOCTORS: Doctor[] = [
  { id: 'dr1', name: 'Dra. Sara Johnson', specialty: 'Cardiología', image: 'https://picsum.photos/seed/dr1/200/200' },
  { id: 'dr2', name: 'Dr. Michael Chen', specialty: 'Pediatría', image: 'https://picsum.photos/seed/dr2/200/200' },
  { id: 'dr3', name: 'Dra. Elena Rodriguez', specialty: 'Dermatología', image: 'https://picsum.photos/seed/dr3/200/200' },
  { id: 'dr4', name: 'Dr. James Wilson', specialty: 'Neurología', image: 'https://picsum.photos/seed/dr4/200/200' },
  { id: 'dr5', name: 'Dra. Emily Brown', specialty: 'Medicina General', image: 'https://picsum.photos/seed/dr5/200/200' },
  { id: 'dr6', name: 'Dr. David Lee', specialty: 'Oftalmología', image: 'https://picsum.photos/seed/dr6/200/200' },
  { id: 'dr7', name: 'Dra. Lisa Wang', specialty: 'Cardiología', image: 'https://picsum.photos/seed/dr7/200/200' },
];
