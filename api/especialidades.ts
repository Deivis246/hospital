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
    const especialidades = await query('SELECT espe_id as id, espe_nombre as nombre FROM especialidad ORDER BY espe_nombre ASC');
    return res.status(200).json(especialidades);
  } catch (error) {
    console.error('Error fetching especialidades:', error);
    return res.status(500).json({ 
      error: 'Error al obtener especialidades', 
      details: error.message,
      code: error.code 
    });
  }
}
