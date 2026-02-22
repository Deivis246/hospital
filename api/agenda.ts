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

  const { medi_id } = req.query;

  if (!medi_id) {
    return res.status(400).json({ error: 'medi_id is required' });
  }

  try {
    // Fetch agenda and jornadas for the doctor
    const agendas = await query<any[]>(
      'SELECT agen_id, agen_fech_inic, agen_fech_fina, agen_dura_cita FROM agenda WHERE medi_id = ?',
      [medi_id]
    );

    const results = [];

    for (const agenda of agendas) {
      const jornadas = await query<any[]>(
        'SELECT dia_id, jorn_hora_inic, jorn_hora_fina FROM jornada WHERE agen_id = ?',
        [agenda.agen_id]
      );
      
      results.push({
        ...agenda,
        jornadas
      });
    }

    return res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching agenda:', error);
    return res.status(500).json({ 
      error: 'Error al obtener agenda', 
      details: error.message,
      code: error.code 
    });
  }
}
