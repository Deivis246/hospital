import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const especialidades = await query('SELECT espe_id as id, espe_nombre as nombre FROM especialidad ORDER BY espe_nombre ASC');
    return res.status(200).json(especialidades);
  } catch (error: any) {
    console.error('Error fetching especialidades:', error);
    return res.status(500).json({ 
      error: 'Error al obtener especialidades', 
      details: error.message,
      code: error.code 
    });
  }
}
