const { Pool } = require('pg');

const pool = new Pool({
    connectionString: 'postgresql://postgres.zcghkijhjztptiocfrfw:Tlchcmc159357@@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true',
});

// Test connection
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = pool;
