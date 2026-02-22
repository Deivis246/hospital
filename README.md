<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Portal Hospitalario HGDC

Sistema de citas médicas en línea para el Hospital General Docente de Calderón.

## 🚀 Despliegue en Vercel

Este proyecto está configurado para funcionar en **Vercel** con serverless functions.

### Variables de Entorno

Configura estas variables en tu dashboard de Vercel:

```
DATABASE_URL=mysql://zEc6ssgtcsBqAfJ.root:vmuf2WLzLFAimWe0@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test
```

### Características

- ✅ **Serverless Functions** - APIs en `/api/`
- ✅ **Base de Datos MySQL** - TiDB Cloud
- ✅ **Frontend React** - Vite + TypeScript
- ✅ **Responsive Design** - TailwindCSS
- ✅ **Sin Gemini API** - Optimizado para producción

## 🛠️ Tecnologías

- **Frontend**: React 19, TypeScript, TailwindCSS
- **Backend**: Node.js serverless functions
- **Database**: MySQL (TiDB Cloud)
- **Deployment**: Vercel

## 📋 Instalación Local

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/Deivis246/hospital.git
   cd hospital
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env
   # Editar .env con tu DATABASE_URL
   ```

4. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

## 🔐 Credenciales de Prueba

- **Paciente**: CI `1700000001`, Fecha `1990-05-20`
- **Admin**: CI `admin`, Fecha `admin`

## 📁 Estructura del Proyecto

```
hospital/
├── components/          # Componentes React
├── api/                # Serverless functions
├── types.ts            # Tipos TypeScript
├── constants.ts        # Datos mock
├── App.tsx             # Componente principal
├── package.json        # Dependencias
├── vercel.json         # Configuración Vercel
└── README.md           # Este archivo
```

## 🌐 API Endpoints

- `GET /api/especialidades` - Lista especialidades
- `GET /api/medicos` - Lista médicos (por especialidad)
- `POST /api/auth` - Autenticación
- `GET /api/agenda` - Agenda médica
- `GET /api/pacientes` - Lista pacientes

## 🚀 Deploy Automático

El proyecto está conectado a Vercel con **deploy automático**. Cada push a `main` activará un nuevo deploy.

## 📄 Licencia

© {new Date().getFullYear()} Hospital General Docente de Calderón - Todos los derechos reservados
