
import React, { useState } from 'react';
import { Specialty, Doctor, TimeSlot, Appointment } from '../types.ts';
import { SPECIALTIES, MOCK_DOCTORS } from '../constants.ts';

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

  const filteredDoctors = MOCK_DOCTORS.filter(dr => dr.specialty === selectedSpecialty);
  const availableSlots = slots.filter(s => s.doctorId === selectedDoctorId && !s.isBooked);

  const hasAppointmentInSpecialty = selectedSpecialty ? appointments.some(app => app.specialty === selectedSpecialty) : false;

  const handleBooking = (slotId: string, doctorId: string) => {
    if (!selectedSpecialty) return;
    const success = onBook(slotId, doctorId, selectedSpecialty as Specialty);
    if (success) {
      setActiveTab('view');
      setSelectedSpecialty('');
      setSelectedDoctorId('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b border-slate-200">
        <button onClick={() => setActiveTab('view')} className={`pb-4 px-2 font-semibold ${activeTab === 'view' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}>Mis Citas</button>
        <button onClick={() => setActiveTab('book')} className={`pb-4 px-2 font-semibold ${activeTab === 'book' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400'}`}>Reservar</button>
      </div>

      {activeTab === 'view' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-400">No tienes citas.</div>
          ) : (
            appointments.map(app => (
              <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-200">
                <h4 className="font-bold text-slate-800">{MOCK_DOCTORS.find(d => d.id === app.doctorId)?.name}</h4>
                <p className="text-sm text-indigo-600">{app.specialty}</p>
                <div className="mt-4 text-sm text-slate-600">{app.date} a las {app.time}</div>
                <button onClick={() => onCancel(app.id)} className="mt-4 w-full py-2 text-red-500 bg-red-50 rounded-lg font-semibold">Cancelar</button>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'book' && (
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl border">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Nueva Cita</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="block text-sm font-semibold mb-3">1. Especialidad</label>
              <div className="space-y-2">
                {SPECIALTIES.map(s => (
                  <button key={s} onClick={() => { setSelectedSpecialty(s); setSelectedDoctorId(''); }} className={`w-full p-4 text-left rounded-xl border ${selectedSpecialty === s ? 'bg-indigo-600 text-white' : 'bg-white'}`}>{s}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3">2. Médico y Horario</label>
              {!selectedSpecialty ? (
                <div className="text-slate-400 text-sm">Selecciona una especialidad.</div>
              ) : hasAppointmentInSpecialty ? (
                <div className="text-amber-600 text-sm">Ya tienes una cita en esta especialidad.</div>
              ) : (
                <div className="space-y-4">
                  {filteredDoctors.map(dr => (
                    <div key={dr.id} className="space-y-2">
                      <button onClick={() => setSelectedDoctorId(dr.id)} className={`w-full p-3 border rounded-xl flex items-center gap-3 ${selectedDoctorId === dr.id ? 'border-indigo-600 bg-indigo-50' : ''}`}>
                        <img src={dr.image} className="w-8 h-8 rounded-full" />
                        <span className="text-sm font-medium">{dr.name}</span>
                      </button>
                      {selectedDoctorId === dr.id && (
                        <div className="pl-4 space-y-1">
                          {availableSlots.map(slot => (
                            <button key={slot.id} onClick={() => handleBooking(slot.id, slot.doctorId)} className="w-full p-2 text-xs bg-white border rounded hover:bg-indigo-600 hover:text-white transition-colors">{slot.date} - {slot.time}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
