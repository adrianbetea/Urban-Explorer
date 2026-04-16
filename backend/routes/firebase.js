// backend/firebase.js
require('dotenv').config();

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../firebaseServiceAccount.json');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Use the default Firestore database unless a specific database id is provided.
const firestoreDatabaseId = process.env.FIRESTORE_DATABASE_ID;
const db = firestoreDatabaseId ? getFirestore(admin.app(), firestoreDatabaseId) : getFirestore(admin.app());
const auth = admin.auth();

module.exports = { admin, db, auth, firestoreDatabaseId };