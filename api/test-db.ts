import { VercelRequest, VercelResponse } from '@vercel/node';
import { query } from './_db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log('Test-DB: Querying with pool');
    const result = await query<any[]>('SELECT 1 as connected');
    
    console.log('Test-DB: Querying persona count');
    const countResult = await query<any[]>('SELECT COUNT(*) as count FROM persona');
    
    console.log('Test-DB: Querying persona sample');
    const sampleResult = await query<any[]>('SELECT pers_id, pers_ci, pers_nombres, pers_fech_naci FROM persona LIMIT 1');
    
    return res.status(200).json({
      status: 'ok',
      message: 'Pool connection successful',
      test: result,
      count: countResult[0].count,
      sample: sampleResult[0]
    });
  } catch (error: any) {
    console.error('Test-DB Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message,
      code: error.code,
      stack: error.stack
    });
  }
}
