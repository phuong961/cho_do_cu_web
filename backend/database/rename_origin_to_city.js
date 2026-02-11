const pool = require('./db');

async function renameOriginToCity() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log('Renaming origin column to city in products table...');

        // Check if column exists before renaming
        const checkCol = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='products' AND column_name='origin'
        `);

        if (checkCol.rows.length > 0) {
            await client.query('ALTER TABLE products RENAME COLUMN origin TO city');
            console.log('✅ Column renamed successfully.');
        } else {
            console.log('ℹ️ Column "origin" not found (maybe already renamed or alias). Checking for "city"...');
            const checkCity = await client.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='products' AND column_name='city'
            `);
            if (checkCity.rows.length > 0) {
                console.log('ℹ️ Column "city" already exists.');
            } else {
                console.error('❌ Neither "origin" nor "city" columns found.');
            }
        }

        await client.query('COMMIT');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Migration failed:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

renameOriginToCity();
