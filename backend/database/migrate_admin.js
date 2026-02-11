const pool = require('./db');

async function migrateAdmin() {
    try {
        console.log('Starting migration for Admin...');

        // 1. Create admin_user table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS admin_user (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                username VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Created admin_user table');

        // 2. Insert admin user if not exists
        await pool.query(`
            INSERT INTO admin_user (username, password)
            VALUES ('admin', '123456')
            ON CONFLICT (username) DO NOTHING
        `);
        console.log('✅ Inserted default admin user');

        // 3. Add status column to products
        await pool.query(`
            ALTER TABLE products ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active'
        `);
        console.log('✅ Added status column to products');

        // 4. Update existing products status to 'active'
        await pool.query(`
            UPDATE products SET status = 'active' WHERE status IS NULL
        `);
        console.log('✅ Mocked status data for existing products');

        // 5. Add deleted_at column to products
        await pool.query(`
            ALTER TABLE products ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP
        `);
        console.log('✅ Added deleted_at column to products');

        console.log('Migration completed successfully!');
    } catch (err) {
        console.error('Error during migration:', err);
    } finally {
        pool.end();
    }
}

migrateAdmin();
