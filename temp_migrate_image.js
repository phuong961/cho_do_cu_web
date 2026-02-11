const pool = require('./backend/database/db');

async function migrate() {
    try {
        console.log('Starting migration...');
        await pool.query('ALTER TABLE order_items ADD COLUMN IF NOT EXISTS image VARCHAR(500);');
        console.log('Migration completed successfully: Added image to order_items table.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
