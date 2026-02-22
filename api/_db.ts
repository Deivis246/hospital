import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://zEc6ssgtcsBqAfJ.root:vmuf2WLzLFAimWe0@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test';

// Use a global variable to store the pool so it can be reused across serverless invocations
let pool: mysql.Pool;

function getPool() {
  if (pool) return pool;

  console.log('Initializing MySQL connection pool...');
  try {
    const url = new URL(DATABASE_URL);
    const config = {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1) || 'test',
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: false,
      },
      waitForConnections: true,
      connectionLimit: 1, // Low limit for serverless
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    };
    
    pool = mysql.createPool(config);
    console.log('MySQL pool created successfully');
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
    console.error('Database query error:', err);
    throw new Error(`Database query failed: ${err.message}`);
  }
}
