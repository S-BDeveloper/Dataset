/* eslint-disable */
const fs = require('fs');
const path = require('path');

// Path to your facts JSON file
const factsPath = path.join(__dirname, 'islamic_facts.json');

// Read existing facts
const facts = JSON.parse(fs.readFileSync(factsPath, 'utf8'));

// Default values for new fields
const DEFAULTS = {
  QuranReferences: [],
  HadithReferences: [],
  ScientificReferences: [],
  relatedFactIds: [],
  viewCount: 0,
  favoriteCount: 0,
  shareCount: 0,
  audioUrl: "",
  videoUrl: "",
  type: "General"
};

// Add missing fields to each fact
const enrichedFacts = facts.map(fact => ({
  ...fact,
  QuranReferences: Array.isArray(fact.QuranReferences) ? fact.QuranReferences : DEFAULTS.QuranReferences,
  HadithReferences: Array.isArray(fact.HadithReferences) ? fact.HadithReferences : DEFAULTS.HadithReferences,
  ScientificReferences: Array.isArray(fact.ScientificReferences) ? fact.ScientificReferences : DEFAULTS.ScientificReferences,
  relatedFactIds: Array.isArray(fact.relatedFactIds) ? fact.relatedFactIds : DEFAULTS.relatedFactIds,
  viewCount: typeof fact.viewCount === "number" ? fact.viewCount : DEFAULTS.viewCount,
  favoriteCount: typeof fact.favoriteCount === "number" ? fact.favoriteCount : DEFAULTS.favoriteCount,
  shareCount: typeof fact.shareCount === "number" ? fact.shareCount : DEFAULTS.shareCount,
  audioUrl: typeof fact.audioUrl === "string" ? fact.audioUrl : DEFAULTS.audioUrl,
  videoUrl: typeof fact.videoUrl === "string" ? fact.videoUrl : DEFAULTS.videoUrl,
  type: typeof fact.type === "string" ? fact.type : DEFAULTS.type
}));

// Write back to the JSON file (overwrite)
fs.writeFileSync(factsPath, JSON.stringify(enrichedFacts, null, 2), 'utf8');

console.log("All facts enriched with new fields and default values!");