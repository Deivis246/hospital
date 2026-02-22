import { query } from './_db';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ci, birthDate } = req.body || {};

  if (!ci || !birthDate) {
    return res.status(400).json({ error: 'Cédula y fecha de nacimiento son requeridas' });
  }

  try {
    // Search by CI first to be more flexible with date formats
    const results = await query<any[]>(
      'SELECT pers_id, pers_ci, pers_fech_naci, pers_nombres, pers_apellidos FROM persona WHERE pers_ci = ?',
      [ci]
    );

    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const person = results[0];
    
    // Normalize dates for comparison
    let dbBirthDate = '';
    if (person.pers_fech_naci) {
      const d = new Date(person.pers_fech_naci);
      if (!isNaN(d.getTime())) {
        dbBirthDate = d.toISOString().split('T')[0];
      }
    }

    if (dbBirthDate === birthDate) {
      return res.status(200).json({
        id: person.pers_id,
        nombre: `${person.pers_nombres} ${person.pers_apellidos}`,
        cedula: person.pers_ci,
        fecha_nacimiento: dbBirthDate,
        role: person.pers_ci === 'admin' ? 'ADMIN' : 'PATIENT'
      });
    } else {
      console.log('Date mismatch:', { input: birthDate, db: dbBirthDate });
      return res.status(401).json({ error: 'Fecha de nacimiento incorrecta' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor', 
      details: error.message,
      code: error.code
    });
  }
}
