const express = require('express');
const router = express.Router();
const { admin, db } = require('./firebase');

async function upsertUserProfile({ uid, email, username, avatarUrl }) {
  const userRef = db.collection('users').doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    const newUser = {
      uid,
      email,
      username: username || (email ? email.split('@')[0] : 'explorer'),
      avatarUrl: avatarUrl || '',
      discoveryScore: 0,
      createdAt: new Date().toISOString(),
    };
    await userRef.set(newUser);
    return newUser;
  }

  return userDoc.data();
}

async function handleOAuth(req, res, providerName) {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: `Missing ${providerName} idToken.` });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const user = await upsertUserProfile({
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      username: decodedToken.name || '',
      avatarUrl: decodedToken.picture || '',
    });

    return res.status(200).json({
      message: `${providerName} token verified and user synced.`,
      user,
      decodedToken,
    });
  } catch (error) {
    console.error(`Error in ${providerName} OAuth:`, error);
    return res.status(401).json({ error: `Invalid ${providerName} token. ` + error.message });
  }
}

// POST /api/oauth/google
router.post('/google', async (req, res) => {
  return handleOAuth(req, res, 'Google');
});

// POST /api/oauth/apple
router.post('/apple', async (req, res) => {
  return handleOAuth(req, res, 'Apple');
});

module.exports = router;
