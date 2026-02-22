import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const personas = await query('SELECT pers_id as id, pers_ci as cedula, pers_nombres as nombres, pers_apellidos as apellidos, pers_fech_naci as fecha_nacimiento FROM persona LIMIT 50');
    return res.status(200).json(personas);
  } catch (error: any) {
    console.error('Error fetching personas:', error);
    return res.status(500).json({ error: error.message });
  }
}
