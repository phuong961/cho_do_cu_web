const pool = require('./db');

async function updateSchema() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('Adding user_id to products table...');
        // Check if column exists first to avoid error
        const columnCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'products' AND column_name = 'user_id'
        `);

        if (columnCheck.rows.length === 0) {
            await client.query('ALTER TABLE products ADD COLUMN user_id UUID REFERENCES users(id)');
            console.log('Column user_id added to products.');
        } else {
            console.log('Column user_id already exists in products.');
        }

        console.log('Creating sale_orders table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS sale_orders (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID REFERENCES users(id),
                order_id UUID REFERENCES orders(id),
                total INTEGER NOT NULL,
                shipping_name VARCHAR(255),
                shipping_phone VARCHAR(20),
                shipping_city VARCHAR(255),
                shipping_address TEXT,
                order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                status VARCHAR(50) DEFAULT 'pending'
            )
        `);

        console.log('Creating sale_order_items table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS sale_order_items (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                sale_order_id UUID REFERENCES sale_orders(id) ON DELETE CASCADE,
                product_id UUID REFERENCES products(id),
                product_name VARCHAR(255),
                price INTEGER,
                quantity INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('Creating indexes...');
        await client.query('CREATE INDEX IF NOT EXISTS idx_products_user_id ON products(user_id)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_sale_orders_user_id ON sale_orders(user_id)');
        await client.query('CREATE INDEX IF NOT EXISTS idx_sale_order_items_sale_order_id ON sale_order_items(sale_order_id)');

        await client.query('COMMIT');
        console.log('✅ Schema update completed successfully!');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Schema update failed:', error);
    } finally {
        client.release();
        process.exit(0);
    }
}

updateSchema();
