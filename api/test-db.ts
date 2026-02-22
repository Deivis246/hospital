import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const result = await query<any[]>('SELECT 1 as connected');
    const tables = await query<any[]>('SHOW TABLES');
    const personaCount = await query<any[]>('SELECT COUNT(*) as count FROM persona');
    const personaSample = await query<any[]>('SELECT * FROM persona LIMIT 1');
    
    return res.status(200).json({
      status: 'ok',
      database: 'connected',
      test: result,
      tables: tables,
      personaCount: personaCount,
      personaSample: personaSample
    });
  } catch (error: any) {
    return res.status(500).json({
      status: 'error',
      message: error.message,
      stack: error.stack
    });
  }
}
