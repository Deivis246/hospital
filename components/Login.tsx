
import React from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-indigo-600 p-10 text-center text-white relative">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl font-bold">M</div>
          <h1 className="text-3xl font-bold">Bienvenido</h1>
          <p className="mt-2 text-indigo-100 font-medium">Accede a tu panel hospitalario</p>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
        </div>

        <div className="p-10 pt-14 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Identifícate</h2>
            
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => onLogin(UserRole.PATIENT)}
                className="group flex items-center justify-between p-5 bg-white border-2 border-slate-100 rounded-2xl hover:border-indigo-600 transition-all text-left shadow-sm hover:shadow-indigo-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Acceso Paciente</h3>
                    <p className="text-sm text-slate-500">Reserva citas y registros</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>

              <button 
                onClick={() => onLogin(UserRole.ADMIN)}
                className="group flex items-center justify-between p-5 bg-white border-2 border-slate-100 rounded-2xl hover:border-indigo-600 transition-all text-left shadow-sm hover:shadow-indigo-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Personal del Hospital</h3>
                    <p className="text-sm text-slate-500">Gestionar horarios médicos</p>
                  </div>
                </div>
                <svg className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-50">
            <p className="text-xs text-slate-400">Área de acceso restringido. Todas las actividades son monitoreadas.</p>
          </div>
        </div>
      </div>
      
      <p className="mt-8 text-sm text-slate-400 flex items-center gap-2">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        Sistemas Hospitalarios en Línea
      </p>
    </div>
  );
};

export default Login;
