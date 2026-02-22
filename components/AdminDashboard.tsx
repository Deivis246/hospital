
import React, { useState } from 'react';
import { Medico } from '../types.ts';
import { MOCK_MEDICOS, ESPECIALIDADES } from '../constants.ts';

interface AdminDashboardProps {
  slots: any[];
  onAddSlot: (slot: any) => void;
  onDeleteSlot: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ slots, onAddSlot, onDeleteSlot }) => {
  const [selectedMedicoId, setSelectedMedicoId] = useState(MOCK_MEDICOS[0]?.id || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !selectedMedicoId) return;
    onAddSlot({ doctorId: selectedMedicoId, date, time });
    setTime('');
  };

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Panel de Control de Administrador</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
          <h3 className="text-xl font-semibold mb-4 text-slate-700">Añadir Horario</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Médico</label>
              <select 
                value={selectedMedicoId}
                onChange={(e) => setSelectedMedicoId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#0056b3] outline-none"
              >
                {MOCK_MEDICOS.map(dr => (
                  <option key={dr.id} value={dr.id}>{dr.nombre} ({ESPECIALIDADES.find(e => e.id === dr.especialidad_id)?.nombre})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Fecha</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2.5 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Hora</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-2.5 border rounded-lg" required />
            </div>
            <button type="submit" className="w-full py-3 bg-[#0056b3] text-white rounded-lg font-semibold">Añadir Turno</button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-xl font-semibold mb-4 text-slate-700">Agenda Actual</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-sm">
                <th className="pb-3 font-semibold">Médico</th>
                <th className="pb-3 font-semibold">Fecha/Hora</th>
                <th className="pb-3 font-semibold">Estado</th>
                <th className="pb-3 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {slots.map(slot => {
                const dr = MOCK_MEDICOS.find(d => d.id === slot.doctorId);
                return (
                  <tr key={slot.id}>
                    <td className="py-4 font-medium text-slate-800">{dr?.nombre}</td>
                    <td className="py-4 text-slate-600">{slot.date} {slot.time}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${slot.isBooked ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {slot.isBooked ? 'Reservado' : 'Disponible'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button onClick={() => onDeleteSlot(slot.id)} disabled={slot.isBooked} className="text-red-500 disabled:opacity-30">Eliminar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
