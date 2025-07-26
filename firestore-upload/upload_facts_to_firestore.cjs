/* eslint-disable */
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./serviceAccountKey.json");
const facts = require("./islamic_facts.json");

// TODO: Replace with your Firebase project ID
const PROJECT_ID = "YOUR_PROJECT_ID";

// Initialize Firebase Admin SDK
initializeApp({
  credential: require("firebase-admin").credential.cert(serviceAccount),
});

const db = getFirestore();

async function uploadFacts() {
  const batch = db.batch();
  const factsCollection = db.collection("facts");

  facts.forEach((fact, idx) => {
    // Use a unique ID for each document (e.g., index or a field)
    const docRef = factsCollection.doc(`${idx}`);
    batch.set(docRef, fact);
  });

  await batch.commit();
  console.log("Bulk upload complete!");
}

uploadFacts().catch(console.error);