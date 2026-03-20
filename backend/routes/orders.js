const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// GET Orders for a user (as buyer)
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.json([]);
        }

        // Get orders with items
        const ordersResult = await pool.query(
            `SELECT o.*, 
                    json_agg(
                        json_build_object(
                            'id', oi.product_id,
                            'name', oi.product_name,
                            'price', oi.price,
                            'quantity', oi.quantity,
                            'image', COALESCE(p.image, '/assets/no-image.png'),
                            'seller', p.seller,
                            'sellerPhone', p.phone,
                            'sellerCity', p.city,
                            'sellerAddress', p.address
                        ) ORDER BY oi.id
                    ) as items
             FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             LEFT JOIN products p ON oi.product_id = p.id
             WHERE o.user_id = $1
             GROUP BY o.id
             ORDER BY o.order_date DESC`,
            [userId]
        );

        const orders = ordersResult.rows.map(row => ({
            id: row.id,
            userId: row.user_id,
            items: row.items,
            total: row.total,
            shippingInfo: {
                name: row.shipping_name,
                phone: row.shipping_phone,
                city: row.shipping_city,
                address: row.shipping_address
            },
            date: row.order_date,
            status: row.status
        }));

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET Sale Orders for a user (as seller)
router.get('/sales', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.json([]);
        }

        // Get sale orders with items
        const salesResult = await pool.query(
            `SELECT so.*, 
                    json_agg(
                        json_build_object(
                            'id', soi.product_id,
                            'name', soi.product_name,
                            'price', soi.price,
                            'quantity', soi.quantity,
                            'image', COALESCE(p.image, '/assets/no-image.png'),
                            'seller', p.seller,
                            'sellerPhone', p.phone,
                            'sellerCity', p.city,
                            'sellerAddress', p.address
                        ) ORDER BY soi.id
                    ) as items
             FROM sale_orders so
             LEFT JOIN sale_order_items soi ON so.id = soi.sale_order_id
             LEFT JOIN products p ON soi.product_id = p.id
             WHERE so.user_id = $1
             GROUP BY so.id
             ORDER BY so.order_date DESC`,
            [userId]
        );

        const sales = salesResult.rows.map(row => ({
            id: row.id,
            orderId: row.order_id,
            userId: row.user_id,
            items: row.items,
            total: row.total,
            shippingInfo: {
                name: row.shipping_name,
                phone: row.shipping_phone,
                city: row.shipping_city,
                address: row.shipping_address
            },
            date: row.order_date,
            status: row.status
        }));

        res.json(sales);
    } catch (error) {
        console.error('Error fetching sale orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST Create Order
router.post('/', async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { userId, items, total, shippingInfo } = req.body;

        // 1. Insert original order (for the buyer)
        const orderResult = await client.query(
            `INSERT INTO orders (user_id, total, shipping_name, shipping_phone, shipping_city, shipping_address) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [userId, total, shippingInfo.name, shippingInfo.phone, shippingInfo.city, shippingInfo.address]
        );
        const orderId = orderResult.rows[0].id;

        // 2. Insert order items and collect seller info
        const sellerItemsMap = new Map(); // seller_id -> items[]

        for (const item of items) {
            // Insert into order_items
            await client.query(
                `INSERT INTO order_items (order_id, product_id, product_name, price, quantity) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [orderId, item.id, item.name, item.price, item.quantity]
            );

            // Fetch seller (user_id) for this product
            const productRes = await client.query('SELECT user_id FROM products WHERE id = $1', [item.id]);
            const sellerId = productRes.rows[0]?.user_id;

            if (sellerId) {
                if (!sellerItemsMap.has(sellerId)) {
                    sellerItemsMap.set(sellerId, []);
                }
                sellerItemsMap.get(sellerId).push(item);
            }
        }

        // 3. Create Sale Orders for each seller
        for (const [sellerId, sellerItems] of sellerItemsMap.entries()) {
            const sellerTotal = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            const saleOrderResult = await client.query(
                `INSERT INTO sale_orders (user_id, order_id, total, shipping_name, shipping_phone, shipping_city, shipping_address) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7) 
                 RETURNING id`,
                [sellerId, orderId, sellerTotal, shippingInfo.name, shippingInfo.phone, shippingInfo.city, shippingInfo.address]
            );
            const saleOrderId = saleOrderResult.rows[0].id;

            for (const item of sellerItems) {
                await client.query(
                    `INSERT INTO sale_order_items (sale_order_id, product_id, product_name, price, quantity) 
                     VALUES ($1, $2, $3, $4, $5)`,
                    [saleOrderId, item.id, item.name, item.price, item.quantity]
                );
            }
        }

        await client.query('COMMIT');

        const order = orderResult.rows[0];
        res.status(201).json({
            id: order.id,
            userId: order.user_id,
            items: items,
            total: order.total,
            shippingInfo: {
                name: order.shipping_name,
                phone: order.shipping_phone,
                city: order.shipping_city,
                address: order.shipping_address
            },
            date: order.order_date,
            status: order.status
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error' });
    } finally {
        client.release();
    }
});

module.exports = router;
