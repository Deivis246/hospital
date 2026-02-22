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

  const { espe_id } = req.query;

  try {
    // Usando la tabla medico que existe en la base de datos
    let sql = `
      SELECT m.medi_id as id, 
             m.medi_nombre as nombre, 
             m.espe_id as especialidad_id,
             p.pers_ci as cedula
      FROM medico m
      LEFT JOIN persona p ON m.pers_id = p.pers_id
    `;
    const params = [];

    if (espe_id) {
      sql += ` WHERE m.espe_id = ?`;
      params.push(espe_id);
    }

    sql += ' ORDER BY m.medi_nombre ASC';

    const medicos = await query(sql, params);
    return res.status(200).json(medicos);
  } catch (error) {
    console.error('Error fetching medicos:', error);
    return res.status(500).json({ 
      error: 'Error al obtener médicos', 
      details: error.message,
      code: error.code 
    });
  }
}
