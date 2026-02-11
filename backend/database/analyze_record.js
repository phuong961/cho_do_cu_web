const fs = require('fs');

try {
    const raw = fs.readFileSync('d:/Cho_do_cu/backend/database/record_dump.json', 'utf8');
    const data = JSON.parse(raw);

    let report = "";
    report += `ID: ${data.id}\n`;
    report += `Category ID: ${data.category_id}\n`;
    report += `City: ${data.city}\n`;
    report += `Price: ${data.price} (${typeof data.price})\n`;
    report += `Image Length: ${data.image ? data.image.length : 0}\n`;
    report += `Image Start: ${data.image ? data.image.substring(0, 50) : 'N/A'}\n`;

    fs.writeFileSync('d:/Cho_do_cu/backend/database/analysis.txt', report);
    console.log("Analysis written.");
} catch (e) {
    console.error(e);
}
