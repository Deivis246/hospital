
import React, { useState, useEffect } from 'react';
import { UserRole, Appointment, Especialidad, Medico, Agenda, Jornada } from './types.ts';
import Login from './components/Login.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import PatientDashboard from './components/PatientDashboard.tsx';
import { MOCK_AGENDAS, MOCK_JORNADAS } from './constants.ts';

// Helper to generate slots from Agenda and Jornada
const generateSlotsFromSchedule = (agendas: Agenda[], jornadas: Jornada[]) => {
  const slots: any[] = [];
  
  agendas.forEach(agenda => {
    const doctorJornadas = jornadas.filter(j => j.agenda_id === agenda.id);
    const startDate = new Date(agenda.fecha_inicio);
    const endDate = new Date(agenda.fecha_fin);
    
    // Generate for next 30 days for demo purposes
    const demoEndDate = new Date();
    demoEndDate.setDate(demoEndDate.getDate() + 30);
    
    let current = new Date();
    if (current < startDate) current = new Date(startDate);
    
    while (current <= endDate && current <= demoEndDate) {
      const dayOfWeek = (current.getDay() + 6) % 7; // Map 0-6 (Sun-Sat) to 0-6 (Mon-Sun)
      const dayJornadas = doctorJornadas.filter(j => j.dia_semana === dayOfWeek);
      
      dayJornadas.forEach(jornada => {
        const [startH, startM] = jornada.hora_inicio.split(':').map(Number);
        const [endH, endM] = jornada.hora_fin.split(':').map(Number);
        
        let slotTime = new Date(current);
        slotTime.setHours(startH, startM, 0, 0);
        
        const endTime = new Date(current);
        endTime.setHours(endH, endM, 0, 0);
        
        while (slotTime < endTime) {
          slots.push({
            id: `${agenda.medico_id}-${slotTime.getTime()}`,
            doctorId: agenda.medico_id,
            date: slotTime.toISOString().split('T')[0],
            time: slotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
            isBooked: false
          });
          slotTime.setMinutes(slotTime.getMinutes() + agenda.duracion_cita);
        }
      });
      
      current.setDate(current.getDate() + 1);
    }
  });
  
  return slots;
};

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const initialSlots = generateSlotsFromSchedule(MOCK_AGENDAS, MOCK_JORNADAS);
    setSlots(initialSlots);
  }, []);

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
  };

  const handleLogout = () => {
    setRole(null);
  };

  const addSlot = (slot: any) => {
    // En el nuevo esquema, esto implicaría añadir a Agenda/Jornada
    // Por ahora lo mantenemos simple para la UI
    const newSlot = {
      ...slot,
      id: Math.random().toString(36).substr(2, 9),
      isBooked: false
    };
    setSlots(prev => [...prev, newSlot]);
  };

  const deleteSlot = (id: string) => {
    setSlots(prev => prev.filter(s => s.id !== id));
  };

  const bookAppointment = (slotId: string, medico_id: string, especialidad_id: number): boolean => {
    const alreadyHasOne = appointments.some(app => app.especialidad_id === especialidad_id);
    
    if (alreadyHasOne) {
      alert(`Lo sentimos, ya tienes una cita programada en esta especialidad.`);
      return false;
    }

    const slot = slots.find(s => s.id === slotId);
    if (!slot) return false;

    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: 'p1',
      medico_id,
      especialidad_id,
      date: slot.date,
      time: slot.time
    };

    setAppointments(prev => [...prev, newAppointment]);
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, isBooked: true } : s));
    
    alert('¡Cita reservada con éxito!');
    return true;
  };

  const cancelAppointment = (appointmentId: string) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (!appointment) {
      console.error('Appointment not found:', appointmentId);
      return;
    }

    setAppointments(prev => prev.filter(app => app.id !== appointmentId));
    // Encontrar el slot correspondiente para liberarlo
    setSlots(prev => prev.map(s => (s.date === appointment.date && s.time === appointment.time && s.doctorId === appointment.medico_id) ? { ...s, isBooked: false } : s));
  };

  return (
    <div className="min-h-screen">
      {!role ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="flex flex-col min-h-screen">
          <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#0056b3] rounded-lg flex items-center justify-center text-white font-bold">H</div>
                  <span className="text-xl font-bold text-slate-800 tracking-tight">HGDC</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-slate-800">
                      {role === UserRole.ADMIN ? 'Administrador' : 'Paciente'}
                    </p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            </div>
          </nav>

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {role === UserRole.ADMIN ? (
              <AdminDashboard 
                slots={slots} 
                onAddSlot={addSlot} 
                onDeleteSlot={deleteSlot} 
              />
            ) : (
              <PatientDashboard 
                slots={slots} 
                appointments={appointments}
                onBook={bookAppointment}
                onCancel={cancelAppointment}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
