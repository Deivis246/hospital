
import React, { useState, useEffect } from 'react';
import { UserRole, TimeSlot, Appointment, Specialty } from './types';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import PatientDashboard from './components/PatientDashboard';

const App: React.FC = () => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Inicializar algunos turnos de prueba
  useEffect(() => {
    const initialSlots: TimeSlot[] = [
      { id: 's1', doctorId: 'dr1', date: '2025-05-20', time: '09:00 AM', isBooked: false },
      { id: 's2', doctorId: 'dr1', date: '2025-05-20', time: '10:30 AM', isBooked: false },
      { id: 's3', doctorId: 'dr2', date: '2025-05-21', time: '02:00 PM', isBooked: false },
      { id: 's4', doctorId: 'dr3', date: '2025-05-22', time: '11:15 AM', isBooked: false },
      { id: 's5', doctorId: 'dr5', date: '2025-05-23', time: '08:45 AM', isBooked: false },
    ];
    setSlots(initialSlots);
  }, []);

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
  };

  const handleLogout = () => {
    setRole(null);
  };

  const addSlot = (slot: Omit<TimeSlot, 'id' | 'isBooked'>) => {
    const newSlot: TimeSlot = {
      ...slot,
      id: Math.random().toString(36).substr(2, 9),
      isBooked: false
    };
    setSlots(prev => [...prev, newSlot]);
  };

  const deleteSlot = (id: string) => {
    setSlots(prev => prev.filter(s => s.id !== id));
  };

  const bookAppointment = (slotId: string, doctorId: string, specialty: Specialty): boolean => {
    // Validación estricta: Solo una cita por especialidad
    const alreadyHasOne = appointments.some(app => app.specialty === specialty);
    
    if (alreadyHasOne) {
      alert(`Lo sentimos, ya tienes una cita programada en la especialidad de ${specialty}. Solo se permite una cita activa por especialidad.`);
      return false;
    }

    const slot = slots.find(s => s.id === slotId);
    if (!slot) {
      alert("El horario seleccionado ya no está disponible.");
      return false;
    }

    const newAppointment: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: 'patient1',
      doctorId,
      specialty,
      slotId,
      date: slot.date,
      time: slot.time
    };

    setAppointments(prev => [...prev, newAppointment]);
    setSlots(prev => prev.map(s => s.id === slotId ? { ...s, isBooked: true } : s));
    
    alert('¡Cita reservada con éxito! Podrás ver los detalles en tu lista de citas.');
    return true;
  };

  const cancelAppointment = (appointmentId: string) => {
    const appointment = appointments.find(app => app.id === appointmentId);
    if (!appointment) return;

    if (confirm('¿Estás seguro de que deseas cancelar esta cita? El horario volverá a estar disponible para otros pacientes.')) {
      setAppointments(prev => prev.filter(app => app.id !== appointmentId));
      setSlots(prev => prev.map(s => s.id === appointment.slotId ? { ...s, isBooked: false } : s));
    }
  };

  return (
    <div className="min-h-screen">
      {!role ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="flex flex-col min-h-screen">
          {/* Navegación */}
          <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
                  <span className="text-xl font-bold text-slate-800 tracking-tight">MediConnect</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-slate-800">
                      {role === UserRole.ADMIN ? 'Administrador del Sistema' : 'Usuario Paciente'}
                    </p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">{role}</p>
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

          <footer className="bg-white border-t border-slate-200 py-6">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-sm text-slate-400">© 2025 Sistema de Gestión Hospitalaria MediConnect. Todos los derechos reservados.</p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default App;
