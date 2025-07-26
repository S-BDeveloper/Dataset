// update_facts_fields.js
/* eslint-disable */
const fs = require('fs');
const path = require('path');

// Path to your JSON file
const filePath = path.join(__dirname, 'islamic_facts.json');

// Read the existing facts
const facts = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Define your default values
const DEFAULTS = {
  authenticity: "Unknown",         // Or "Sahih", etc.
  difficulty: "Beginner",          // Or "Intermediate", "Advanced"
  Tags: [],                        // Empty array by default
  DateAdded: "7th century"         // Or a specific date
};

// Update each fact
const updatedFacts = facts.map(fact => ({
  ...fact,
  authenticity: fact.authenticity || DEFAULTS.authenticity,
  difficulty: fact.difficulty || DEFAULTS.difficulty,
  Tags: Array.isArray(fact.Tags) ? fact.Tags : DEFAULTS.Tags,
  DateAdded: fact.DateAdded || DEFAULTS.DateAdded
}));

// Write back to the JSON file (overwrite)
fs.writeFileSync(filePath, JSON.stringify(updatedFacts, null, 2), 'utf8');

console.log("Facts updated with new fields!");