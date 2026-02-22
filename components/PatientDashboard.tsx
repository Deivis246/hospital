
import React, { useState } from 'react';
import { Especialidad, Medico, Appointment } from '../types.ts';
import { ESPECIALIDADES, MOCK_MEDICOS, SPECIALTY_EXAMS } from '../constants.ts';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  isSameMonth, 
  addMonths, 
  subMonths,
  parseISO
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

interface PatientDashboardProps {
  slots: any[];
  appointments: Appointment[];
  onBook: (slotId: string, medico_id: string, especialidad_id: number) => boolean;
  onCancel: (appointmentId: string) => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ slots, appointments, onBook, onCancel }) => {
  const [activeTab, setActiveTab] = useState<'view' | 'book'>('view');
  const [selectedEspecialidadId, setSelectedEspecialidadId] = useState<number | null>(null);
  const [selectedMedicoId, setSelectedMedicoId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<any | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const filteredDoctors = MOCK_MEDICOS.filter(dr => dr.especialidad_id === selectedEspecialidadId);
  
  // Slots for the selected doctor
  const doctorSlots = slots.filter(s => s.doctorId === selectedMedicoId && !s.isBooked);
  
  // Days that have at least one slot for the selected doctor
  const availableDays = doctorSlots.map(s => parseISO(s.date));

  // Slots for the selected doctor and selected date
  const availableTimeSlots = doctorSlots.filter(s => 
    selectedDate && isSameDay(parseISO(s.date), selectedDate)
  );

  const hasAppointmentInSpecialty = selectedEspecialidadId ? appointments.some(app => app.especialidad_id === selectedEspecialidadId) : false;

  const handleBooking = () => {
    if (selectedEspecialidadId === null || !selectedSlot) return;
    const success = onBook(selectedSlot.id, selectedSlot.doctorId, selectedEspecialidadId);
    if (success) {
      setActiveTab('view');
      resetBooking();
    }
  };

  const resetBooking = () => {
    setSelectedEspecialidadId(null);
    setSelectedMedicoId('');
    setSelectedDate(null);
    setSelectedSlot(null);
    setShowConfirmation(false);
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const rows: React.ReactNode[] = [];
    let days: React.ReactNode[] = [];

    calendarDays.forEach((day, i) => {
      const isAvailable = availableDays.some(availableDay => isSameDay(day, availableDay));
      const isSelected = selectedDate && isSameDay(day, selectedDate);
      const isCurrentMonth = isSameMonth(day, monthStart);

      days.push(
        <button
          key={day.toString()}
          disabled={!isAvailable || !isCurrentMonth}
          onClick={() => { setSelectedDate(day); setSelectedSlot(null); }}
          className={`
            h-12 w-full flex flex-col items-center justify-center rounded-lg transition-all relative
            ${!isCurrentMonth ? 'text-gray-300 cursor-default' : ''}
            ${isAvailable && isCurrentMonth ? 'hover:bg-blue-50 text-gray-800 font-medium' : 'text-gray-400 cursor-not-allowed'}
            ${isSelected ? 'bg-[#0056b3] text-white hover:bg-[#004494] shadow-md z-10' : ''}
          `}
        >
          <span className="text-sm">{format(day, 'd')}</span>
          {isAvailable && isCurrentMonth && !isSelected && (
            <div className="absolute bottom-1.5 w-1 h-1 bg-[#0056b3] rounded-full"></div>
          )}
        </button>
      );

      if ((i + 1) % 7 === 0) {
        rows.push(
          <div className="grid grid-cols-7 gap-1" key={day.toString()}>
            {days}
          </div>
        );
        days = [];
      }
    });

    return (
      <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-gray-800 capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h4>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <button 
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
            <span key={d} className="text-xs font-bold text-gray-400 uppercase tracking-wider">{d}</span>
          ))}
        </div>
        
        <div className="space-y-1">
          {rows}
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-gray-500 border-t pt-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-[#0056b3] rounded-full"></div>
            <span>Días con turnos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
            <span>Sin disponibilidad</span>
          </div>
        </div>
      </div>
    );
  };

  const selectedMedico = MOCK_MEDICOS.find(d => d.id === selectedMedicoId);
  const selectedEspecialidad = ESPECIALIDADES.find(e => e.id === selectedEspecialidadId);

  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);

  const handleCancelClick = (app: Appointment) => {
    setAppointmentToCancel(app);
  };

  const confirmCancellation = () => {
    if (appointmentToCancel) {
      onCancel(appointmentToCancel.id);
      setAppointmentToCancel(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 border-b border-slate-200">
        <button onClick={() => setActiveTab('view')} className={`pb-4 px-2 font-semibold transition-all ${activeTab === 'view' ? 'text-[#0056b3] border-b-2 border-[#0056b3]' : 'text-slate-400 hover:text-slate-600'}`}>Mis Citas</button>
        <button onClick={() => { setActiveTab('book'); resetBooking(); }} className={`pb-4 px-2 font-semibold transition-all ${activeTab === 'book' ? 'text-[#0056b3] border-b-2 border-[#0056b3]' : 'text-slate-400 hover:text-slate-600'}`}>Reservar</button>
      </div>

      {activeTab === 'view' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.length === 0 ? (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <CalendarIcon size={48} className="text-gray-200 mb-4" />
              <p className="text-slate-400 font-medium">No tienes citas programadas.</p>
            </div>
          ) : (
            appointments.map(app => (
              <div key={app.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 text-lg">{MOCK_MEDICOS.find(d => d.id === app.medico_id)?.nombre}</h4>
                    <p className="text-sm font-semibold text-[#0056b3] uppercase tracking-wider">{ESPECIALIDADES.find(e => e.id === app.especialidad_id)?.nombre}</p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <User size={20} className="text-[#0056b3]" />
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex items-center gap-2 text-slate-600">
                    <CalendarIcon size={16} />
                    <span className="text-sm font-medium">{format(parseISO(app.date), "EEEE, d 'de' MMMM", { locale: es })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock size={16} />
                    <span className="text-sm font-medium">{app.time}</span>
                  </div>
                </div>
                <button onClick={() => handleCancelClick(app)} className="mt-6 w-full py-2.5 text-red-500 bg-red-50 hover:bg-red-100 rounded-xl font-bold transition-colors">Cancelar Cita</button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Cancellation Modal */}
      {appointmentToCancel && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-red-500 p-6 text-white text-center relative">
              <button 
                onClick={() => setAppointmentToCancel(null)}
                className="absolute right-4 top-4 p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold">¿Cancelar Cita?</h3>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-gray-600 text-center text-lg">
                ¿Está seguro de que desea cancelar su cita de <span className="font-bold text-red-600">{ESPECIALIDADES.find(e => e.id === appointmentToCancel.especialidad_id)?.nombre}</span>?
              </p>
              
              <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-500">
                Esta acción no se puede deshacer y el horario quedará disponible para otros pacientes.
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setAppointmentToCancel(null)}
                  className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  No, mantener
                </button>
                <button 
                  onClick={confirmCancellation}
                  className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg transition-all"
                >
                  Sí, cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'book' && (
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Step 1: Specialty */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">1. Especialidad</h3>
              <div className="grid grid-cols-1 gap-2">
                {ESPECIALIDADES.map(e => (
                  <button 
                    key={e.id} 
                    onClick={() => { setSelectedEspecialidadId(e.id); setSelectedMedicoId(''); setSelectedDate(null); setSelectedSlot(null); }} 
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all font-medium ${selectedEspecialidadId === e.id ? 'bg-[#0056b3] text-white border-[#0056b3] shadow-lg' : 'bg-white border-transparent hover:border-blue-100 hover:bg-blue-50 text-gray-700'}`}
                  >
                    {e.nombre}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Doctor */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">2. Médico</h3>
              {!selectedEspecialidadId ? (
                <div className="p-8 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 text-sm">Selecciona una especialidad primero.</p>
                </div>
              ) : hasAppointmentInSpecialty ? (
                <div className="p-8 text-center bg-amber-50 rounded-3xl border border-amber-100">
                  <p className="text-amber-700 text-sm font-medium">Ya tienes una cita programada en esta especialidad.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDoctors.map(dr => (
                    <button 
                      key={dr.id} 
                      onClick={() => { setSelectedMedicoId(dr.id); setSelectedDate(null); setSelectedSlot(null); }} 
                      className={`w-full p-4 border-2 rounded-2xl flex items-center gap-4 transition-all ${selectedMedicoId === dr.id ? 'border-[#0056b3] bg-blue-50 shadow-md' : 'bg-white border-transparent hover:border-blue-100 hover:bg-blue-50'}`}
                    >
                      <img src={dr.image} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                      <div className="text-left">
                        <p className="font-bold text-gray-800">{dr.nombre}</p>
                        <p className="text-xs text-gray-500">Disponible hoy</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 3: Calendar & Time */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">3. Fecha y Hora</h3>
              {!selectedMedicoId ? (
                <div className="p-8 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 text-sm">Selecciona un médico para ver su agenda.</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {renderCalendar()}
                  
                  {selectedDate && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-300">
                      <div className="flex items-center gap-2 text-gray-800 font-bold">
                        <Clock size={18} className="text-[#0056b3]" />
                        <span>Horarios para el {format(selectedDate, 'd MMMM', { locale: es })}</span>
                      </div>
                      
                      {availableTimeSlots.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">No hay horarios disponibles para este día.</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {availableTimeSlots.map(slot => (
                            <button 
                              key={slot.id} 
                              onClick={() => setSelectedSlot(slot)} 
                              className={`p-3 text-sm font-bold border rounded-xl transition-all ${selectedSlot?.id === slot.id ? 'bg-[#0056b3] text-white border-[#0056b3]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-200'}`}
                            >
                              {slot.time}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 4: Exams & Confirmation */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">4. Preparación</h3>
              {!selectedSlot ? (
                <div className="p-8 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <p className="text-gray-400 text-sm">Selecciona un horario para ver los requisitos.</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-gray-800 font-bold">
                      <AlertCircle size={18} className="text-amber-500" />
                      <span>Exámenes Requeridos</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Para su cita de <span className="font-bold text-[#0056b3]">{selectedEspecialidad?.nombre}</span>, debe realizarse los siguientes exámenes previos:
                    </p>
                    <ul className="space-y-2">
                      {selectedEspecialidad && SPECIALTY_EXAMS[selectedEspecialidad.nombre].map((exam, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                          <span>{exam}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2">
                      <Info size={16} className="text-[#0056b3] mt-0.5 shrink-0" />
                      <p className="text-xs text-blue-800">
                        Por favor, traiga los resultados impresos el día de su cita.
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => setShowConfirmation(true)}
                      className="w-full py-4 bg-[#0056b3] hover:bg-[#004494] text-white rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Aceptar y Continuar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && selectedSlot && selectedMedico && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-[#0056b3] p-6 text-white text-center relative">
              <button 
                onClick={() => setShowConfirmation(false)}
                className="absolute right-4 top-4 p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CalendarIcon size={32} />
              </div>
              <h3 className="text-2xl font-bold">Confirmar Cita</h3>
            </div>
            <div className="p-8 space-y-6">
              <p className="text-gray-600 text-center text-lg">
                ¿Desea confirmar su cita médica con los siguientes detalles?
              </p>
              
              <div className="bg-gray-50 p-6 rounded-2xl space-y-4 border border-gray-100">
                <div className="flex items-center gap-4">
                  <img src={selectedMedico.image} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                  <div>
                    <p className="font-bold text-gray-800">{selectedMedico.nombre}</p>
                    <p className="text-sm font-semibold text-[#0056b3] uppercase tracking-wider">{selectedEspecialidad?.nombre}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Fecha</p>
                    <p className="font-bold text-gray-800">{format(parseISO(selectedSlot.date), 'd MMM, yyyy', { locale: es })}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Hora</p>
                    <p className="font-bold text-gray-800">{selectedSlot.time}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleBooking}
                  className="flex-1 py-4 bg-[#0056b3] hover:bg-[#004494] text-white rounded-xl font-bold shadow-lg transition-all"
                >
                  Confirmar Cita
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
