
import React, { useState } from 'react';
import { Doctor, TimeSlot } from '../types';
import { MOCK_DOCTORS } from '../constants';

interface AdminDashboardProps {
  slots: TimeSlot[];
  onAddSlot: (slot: Omit<TimeSlot, 'id' | 'isBooked'>) => void;
  onDeleteSlot: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ slots, onAddSlot, onDeleteSlot }) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState(MOCK_DOCTORS[0].id);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    onAddSlot({ doctorId: selectedDoctorId, date, time });
    setTime('');
  };

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Panel de Control de Administrador</h2>
        <p className="text-slate-500">Gestiona la disponibilidad de los médicos y los horarios de la clínica.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulario para añadir espacios */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
          <h3 className="text-xl font-semibold mb-4 text-slate-700">Añadir Horario Disponible</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Seleccionar Médico</label>
              <select 
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              >
                {MOCK_DOCTORS.map(dr => (
                  <option key={dr.id} value={dr.id}>{dr.name} ({dr.specialty})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Fecha</label>
              <input 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Hora</label>
              <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-colors"
            >
              Añadir Turno
            </button>
          </form>
        </div>

        {/* Lista de Turnos */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold mb-4 text-slate-700">Agenda Actual</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="pb-3 font-semibold text-slate-600">Médico</th>
                  <th className="pb-3 font-semibold text-slate-600">Especialidad</th>
                  <th className="pb-3 font-semibold text-slate-600">Fecha/Hora</th>
                  <th className="pb-3 font-semibold text-slate-600">Estado</th>
                  <th className="pb-3 font-semibold text-slate-600 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {slots.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">No hay turnos disponibles. Añade uno para comenzar.</td>
                  </tr>
                ) : (
                  slots.map(slot => {
                    const dr = MOCK_DOCTORS.find(d => d.id === slot.doctorId);
                    return (
                      <tr key={slot.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 font-medium text-slate-800">{dr?.name}</td>
                        <td className="py-4 text-slate-600">{dr?.specialty}</td>
                        <td className="py-4 text-slate-600">
                          <span className="block font-medium">{slot.date}</span>
                          <span className="text-xs text-slate-400">{slot.time}</span>
                        </td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${slot.isBooked ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {slot.isBooked ? 'Reservado' : 'Disponible'}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => onDeleteSlot(slot.id)}
                            className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-30"
                            disabled={slot.isBooked}
                            title={slot.isBooked ? "No se puede eliminar un turno reservado" : "Eliminar turno"}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
