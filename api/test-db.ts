import { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const DATABASE_URL = process.env.DATABASE_URL || 'mysql://zEc6ssgtcsBqAfJ.root:vmuf2WLzLFAimWe0@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test';
  
  console.log('Test-DB: Starting handler');
  try {
    console.log('Test-DB: Parsing URL');
    const url = new URL(DATABASE_URL);
    
    console.log('Test-DB: Creating connection');
    const connection = await mysql.createConnection({
      uri: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      connectTimeout: 5000,
    });

    console.log('Test-DB: Executing query');
    const [rows] = await connection.execute('SELECT 1 as connected');
    
    let tableCheck = null;
    try {
      const [tables]: any = await connection.execute('SHOW TABLES');
      tableCheck = tables;
    } catch (e: any) {
      tableCheck = { error: e.message };
    }

    console.log('Test-DB: Closing connection');
    await connection.end();
    
    console.log('Test-DB: Success');
    return res.status(200).json({
      status: 'ok',
      message: 'Direct connection successful',
      data: rows,
      tables: tableCheck
    });
  } catch (error: any) {
    console.error('Test-DB: Error caught:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message,
      code: error.code,
      stack: error.stack
    });
  }
}
