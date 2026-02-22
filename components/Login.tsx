
import React, { useState } from 'react';
import { UserRole } from '../types.ts';
import { Hospital } from 'lucide-react';
import { MOCK_PERSONAS } from '../constants.ts';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [idNumber, setIdNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [error, setError] = useState('');

  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const person = MOCK_PERSONAS.find(p => p.cedula === idNumber && p.fecha_nacimiento === birthDate);
    
    if (person) {
      if (idNumber === 'admin') {
        onLogin(UserRole.ADMIN);
      } else {
        onLogin(UserRole.PATIENT);
      }
    } else {
      setError('Credenciales incorrectas. Intente con el ejemplo de la nota.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col font-sans">
      {/* Header Bar */}
      <header className="w-full bg-white border-b border-gray-200 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#0056b3] p-2 rounded-lg text-white">
            <Hospital size={24} />
          </div>
          <h2 className="text-xl font-bold text-[#0056b3] hidden sm:block">
            Hospital General Docente de Calderón
          </h2>
          <h2 className="text-lg font-bold text-[#0056b3] sm:hidden">
            HGDC
          </h2>
        </div>
        <div className="flex items-center">
          <img 
            src="https://bioproec.com/wp-content/uploads/2021/07/HOSPITAL-GENERAL-DOCENTE-DE-CALDERON.jpg" 
            alt="Logo HGDC" 
            className="h-12 w-auto object-contain rounded"
            referrerPolicy="no-referrer"
          />
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[450px] bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-[#0056b3] py-8 px-6 text-center text-white">
            <h1 className="text-3xl font-bold tracking-tight">Sistema de Citas</h1>
            <p className="mt-2 text-blue-100 text-lg">Hospital General Docente de Calderón</p>
          </div>
          
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">Iniciar Sesión</h2>
            
            <form onSubmit={handlePatientLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cédula de Identidad</label>
                <input 
                  type="text" 
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="Ingrese su cédula"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                <input 
                  type="date" 
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              
              <button 
                type="submit" 
                className="w-full py-3.5 bg-[#0056b3] hover:bg-[#004494] text-white rounded-lg font-bold text-lg shadow-md transition-colors"
              >
                Ingresar al Sistema
              </button>
            </form>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800 leading-relaxed">
                <span className="font-bold">Nota:</span> Solo usuarios registrados en el sistema. 
                <br />
                <span className="italic">Ejemplo válido: Cédula 1700000001 con fecha 1990-05-20</span>
              </p>
            </div>

            <div className="mt-6 text-center">
              <button 
                onClick={() => onLogin(UserRole.ADMIN)}
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                Acceso Personal Hospitalario
              </button>
            </div>
          </div>
        </div>
        
        <footer className="mt-8 text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Hospital General Docente de Calderón - Todos los derechos reservados
        </footer>
      </div>
    </div>
  );
};

export default Login;
