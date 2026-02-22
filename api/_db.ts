import mysql from 'mysql2/promise';

// Try to load dotenv for local development, but don't fail in Vercel
try {
  const { config } = require('dotenv');
  config();
} catch (e) {
  // dotenv not available (Vercel environment)
  console.log('🔍 Running in Vercel environment');
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set. Please configure it in your environment.');
}

export async function query<T>(sql: string, params?: any[]): Promise<T> {
  let connection;
  
  try {
    console.log('🔗 Creating database connection...');
    console.log('🔍 DATABASE_URL exists:', !!DATABASE_URL);
    console.log('🔍 DATABASE_URL starts with mysql://:', DATABASE_URL.startsWith('mysql://'));
    
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
    
    console.log('🔍 Connection config:', {
      host: config.host,
      port: config.port,
      user: config.user,
      database: config.database,
      ssl: 'enabled'
    });
    
    connection = await mysql.createConnection(config);
    console.log('✅ Database connection established');

    console.log('🔍 Executing query:', sql);
    const [results] = await connection.execute(sql, params);
    console.log('✅ Query executed successfully');
    
    return results as T;
  } catch (err: any) {
    console.error('❌ Database error:', {
      message: err.message,
      code: err.code,
      errno: err.errno,
      sqlState: err.sqlState
    });
    
    // Provide more specific error messages
    if (err.message.includes('insecure transport')) {
      throw new Error('Database connection requires SSL/TLS. Please check your DATABASE_URL configuration.');
    }
    if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      throw new Error('Database authentication failed. Please check your credentials.');
    }
    if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      throw new Error('Cannot connect to database server. Please check your network and DATABASE_URL.');
    }
    
    throw err;
  } finally {
    // Always close connection in serverless
    if (connection) {
      try {
        await connection.end();
        console.log('🔒 Database connection closed');
      } catch (closeErr) {
        console.error('❌ Error closing connection:', closeErr);
      }
    }
  }
}
