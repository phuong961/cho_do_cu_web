const fs = require('fs');

try {
    const raw = fs.readFileSync('d:/Cho_do_cu/backend/database/record_dump.json', 'utf8');
    const data = JSON.parse(raw);

    // Mask image for display
    if (data.image && data.image.length > 100) {
        data.image = `[BASE64 String length: ${data.image.length}]`;
    }

    console.log(JSON.stringify(data, null, 2));
} catch (e) {
    console.error(e);
}
