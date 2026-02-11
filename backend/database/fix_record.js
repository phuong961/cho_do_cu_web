const pool = require('./db');

async function fixRecord() {
    try {
        const id = '3b5c4c98-3000-48fc-a950-bef7655f429d';
        console.log(`Fixing product with ID: ${id}`);

        // Update image to null or placeholder
        const res = await pool.query("UPDATE products SET image = 'placeholder.jpg' WHERE id = $1", [id]);

        console.log(`Updated ${res.rowCount} record(s). Image data cleared.`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        pool.end();
    }
}

fixRecord();
