const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// GET Orders for a user
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
             LEFT JOIN products p ON oi.product_id::uuid = p.id
             WHERE o.user_id = $1
             GROUP BY o.id
             ORDER BY o.order_date DESC`,
            [userId]
        );

        // Debug logging
        console.log('Raw orders result:', JSON.stringify(ordersResult.rows, null, 2));

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

        console.log('Mapped orders:', JSON.stringify(orders, null, 2));

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST Create Order
router.post('/', async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { userId, items, total, shippingInfo } = req.body;

        // Insert order
        const orderResult = await client.query(
            `INSERT INTO orders (user_id, total, shipping_name, shipping_phone, shipping_city, shipping_address) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [userId, total, shippingInfo.name, shippingInfo.phone, shippingInfo.city, shippingInfo.address]
        );
        const orderId = orderResult.rows[0].id;

        // Insert order items
        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, product_name, price, quantity) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [orderId, item.id, item.name, item.price, item.quantity]
            );
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
