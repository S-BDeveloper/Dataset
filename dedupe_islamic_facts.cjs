const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'src', 'data', 'islamic_facts.json');
const outputPath = path.join(__dirname, 'src', 'data', 'islamic_facts_deduped.json');

const raw = fs.readFileSync(inputPath, 'utf8');
const data = JSON.parse(raw);

const seen = new Set();
const deduped = [];

for (const entry of data) {
  const factKey = (entry.Fact || '').trim().toLowerCase();
  if (!seen.has(factKey)) {
    seen.add(factKey);
    deduped.push(entry);
  }
}

fs.writeFileSync(outputPath, JSON.stringify(deduped, null, 2), 'utf8');
console.log(`Deduplication complete! Output written to ${outputPath}`);