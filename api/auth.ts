import { query } from './_db';

export default async function handler(req, res) {
  console.log('🔐 Auth endpoint called');
  console.log('🔍 Method:', req.method);
  console.log('🔍 Headers:', req.headers);
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    console.log('🔍 OPTIONS request received');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('🔍 Request body:', req.body);
  const { ci, birthDate } = req.body || {};

  if (!ci || !birthDate) {
    console.log('❌ Missing required fields:', { ci: !!ci, birthDate: !!birthDate });
    return res.status(400).json({ error: 'Cédula y fecha de nacimiento son requeridas' });
  }

  try {
    console.log('🔍 Searching for user with CI:', ci);
    // Search by CI first to be more flexible with date formats
    const results = await query<any[]>(
      'SELECT pers_id, pers_ci, pers_fech_naci, pers_nombres, pers_apellidos FROM persona WHERE pers_ci = ?',
      [ci]
    );

    console.log('🔍 Query results:', results.length, 'users found');

    if (results.length === 0) {
      console.log('❌ User not found');
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const person = results[0];
    console.log('🔍 User found:', person.pers_nombres, person.pers_apellidos);
    
    // Normalize dates for comparison
    let dbBirthDate = '';
    if (person.pers_fech_naci) {
      const d = new Date(person.pers_fech_naci);
      if (!isNaN(d.getTime())) {
        dbBirthDate = d.toISOString().split('T')[0];
      }
    }

    console.log('🔍 Date comparison:', { input: birthDate, db: dbBirthDate, match: dbBirthDate === birthDate });

    if (dbBirthDate === birthDate) {
      const role = person.pers_ci === 'admin' ? 'ADMIN' : 'PATIENT';
      console.log('✅ Authentication successful, role:', role);
      
      return res.status(200).json({
        id: person.pers_id,
        nombre: `${person.pers_nombres} ${person.pers_apellidos}`,
        cedula: person.pers_ci,
        fecha_nacimiento: dbBirthDate,
        role: role
      });
    } else {
      console.log('❌ Date mismatch:', { input: birthDate, db: dbBirthDate });
      return res.status(401).json({ error: 'Fecha de nacimiento incorrecta' });
    }
  } catch (error) {
    console.error('❌ Auth error:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return res.status(500).json({ 
      error: 'Error interno del servidor', 
      details: error.message,
      code: error.code
    });
  }
}
