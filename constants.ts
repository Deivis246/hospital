import { Especialidad, Medico, Persona, Agenda, Jornada } from './types.ts';

export const ESPECIALIDADES: Especialidad[] = [
  { id: 1, nombre: 'Medicina General' },
  { id: 2, nombre: 'Cardiología' },
  { id: 3, nombre: 'Pediatría' },
  { id: 4, nombre: 'Dermatología' },
  { id: 5, nombre: 'Neurología' },
  { id: 6, nombre: 'Oftalmología' }
];

export const MOCK_MEDICOS: Medico[] = [
  { id: 'dr1', nombre: 'Dra. Sara Johnson', especialidad_id: 2, image: 'https://picsum.photos/seed/dr1/200/200', consultorio: 'Consultorio 101' },
  { id: 'dr2', nombre: 'Dr. Michael Chen', especialidad_id: 3, image: 'https://picsum.photos/seed/dr2/200/200', consultorio: 'Consultorio 102' },
  { id: 'dr3', nombre: 'Dra. Elena Rodriguez', especialidad_id: 4, image: 'https://picsum.photos/seed/dr3/200/200', consultorio: 'Consultorio 103' },
  { id: 'dr4', nombre: 'Dr. James Wilson', especialidad_id: 5, image: 'https://picsum.photos/seed/dr4/200/200', consultorio: 'Consultorio 104' },
  { id: 'dr5', nombre: 'Dra. Emily Brown', especialidad_id: 1, image: 'https://picsum.photos/seed/dr5/200/200', consultorio: 'Consultorio 105' },
  { id: 'dr6', nombre: 'Dr. David Lee', especialidad_id: 6, image: 'https://picsum.photos/seed/dr6/200/200', consultorio: 'Consultorio 106' },
  { id: 'dr7', nombre: 'Dra. Lisa Wang', especialidad_id: 2, image: 'https://picsum.photos/seed/dr7/200/200', consultorio: 'Consultorio 107' },
];

export const MOCK_PERSONAS: Persona[] = [
  { id: 'p1', nombre: 'Juan Pérez', cedula: '1700000001', fecha_nacimiento: '1990-05-20' },
  { id: 'p2', nombre: 'Admin User', cedula: 'admin', fecha_nacimiento: 'admin' }
];

export const MOCK_AGENDAS: Agenda[] = [
  { id: 'a1', medico_id: 'dr1', fecha_inicio: '2025-01-01', fecha_fin: '2026-12-31', duracion_cita: 30 },
  { id: 'a2', medico_id: 'dr2', fecha_inicio: '2025-01-01', fecha_fin: '2026-12-31', duracion_cita: 20 },
  { id: 'a3', medico_id: 'dr3', fecha_inicio: '2025-01-01', fecha_fin: '2026-12-31', duracion_cita: 45 },
  { id: 'a4', medico_id: 'dr4', fecha_inicio: '2025-01-01', fecha_fin: '2026-12-31', duracion_cita: 30 },
  { id: 'a5', medico_id: 'dr5', fecha_inicio: '2025-01-01', fecha_fin: '2026-12-31', duracion_cita: 15 },
  { id: 'a6', medico_id: 'dr6', fecha_inicio: '2025-01-01', fecha_fin: '2026-12-31', duracion_cita: 30 },
  { id: 'a7', medico_id: 'dr7', fecha_inicio: '2025-01-01', fecha_fin: '2026-12-31', duracion_cita: 20 },
];

export const MOCK_JORNADAS: Jornada[] = [
  // Dr 1 (Lunes a Viernes 08:00 - 12:00)
  { id: 'j1', agenda_id: 'a1', dia_semana: 0, hora_inicio: '08:00', hora_fin: '12:00' },
  { id: 'j2', agenda_id: 'a1', dia_semana: 1, hora_inicio: '08:00', hora_fin: '12:00' },
  { id: 'j3', agenda_id: 'a1', dia_semana: 2, hora_inicio: '08:00', hora_fin: '12:00' },
  { id: 'j4', agenda_id: 'a1', dia_semana: 3, hora_inicio: '08:00', hora_fin: '12:00' },
  { id: 'j5', agenda_id: 'a1', dia_semana: 4, hora_inicio: '08:00', hora_fin: '12:00' },
  // Dr 2 (Martes y Jueves 14:00 - 18:00)
  { id: 'j6', agenda_id: 'a2', dia_semana: 1, hora_inicio: '14:00', hora_fin: '18:00' },
  { id: 'j7', agenda_id: 'a2', dia_semana: 3, hora_inicio: '14:00', hora_fin: '18:00' },
  // Dr 3 (Lunes, Miercoles, Viernes 09:00 - 13:00)
  { id: 'j8', agenda_id: 'a3', dia_semana: 0, hora_inicio: '09:00', hora_fin: '13:00' },
  { id: 'j9', agenda_id: 'a3', dia_semana: 2, hora_inicio: '09:00', hora_fin: '13:00' },
  { id: 'j10', agenda_id: 'a3', dia_semana: 4, hora_inicio: '09:00', hora_fin: '13:00' },
  // Dr 4 (Martes, Jueves 10:00 - 14:00)
  { id: 'j11', agenda_id: 'a4', dia_semana: 1, hora_inicio: '10:00', hora_fin: '14:00' },
  { id: 'j12', agenda_id: 'a4', dia_semana: 3, hora_inicio: '10:00', hora_fin: '14:00' },
  // Dr 5 (Lunes a Viernes 14:00 - 18:00)
  { id: 'j13', agenda_id: 'a5', dia_semana: 0, hora_inicio: '14:00', hora_fin: '18:00' },
  { id: 'j14', agenda_id: 'a5', dia_semana: 1, hora_inicio: '14:00', hora_fin: '18:00' },
  { id: 'j15', agenda_id: 'a5', dia_semana: 2, hora_inicio: '14:00', hora_fin: '18:00' },
  { id: 'j16', agenda_id: 'a5', dia_semana: 3, hora_inicio: '14:00', hora_fin: '18:00' },
  { id: 'j17', agenda_id: 'a5', dia_semana: 4, hora_inicio: '14:00', hora_fin: '18:00' },
  // Dr 6 (Lunes, Martes, Miercoles 08:00 - 12:00)
  { id: 'j18', agenda_id: 'a6', dia_semana: 0, hora_inicio: '08:00', hora_fin: '12:00' },
  { id: 'j19', agenda_id: 'a6', dia_semana: 1, hora_inicio: '08:00', hora_fin: '12:00' },
  { id: 'j20', agenda_id: 'a6', dia_semana: 2, hora_inicio: '08:00', hora_fin: '12:00' },
  // Dr 7 (Jueves, Viernes 13:00 - 17:00)
  { id: 'j21', agenda_id: 'a7', dia_semana: 3, hora_inicio: '13:00', hora_fin: '17:00' },
  { id: 'j22', agenda_id: 'a7', dia_semana: 4, hora_inicio: '13:00', hora_fin: '17:00' },
];

export const SPECIALTY_EXAMS: Record<string, string[]> = {
  'Medicina General': ['Biometría hemática', 'Examen general de orina'],
  'Cardiología': ['Electrocardiograma', 'Prueba de esfuerzo', 'Ecocardiograma'],
  'Pediatría': ['Control de peso y talla', 'Esquema de vacunación'],
  'Dermatología': ['Prueba de alergia cutánea', 'Biopsia de piel (si aplica)'],
  'Neurología': ['Electroencefalograma', 'Resonancia magnética'],
  'Oftalmología': ['Examen de agudeza visual', 'Tonometría']
};
