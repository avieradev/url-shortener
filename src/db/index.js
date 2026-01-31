import pg from 'pg';
const { Pool } = pg;

// Conexión a PostgreSQL usando variables de entorno
// Coolify inyecta estas automáticamente
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_DATABASE || 'postgres',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

export { pool };
