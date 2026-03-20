const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const fs = require('fs');
const path = require('path');

// Helper to save base64 image
const saveBase64Image = (base64String) => {
    if (!base64String || typeof base64String !== 'string' || !base64String.startsWith('data:image')) return null;

    try {
        const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");
        const extension = base64String.split(';')[0].split('/')[1] || 'png';
        const fileName = `product_${Date.now()}_${Math.floor(Math.random() * 1000)}.${extension}`;
        const uploadPath = path.join(__dirname, '..', 'assets', fileName);

        fs.writeFileSync(uploadPath, base64Data, 'base64');
        return `/assets/${fileName}`;
    } catch (err) {
        console.error('Error saving image:', err);
        return null;
    }
};

// GET all products (with optional category filter)
router.get('/', async (req, res) => {
    try {
        const category = req.query.category;

        let query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
        `;
        let whereClause = ' WHERE p.status = \'active\' AND p.deleted_at IS NULL';
        let params = [];
        let orderBy = ' ORDER BY p.created_at DESC';

        if (category && category !== 'Tất cả') {
            whereClause += ' AND c.name = $1';
            params = [category];
        }

        const fullQuery = query + whereClause + orderBy;

        const result = await pool.query(fullQuery, params);

        // Map database fields to match frontend expectations
        const products = result.rows.map(row => {
            let imageUrl = row.image;
            let imagesUrls = row.images && row.images.length > 0 ? row.images : (imageUrl ? [imageUrl] : []);

            return {
                id: row.id,
                name: row.name,
                price: row.price,
                image: imageUrl,
                images: imagesUrls,
                desc: row.description,
                category: row.category_name,
                category_id: row.category_id,
                usage: row.usage,
                brand: row.brand,
                condition: row.condition,
                city: row.city,
                seller: row.seller,
                address: row.address,
                phone: row.phone
            };
        });

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET product by ID
router.get('/:id', async (req, res) => {
    try {
        const query = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            WHERE p.id = $1
        `;
        const result = await pool.query(query, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const row = result.rows[0];
        let imageUrl = row.image;
        let imagesUrls = row.images && row.images.length > 0 ? row.images : (imageUrl ? [imageUrl] : []);

        const product = {
            id: row.id,
            name: row.name,
            price: row.price,
            image: imageUrl,
            images: imagesUrls,
            desc: row.description,
            category: row.category_name,
            category_id: row.category_id,
            usage: row.usage,
            brand: row.brand,
            condition: row.condition,
            city: row.city,
            seller: row.seller,
            address: row.address,
            phone: row.phone
        };

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST new product
router.post('/', async (req, res) => {
    try {
        const { name, price, category, desc, user_id, image, images, usage, brand, condition } = req.body;

        // Fetch user details for autofill
        let city, address, seller, phone;

        if (user_id) {
            const userRes = await pool.query('SELECT name, city, address, phone FROM users WHERE id = $1', [user_id]);
            if (userRes.rows.length > 0) {
                const user = userRes.rows[0];
                city = user.city;
                address = user.address;
                seller = user.name;
                phone = user.phone;
            }
        }

        city = city || req.body.city;
        address = address || req.body.address;
        seller = seller || req.body.seller;
        phone = phone || req.body.phone;

        // Save multiple images
        let savedImages = [];
        if (images && Array.isArray(images)) {
            savedImages = images.map(img => saveBase64Image(img)).filter(p => p !== null);
        } else if (image) {
            const savedPath = saveBase64Image(image);
            if (savedPath) savedImages = [savedPath];
        }

        const primaryImage = savedImages.length > 0 ? savedImages[0] : (image && !image.startsWith('data:image') ? image : "/assets/no-image.png");

        const result = await pool.query(
            `INSERT INTO products (name, price, image, images, description, category_id, usage, brand, condition, city, seller, address, phone, user_id) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
             RETURNING *`,
            [name, Math.round(price), primaryImage, savedImages, desc, category, usage, brand, condition, city, seller, address, phone, user_id]
        );

        const row = result.rows[0];
        let imageUrl = row.image;
        let imagesUrls = row.images && row.images.length > 0 ? row.images : (imageUrl ? [imageUrl] : []);

        // Fetch category name
        const catResult = await pool.query('SELECT name FROM categories WHERE id = $1', [row.category_id]);
        const dbCategoryName = catResult.rows[0] ? catResult.rows[0].name : null;

        const newProduct = {
            id: row.id,
            name: row.name,
            price: row.price,
            image: imageUrl,
            images: imagesUrls,
            desc: row.description,
            category: dbCategoryName,
            category_id: row.category_id,
            usage: row.usage,
            brand: row.brand,
            condition: row.condition,
            city: row.city,
            seller: row.seller,
            address: row.address,
            phone: row.phone
        };

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
