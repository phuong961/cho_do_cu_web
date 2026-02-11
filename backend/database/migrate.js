const pool = require('./db');
const fs = require('fs');
const path = require('path');

async function migrateData() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Migrate Users
        console.log('Migrating users...');
        const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf8'));

        const userIdMap = {}; // Map old IDs to new UUIDs

        for (const user of usersData) {
            const result = await client.query(
                'INSERT INTO users (username, password, name) VALUES ($1, $2, $3) RETURNING id',
                [user.username, user.password, user.name]
            );
            userIdMap[user.id] = result.rows[0].id;
        }

        // Migrate Products
        console.log('Migrating products...');
        const productsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/products.json'), 'utf8'));

        const productIdMap = {}; // Map old IDs to new UUIDs

        for (const product of productsData) {
            const result = await client.query(
                `INSERT INTO products (name, price, image, description, category, usage, brand, condition, origin, seller, address, phone) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
                 RETURNING id`,
                [
                    product.name,
                    product.price,
                    product.image || null,
                    product.desc || null,
                    product.category || null,
                    product.usage || null,
                    product.brand || null,
                    product.condition || null,
                    product.origin || null,
                    product.seller || null,
                    product.address || null,
                    product.phone || null
                ]
            );
            productIdMap[product.id] = result.rows[0].id;
        }

        // Migrate Orders
        console.log('Migrating orders...');
        const ordersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/orders.json'), 'utf8'));

        for (const order of ordersData) {
            // Insert order with new UUID for user_id
            const orderResult = await client.query(
                `INSERT INTO orders (user_id, total, shipping_name, shipping_phone, shipping_address, order_date) 
                 VALUES ($1, $2, $3, $4, $5, $6) 
                 RETURNING id`,
                [
                    userIdMap[order.userId] || null,
                    order.total,
                    order.shippingInfo?.name || null,
                    order.shippingInfo?.phone || null,
                    order.shippingInfo?.address || null,
                    order.date || new Date()
                ]
            );

            const newOrderId = orderResult.rows[0].id;

            // Insert order items with new UUIDs
            if (order.items && order.items.length > 0) {
                for (const item of order.items) {
                    await client.query(
                        `INSERT INTO order_items (order_id, product_id, product_name, price, quantity) 
                         VALUES ($1, $2, $3, $4, $5)`,
                        [
                            newOrderId,
                            productIdMap[item.id] || null,
                            item.name,
                            item.price,
                            item.quantity
                        ]
                    );
                }
            }
        }

        await client.query('COMMIT');
        console.log('✅ Migration completed successfully!');

        // Display statistics
        const userCount = await client.query('SELECT COUNT(*) FROM users');
        const productCount = await client.query('SELECT COUNT(*) FROM products');
        const orderCount = await client.query('SELECT COUNT(*) FROM orders');
        const orderItemCount = await client.query('SELECT COUNT(*) FROM order_items');

        console.log('\n📊 Database Statistics:');
        console.log(`   Users: ${userCount.rows[0].count}`);
        console.log(`   Products: ${productCount.rows[0].count}`);
        console.log(`   Orders: ${orderCount.rows[0].count}`);
        console.log(`   Order Items: ${orderItemCount.rows[0].count}`);

        // Display sample UUIDs
        console.log('\n🔑 Sample UUIDs:');
        const sampleUser = await client.query('SELECT id, username FROM users LIMIT 1');
        const sampleProduct = await client.query('SELECT id, name FROM products LIMIT 1');
        if (sampleUser.rows.length > 0) {
            console.log(`   User: ${sampleUser.rows[0].username} -> ${sampleUser.rows[0].id}`);
        }
        if (sampleProduct.rows.length > 0) {
            console.log(`   Product: ${sampleProduct.rows[0].name} -> ${sampleProduct.rows[0].id}`);
        }

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Run migration
migrateData().catch(console.error);
