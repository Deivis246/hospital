import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ci, birthDate } = req.body;

  if (!ci || !birthDate) {
    return res.status(400).json({ error: 'CI and birthDate are required' });
  }

  try {
    const results = await query<any[]>(
      'SELECT pers_id, pers_ci, pers_fech_naci, pers_nombres, pers_apellidos FROM persona WHERE pers_ci = ? AND pers_fech_naci = ?',
      [ci, birthDate]
    );

    if (results.length > 0) {
      const person = results[0];
      return res.status(200).json({
        id: person.pers_id,
        nombre: `${person.pers_nombres} ${person.pers_apellidos}`,
        cedula: person.pers_ci,
        fecha_nacimiento: person.pers_fech_naci,
        role: person.pers_ci === 'admin' ? 'ADMIN' : 'PATIENT'
      });
    } else {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  } catch (error: any) {
    console.error('Auth error:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor', 
      details: error.message,
      code: error.code
    });
  }
}
