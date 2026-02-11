const pool = require('./db');

async function debugInsert() {
    try {
        console.log("Attempting insert...");

        // Fetch a category id first
        const catRes = await pool.query('SELECT id FROM categories LIMIT 1');
        const validCatId = catRes.rows[0]?.id;

        if (!validCatId) {
            console.error("No categories found to test with.");
            return;
        }

        // Mock data with valid integer price but empty city/phone
        const name = "Test Product Empty City";
        const price = 100000; // VALID integer
        const image = "test.jpg";
        const desc = "Test description";
        const category_id = validCatId;
        const usage = "1 năm";
        const brand = "Test Brand";
        const condition = "Còn mới";
        const city = ""; // Empty city
        const seller = "Test User";
        const address = ""; // Empty address
        const phone = ""; // Empty phone

        try {
            await pool.query(
                `INSERT INTO products (name, price, image, description, category_id, usage, brand, condition, city, seller, address, phone) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                [name, price, image, desc, category_id, usage, brand, condition, city, seller, address, phone]
            );
            console.log("Insert Success!");
        } catch (insertErr) {
            console.error("Insert Failed:", insertErr.message);
            console.error("Detail:", insertErr);
        }

    } catch (err) {
        console.error("Major Error:", err);
    } finally {
        pool.end();
    }
}

debugInsert();
