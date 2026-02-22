import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://zEc6ssgtcsBqAfJ.root:vmuf2WLzLFAimWe0@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test';

export const pool = mysql.createPool({
  uri: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function query<T>(sql: string, params?: any[]): Promise<T> {
  const [results] = await pool.execute(sql, params);
  return results as T;
}
