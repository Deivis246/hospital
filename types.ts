
export enum UserRole {
  PATIENT = 'PACIENTE',
  ADMIN = 'ADMINISTRADOR'
}

export type Specialty = 'Cardiología' | 'Pediatría' | 'Dermatología' | 'Neurología' | 'Medicina General' | 'Oftalmología';

export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  image: string;
}

export interface TimeSlot {
  id: string;
  doctorId: string;
  date: string;
  time: string;
  isBooked: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  specialty: Specialty;
  slotId: string;
  date: string;
  time: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}
