const pool = require('./backend/database/db');

async function migrate() {
    try {
        console.log('Starting migration...');
        await pool.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_city VARCHAR(255);');
        console.log('Migration completed successfully: Added shipping_city to orders table.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
