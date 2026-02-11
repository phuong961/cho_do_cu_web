const pool = require('./db');

async function setupCategories() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log('Creating categories table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Seed categories
        console.log('Seeding categories...');
        const initialCategories = [
            "Quần áo", "Bàn ghế", "Máy tính", "Đồ điện tử", "Đồ gia dụng",
            "Đồ nhà bếp - ăn uống", "Thiết bị nhà tắm", "Trang sức", "Đồng hồ", "Đồ cổ", "Khác"
        ];

        const categoryMap = {}; // name -> id

        for (const catName of initialCategories) {
            const res = await client.query(
                `INSERT INTO categories (name) VALUES ($1) 
                 ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name 
                 RETURNING id, name`,
                [catName]
            );
            categoryMap[res.rows[0].name] = res.rows[0].id;
        }

        // Add category_id to products
        console.log('Updating products table schema...');

        // Check if column exists
        const checkCol = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='products' AND column_name='category_id'
        `);

        if (checkCol.rows.length === 0) {
            await client.query('ALTER TABLE products ADD COLUMN category_id UUID');
            await client.query('ALTER TABLE products ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id)');
        }

        // Migrate existing data
        console.log('Migrating existing product categories...');
        const products = await client.query('SELECT id, category FROM products');

        for (const product of products.rows) {
            if (product.category && categoryMap[product.category]) {
                await client.query(
                    'UPDATE products SET category_id = $1 WHERE id = $2',
                    [categoryMap[product.category], product.id]
                );
            }
        }

        // Ensure category_id is used? We might keep 'category' column for a bit or drop it.
        // Plan said: Drop 'category' column from products.
        // But verifying first if we want to drop it immediately. The prompt said "thay vì name".
        // Let's drop it to be clean, but maybe safer to keep it for a sec? 
        // User asked "Trong bảng product sẽ lưu id tương ứng của category thay vì name." -> implies replacement.

        console.log('Dropping old category column...');
        // We only drop if it exists
        const checkOldCol = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='products' AND column_name='category'
        `);

        if (checkOldCol.rows.length > 0) {
            await client.query('ALTER TABLE products DROP COLUMN category');
        }

        await client.query('COMMIT');
        console.log('✅ Categories setup and migration completed successfully!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

setupCategories();
