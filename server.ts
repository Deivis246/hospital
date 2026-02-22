import express from 'express';
import { createServer as createViteServer } from 'vite';
import { query } from './api/_db';

async function startServer() {
  console.log('Starting server...');
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
  });

  // API Routes
  app.get('/api/especialidades', async (req, res) => {
    try {
      const especialidades = await query('SELECT espe_id as id, espe_nombre as nombre FROM especialidad ORDER BY espe_nombre ASC');
      res.json(especialidades);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/medicos', async (req, res) => {
    const { espe_id } = req.query;
    try {
      let sql = 'SELECT medi_id as id, medi_nombre as nombre, espe_id as especialidad_id FROM medico';
      const params: any[] = [];
      if (espe_id) {
        sql += ' WHERE espe_id = ?';
        params.push(espe_id);
      }
      const medicos = await query(sql, params);
      res.json(medicos);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/auth', async (req, res) => {
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
        res.json({
          id: person.pers_id,
          nombre: `${person.pers_nombres} ${person.pers_apellidos}`,
          cedula: person.pers_ci,
          fecha_nacimiento: person.pers_fech_naci,
          role: person.pers_ci === 'admin' ? 'ADMIN' : 'PATIENT'
        });
      } else {
        res.status(401).json({ error: 'Credenciales incorrectas' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/agenda', async (req, res) => {
    const { medi_id } = req.query;
    if (!medi_id) return res.status(400).json({ error: 'medi_id is required' });
    try {
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
        results.push({ ...agenda, jornadas });
      }
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/pacientes', async (req, res) => {
    try {
      const personas = await query('SELECT pers_id as id, pers_ci as cedula, pers_nombres as nombres, pers_apellidos as apellidos, pers_fech_naci as fecha_nacimiento FROM persona LIMIT 50');
      res.json(personas);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log('API endpoints: /api/especialidades, /api/medicos, /api/auth, /api/agenda, /api/pacientes');
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
