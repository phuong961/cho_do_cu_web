const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// POST Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username, password });

        const result = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND password = $2',
            [username, password]
        );

        if (result.rows.length > 0) {
            const user = result.rows[0];
            console.log('Login success for:', username);
            res.json({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    city: user.city,
                    address: user.address,
                    phone: user.phone
                }
            });
        } else {
            console.log('Login failed for:', username);
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST Register
router.post('/register', async (req, res) => {
    try {
        const { username, password, name, city, address, phone } = req.body;

        // Check if username already exists
        const existingUser = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        // Insert new user
        const result = await pool.query(
            'INSERT INTO users (username, password, name, city, address, phone) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [username, password, name || username, city, address, phone]
        );

        const newUser = result.rows[0];
        res.status(201).json({
            success: true,
            user: {
                id: newUser.id,
                username: newUser.username,
                name: newUser.name,
                city: newUser.city,
                address: newUser.address,
                phone: newUser.phone
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
