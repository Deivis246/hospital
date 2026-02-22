import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    const results: any[] = [];

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
  } catch (error: any) {
    console.error('Error fetching agenda:', error);
    return res.status(500).json({ error: error.message });
  }
}
