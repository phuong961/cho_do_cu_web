const pool = require('./db');

async function updateUsersSchema() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        console.log('Adding new columns to users table...');

        // Add phone column
        await client.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='phone') THEN 
                    ALTER TABLE users ADD COLUMN phone VARCHAR(20); 
                END IF;
            END $$;
        `);

        // Add city column
        await client.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='city') THEN 
                    ALTER TABLE users ADD COLUMN city VARCHAR(100); 
                END IF;
            END $$;
        `);

        // Add address column
        await client.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='address') THEN 
                    ALTER TABLE users ADD COLUMN address TEXT; 
                END IF;
            END $$;
        `);

        console.log('Mocking data for existing users...');
        const users = await client.query('SELECT id FROM users WHERE city IS NULL OR phone IS NULL');

        const cities = ['Hồ Chí Minh', 'Hà Nội'];

        for (const user of users.rows) {
            const randomCity = cities[Math.floor(Math.random() * cities.length)];
            const randomPhone = '09' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
            const randomAddress = `Số ${Math.floor(Math.random() * 100) + 1} đường Nguyễn Văn A, Quận 1`;

            await client.query(
                'UPDATE users SET city = $1, phone = $2, address = $3 WHERE id = $4',
                [randomCity, randomPhone, randomAddress, user.id]
            );
        }

        await client.query('COMMIT');
        console.log('✅ Users schema updated and data mocked successfully!');

        // Display sample
        const sample = await client.query('SELECT id, name, city, phone, address FROM users LIMIT 3');
        console.log('\nSample Updated Users:');
        console.table(sample.rows);

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('❌ Update failed:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

updateUsersSchema();
