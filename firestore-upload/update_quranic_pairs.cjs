/* eslint-disable */
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../src/data/quranic_pairs.json");

// Read existing pairs
const pairs = JSON.parse(fs.readFileSync(filePath, "utf8"));

// Example: Add a new pair
pairs.push({
  pair: ["Patience", "Impatience"],
  patienceCount: 16,
  impatienceCount: 16,
  notes: "Both words are mentioned 16 times in the Quran.",
});

// Write back to the JSON file
fs.writeFileSync(filePath, JSON.stringify(pairs, null, 2), "utf8");

console.log("Quranic pairs updated!");
