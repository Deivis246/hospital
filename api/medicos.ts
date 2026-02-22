import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { espe_id } = req.query;

  try {
    let sql = 'SELECT medi_id as id, medi_nombre as nombre, espe_id as especialidad_id FROM medico';
    const params: any[] = [];

    if (espe_id) {
      sql += ' WHERE espe_id = ?';
      params.push(espe_id);
    }

    const medicos = await query(sql, params);
    return res.status(200).json(medicos);
  } catch (error: any) {
    console.error('Error fetching medicos:', error);
    return res.status(500).json({ 
      error: 'Error al obtener médicos', 
      details: error.message,
      code: error.code 
    });
  }
}
