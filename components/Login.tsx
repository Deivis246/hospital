
import React from 'react';
import { UserRole } from '../types.ts';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-indigo-600 p-10 text-center text-white">
          <h1 className="text-3xl font-bold">MediConnect</h1>
          <p className="mt-2 text-indigo-100">Portal Hospitalario</p>
        </div>
        <div className="p-10 space-y-4">
          <button onClick={() => onLogin(UserRole.PATIENT)} className="w-full flex items-center justify-between p-5 bg-white border-2 rounded-2xl hover:border-indigo-600 transition-all">
            <span className="font-bold text-slate-800">Acceso Paciente</span>
            <span className="text-indigo-600">→</span>
          </button>
          <button onClick={() => onLogin(UserRole.ADMIN)} className="w-full flex items-center justify-between p-5 bg-white border-2 rounded-2xl hover:border-indigo-600 transition-all">
            <span className="font-bold text-slate-800">Personal Hospital</span>
            <span className="text-indigo-600">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
