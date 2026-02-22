import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://zEc6ssgtcsBqAfJ.root:vmuf2WLzLFAimWe0@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test';

let pool: mysql.Pool;

function getPool() {
  if (pool) return pool;

  console.log('Initializing MySQL connection pool...');
  try {
    pool = mysql.createPool({
      uri: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
      connectTimeout: 5000,
    });
    return pool;
  } catch (err) {
    console.error('Error creating MySQL pool:', err);
    throw err;
  }
}

export async function query<T>(sql: string, params?: any[]): Promise<T> {
  try {
    const activePool = getPool();
    const [results] = await activePool.execute(sql, params);
    return results as T;
  } catch (err: any) {
    console.error('Database query error:', err.message);
    throw err;
  }
}
