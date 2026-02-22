import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://zEc6ssgtcsBqAfJ.root:vmuf2WLzLFAimWe0@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test';

// Parse connection URL for mysql2
function parseConnectionUrl(url: string) {
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) throw new Error('Invalid DATABASE_URL format');
  
  return {
    user: match[1],
    password: match[2],
    host: match[3],
    port: parseInt(match[4]),
    database: match[5],
    ssl: { rejectUnauthorized: false }
  };
}

let connection: mysql.Connection;

async function getConnection() {
  if (connection) return connection;

  console.log('Initializing MySQL connection...');
  try {
    const config = parseConnectionUrl(DATABASE_URL);
    connection = await mysql.createConnection(config);
    return connection;
  } catch (err) {
    console.error('Error creating MySQL connection:', err);
    throw err;
  }
}

export async function query<T>(sql: string, params?: any[]): Promise<T> {
  try {
    const conn = await getConnection();
    const [results] = await conn.execute(sql, params);
    return results as T;
  } catch (err: any) {
    console.error('Database query error:', err.message);
    throw err;
  }
}

// Close connection when process ends
process.on('SIGINT', async () => {
  if (connection) {
    await connection.end();
  }
  process.exit(0);
});
