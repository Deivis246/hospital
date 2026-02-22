
import React, { useState, useEffect } from 'react';
import { UserRole, Appointment, Especialidad, Medico, Agenda, Jornada } from './types.ts';
import Login from './components/Login.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import PatientDashboard from './components/PatientDashboard.tsx';
import { MOCK_AGENDAS, MOCK_JORNADAS } from './constants.ts';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [slots, setSlots] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (userData: any) => {
    setCurrentUser(userData);
    setRole(userData.role as UserRole);
  };

  const handleLogout = () => {
    setRole(null);
    setCurrentUser(null);
    setSlots([]);
  };

  const fetchSlotsForDoctor = async (medico_id: string) => {
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const doctorAgendas = MOCK_AGENDAS.filter(a => a.medico_id === medico_id);
      
      const generatedSlots: any[] = [];
      
      // Calculate start date (30 days from today)
      const today = new Date();
      const minDate = new Date(today);
      minDate.setDate(today.getDate() + 30);
      minDate.setHours(0, 0, 0, 0);

      // Calculate max date (e.g., 60 days from minDate)
      const maxDate = new Date(minDate);
      maxDate.setDate(minDate.getDate() + 60);

      doctorAgendas.forEach((agenda) => {
        const startDate = new Date(agenda.fecha_inicio);
        const endDate = new Date(agenda.fecha_fin);
        
        let current = new Date(minDate);
        if (current < startDate) current = new Date(startDate);
        
        // Ensure we don't go beyond the agenda end date or our max display date
        const effectiveEndDate = endDate < maxDate ? endDate : maxDate;
        
        while (current <= effectiveEndDate) {
          const dayOfWeek = (current.getDay() + 6) % 7; 
          
          const dayJornadas = MOCK_JORNADAS.filter(j => j.agenda_id === agenda.id && j.dia_semana === dayOfWeek);
          
          dayJornadas.forEach((jornada) => {
            const [startH, startM] = jornada.hora_inicio.split(':').map(Number);
            const [endH, endM] = jornada.hora_fin.split(':').map(Number);
            
            let slotTime = new Date(current);
            slotTime.setHours(startH, startM, 0, 0);
            
            const endTime = new Date(current);
            endTime.setHours(endH, endM, 0, 0);
            
            while (slotTime < endTime) {
              generatedSlots.push({
                id: `${medico_id}-${slotTime.getTime()}`,
                doctorId: medico_id,
                date: slotTime.toISOString().split('T')[0],
                time: slotTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
                isBooked: false
              });
              slotTime.setMinutes(slotTime.getMinutes() + agenda.duracion_cita);
            }
          });
          current.setDate(current.getDate() + 1);
        }
      });
      setSlots(generatedSlots);
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSlot = (slot: any) => {
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

  const parseTimeMinutes = (timeStr: string): number => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (hours === 12) hours = 0;
    if (modifier === 'PM') hours += 12;
    return hours * 60 + minutes;
  };

  const bookAppointment = (slotId: string, medico_id: string, especialidad_id: number): { success: boolean; message?: string } => {
    const currentUserId = currentUser?.id || 'p1';
    
    // 1. Check same specialty
    const alreadyHasOne = appointments.some(app => 
      app.patientId === currentUserId && 
      app.especialidad_id === especialidad_id
    );
    
    if (alreadyHasOne) {
      return { success: false, message: 'Lo sentimos, ya tienes una cita programada en esta especialidad.' };
    }

    const slot = slots.find(s => s.id === slotId);
    if (!slot) return { success: false, message: 'Horario no encontrado.' };

    // 2. Check time conflict (2 hours gap)
    const slotMinutes = parseTimeMinutes(slot.time);
    const hasTimeConflict = appointments.some(app => {
      if (app.patientId !== currentUserId) return false;
      if (app.date !== slot.date) return false;

      const appMinutes = parseTimeMinutes(app.time);
      const diff = Math.abs(slotMinutes - appMinutes);
      return diff < 120; // Less than 120 minutes (2 hours)
    });

    if (hasTimeConflict) {
      return { 
        success: false, 
        message: 'No se puede agendar la cita.\n\nDebe existir un intervalo de al menos 2 horas antes o después de su cita existente para evitar conflictos de horario.' 
      };
    }

    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: currentUserId,
      medico_id,
      especialidad_id,
      date: slot.date,
      time: slot.time,
      bookingDate: new Date().toISOString() // Add booking date
    };

    setAppointments(prev => [...prev, newAppointment]);
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, isBooked: true } : s));
    
    return { success: true };
  };

  const cancelAppointment = (appointmentId: string) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (!appointment) return;

    setAppointments(prev => prev.filter(app => app.id !== appointmentId));
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
                      {currentUser?.nombre || (role === UserRole.ADMIN ? 'Administrador' : 'Paciente')}
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
                onDoctorSelect={fetchSlotsForDoctor}
                loading={loading}
                currentUser={currentUser}
              />
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
