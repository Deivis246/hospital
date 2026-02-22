
export enum UserRole {
  PATIENT = 'PACIENTE',
  ADMIN = 'ADMINISTRADOR'
}

export interface Especialidad {
  id: number;
  nombre: string;
}

export interface Medico {
  id: string;
  nombre: string;
  especialidad_id: number;
  image?: string; // Mantener para UI
}

export interface Persona {
  id: string;
  nombre: string;
  cedula: string;
  fecha_nacimiento: string;
}

export interface Agenda {
  id: string;
  medico_id: string;
  fecha_inicio: string;
  fecha_fin: string;
  duracion_cita: number; // en minutos
}

export interface Jornada {
  id: string;
  agenda_id: string;
  dia_semana: number; // 0 (Lunes) a 6 (Domingo)
  hora_inicio: string;
  hora_fin: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  medico_id: string;
  especialidad_id: number;
  date: string;
  time: string;
  // Estos campos se derivan para la UI pero se guardan así
}

export interface User {
  id: string;
  nombre: string;
  role: UserRole;
}
