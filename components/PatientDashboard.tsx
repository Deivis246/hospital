
import React, { useState } from 'react';
import { Specialty, Doctor, TimeSlot, Appointment } from '../types';
import { SPECIALTIES, MOCK_DOCTORS } from '../constants';
import { getSpecialtyRecommendation } from '../services/geminiService';

interface PatientDashboardProps {
  slots: TimeSlot[];
  appointments: Appointment[];
  onBook: (slotId: string, doctorId: string, specialty: Specialty) => boolean;
  onCancel: (appointmentId: string) => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ slots, appointments, onBook, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'view' | 'book'>('view');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | ''>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [symptoms, setSymptoms] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<{ specialty: Specialty, reason: string } | null>(null);

  const filteredDoctors = MOCK_DOCTORS.filter(dr => dr.specialty === selectedSpecialty);
  const availableSlots = slots.filter(s => s.doctorId === selectedDoctorId && !s.isBooked);

  const hasAppointmentInSpecialty = selectedSpecialty ? appointments.some(app => app.specialty === selectedSpecialty) : false;

  const handleAiRecommend = async () => {
    if (!symptoms.trim()) return;
    setAiLoading(true);
    const rec = await getSpecialtyRecommendation(symptoms);
    setAiAdvice(rec);
    setSelectedSpecialty(rec.specialty);
    setSelectedDoctorId(''); // Reset doctor when specialty changes via AI
    setAiLoading(false);
  };

  const handleBooking = (slotId: string, doctorId: string) => {
    if (!selectedSpecialty) return;
    
    const success = onBook(slotId, doctorId, selectedSpecialty as Specialty);
    if (success) {
      // Regresar a la vista de "Mis Citas" automáticamente
      setActiveTab('view');
      // Resetear selecciones para la próxima vez
      setSelectedSpecialty('');
      setSelectedDoctorId('');
      setAiAdvice(null);
      setSymptoms('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('view')}
          className={`pb-4 px-2 font-semibold transition-all ${activeTab === 'view' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Mis Citas
        </button>
        <button 
          onClick={() => setActiveTab('book')}
          className={`pb-4 px-2 font-semibold transition-all ${activeTab === 'book' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          Reservar Nueva Cita
        </button>
      </div>

      {activeTab === 'view' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
              <p className="text-lg">No tienes citas programadas aún.</p>
              <button onClick={() => setActiveTab('book')} className="mt-4 text-indigo-600 font-medium hover:underline">Reserva tu primera cita ahora</button>
            </div>
          ) : (
            appointments.map(app => {
              const dr = MOCK_DOCTORS.find(d => d.id === app.doctorId);
              return (
                <div key={app.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider px-2 py-1 rounded">
                      {app.specialty}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <img src={dr?.image} alt={dr?.name} className="w-16 h-16 rounded-full object-cover" />
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{dr?.name}</h4>
                      <p className="text-slate-500 text-sm">Especialista del Paciente</p>
                    </div>
                  </div>
                  <div className="space-y-2 border-t border-slate-50 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Fecha</span>
                      <span className="font-medium text-slate-700">{app.date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Hora</span>
                      <span className="font-medium text-slate-700">{app.time}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onCancel(app.id)}
                    className="mt-6 w-full py-2 text-red-500 bg-red-50 hover:bg-red-100 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Cancelar Cita
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'book' && (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Programar una Visita</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              {/* Sección de ayuda de IA */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-indigo-100">
                <h4 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                  <span className="text-xl">✨</span> Asesor de Especialidades IA
                </h4>
                <p className="text-xs text-indigo-700 mb-3">Describe tus síntomas para obtener una recomendación.</p>
                <textarea 
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="ej. Siento opresión en el pecho después de subir escaleras..."
                  className="w-full p-3 text-sm rounded-xl border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none h-24 mb-3"
                />
                <button 
                  onClick={handleAiRecommend}
                  disabled={aiLoading}
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md"
                >
                  {aiLoading ? 'Analizando...' : 'Obtener Recomendación'}
                </button>
                {aiAdvice && (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-indigo-100 animate-fade-in">
                    <p className="text-xs font-bold text-indigo-600">Recomendado: {aiAdvice.specialty}</p>
                    <p className="text-[11px] text-slate-600 mt-1">{aiAdvice.reason}</p>
                  </div>
                )}
              </div>

              {/* Selección de Especialidad */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">1. Seleccionar Especialidad</label>
                <div className="grid grid-cols-2 gap-2">
                  {SPECIALTIES.map(s => (
                    <button
                      key={s}
                      onClick={() => { setSelectedSpecialty(s); setSelectedDoctorId(''); }}
                      className={`p-3 text-sm rounded-xl border transition-all text-left ${selectedSpecialty === s ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Selección de Médico */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">2. Elegir Médico</label>
                {!selectedSpecialty ? (
                  <div className="py-4 text-center text-slate-400 text-sm italic">Por favor selecciona una especialidad primero</div>
                ) : hasAppointmentInSpecialty ? (
                  <div className="p-4 bg-amber-50 text-amber-800 rounded-xl text-xs border border-amber-200 animate-pulse">
                    ⚠️ Ya tienes una cita activa en <strong>{selectedSpecialty}</strong>. Para agendar una nueva en esta especialidad, primero debes cancelar la anterior.
                  </div>
                ) : filteredDoctors.length === 0 ? (
                  <div className="py-4 text-center text-slate-400 text-sm italic">No se encontraron médicos para esta especialidad</div>
                ) : (
                  <div className="space-y-2">
                    {filteredDoctors.map(dr => (
                      <button
                        key={dr.id}
                        onClick={() => setSelectedDoctorId(dr.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedDoctorId === dr.id ? 'bg-indigo-50 border-indigo-600' : 'bg-white border-slate-100 hover:border-indigo-200'}`}
                      >
                        <img src={dr.image} className="w-10 h-10 rounded-full border border-slate-200" alt={dr.name} />
                        <span className="text-sm font-medium text-slate-800">{dr.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selección de Horario */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">3. Elegir Horario</label>
                {!selectedDoctorId ? (
                  <div className="py-4 text-center text-slate-400 text-sm italic">Selecciona un médico para ver su disponibilidad</div>
                ) : availableSlots.length === 0 ? (
                  <div className="py-4 text-center text-slate-400 text-sm italic">No hay turnos disponibles actualmente para este médico</div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {availableSlots.map(slot => (
                      <button
                        key={slot.id}
                        onClick={() => handleBooking(slot.id, slot.doctorId)}
                        className="p-4 bg-white border border-slate-200 rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all text-left shadow-sm group"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="block font-bold group-hover:text-white">{slot.date}</span>
                            <span className="text-xs group-hover:text-white opacity-80">{slot.time}</span>
                          </div>
                          <span className="text-xs font-semibold px-2 py-1 bg-slate-100 group-hover:bg-white/20 rounded">Disponible</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
