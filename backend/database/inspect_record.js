const pool = require('./db');

async function checkProduct() {
    try {
        const id = '3b5c4c98-3000-48fc-a950-bef7655f429d';
        console.log(`Checking product with ID: ${id}`);

        const res = await pool.query('SELECT * FROM products WHERE id = $1', [id]);

        if (res.rows.length > 0) {
            console.log('Record found. Writing to file...');
            const fs = require('fs');
            // Write to absolute path to be sure
            fs.writeFileSync('d:/Cho_do_cu/backend/database/record_dump.json', JSON.stringify(res.rows[0], null, 2));
        } else {
            console.log('Record NOT found.');
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        pool.end();
    }
}

checkProduct();
