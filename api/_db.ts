import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL || 'mysql://zEc6ssgtcsBqAfJ.root:vmuf2WLzLFAimWe0@gateway01.us-east-1.prod.aws.tidbcloud.com:4000/test';

export async function query<T>(sql: string, params?: any[]): Promise<T> {
  let connection;
  
  try {
    console.log('Creating new database connection...');
    
    // Parse connection URL and add SSL for TiDB Cloud
    const url = new URL(DATABASE_URL);
    const config = {
      host: url.hostname,
      port: parseInt(url.port) || 4000,
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1), // Remove leading slash
      ssl: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      }
    };
    
    connection = await mysql.createConnection(config);

    console.log('Executing query:', sql);
    const [results] = await connection.execute(sql, params);
    console.log('Query executed successfully');
    
    return results as T;
  } catch (err: any) {
    console.error('Database query error:', {
      message: err.message,
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState
    });
    throw err;
  } finally {
    // Always close connection in serverless
    if (connection) {
      try {
        await connection.end();
        console.log('Database connection closed');
      } catch (closeErr) {
        console.error('Error closing connection:', closeErr);
      }
    }
  }
}
