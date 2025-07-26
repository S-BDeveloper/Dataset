/* eslint-disable */
const fs = require('fs');
const path = require('path');

// Paths to your data files
const pairsPath = path.join(__dirname, '../src/data/quranic_pairs.json');
const factsPath = path.join(__dirname, 'islamic_facts.json');

// Read existing data
const pairs = JSON.parse(fs.readFileSync(pairsPath, 'utf8'));
const facts = JSON.parse(fs.readFileSync(factsPath, 'utf8'));

// Convert each pair to a fact object
const newFacts = pairs.map(pair => {
  const [word1, word2] = pair.pair;
  const count1 = pair[`${word1.toLowerCase()}Count`];
  const count2 = pair[`${word2.toLowerCase()}Count`];
  return {
    Fact: `The words '${word1}' and '${word2}' are each mentioned ${count1} times in the Quran, demonstrating a remarkable balance.`,
    Source: "Quranic Analysis",
    Category: "Quranic Balance",
    Tags: [word1.toLowerCase(), word2.toLowerCase(), "balance", "pairs"],
    authenticity: "Quranic",
    difficulty: "Beginner",
    Notes: pair.notes || "",
    DateAdded: new Date().toISOString().split('T')[0]
  };
});

// Add new facts to the existing facts array
const updatedFacts = [...facts, ...newFacts];

// Write back to the JSON file (overwrite)
fs.writeFileSync(factsPath, JSON.stringify(updatedFacts, null, 2), 'utf8');

console.log("Quranic pairs added to islamic_facts.json as new facts!");