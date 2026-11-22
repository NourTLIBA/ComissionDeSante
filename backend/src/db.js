import pg from 'pg';
import { config } from './config.js';

// numeric columns come back as strings by default; scores should be numbers
pg.types.setTypeParser(1700, (v) => (v === null ? null : Number(v)));

// Neon / Render add ?sslmode=require to the URL; pg reads it from there.
export const pool = new pg.Pool({ connectionString: config.databaseUrl, max: 10 });
export const query = (text, params) => pool.query(text, params);
