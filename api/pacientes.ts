import { query } from './_db';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const personas = await query('SELECT pers_id as id, pers_ci as cedula, pers_nombres as nombres, pers_apellidos as apellidos, pers_fech_naci as fecha_nacimiento FROM persona LIMIT 50');
    return res.status(200).json(personas);
  } catch (error) {
    console.error('Error fetching personas:', error);
    return res.status(500).json({ error: error.message });
  }
}
