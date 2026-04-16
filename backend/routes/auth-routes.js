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

// POST /api/auth/register
// Creates a Firebase Auth user and syncs its profile in Firestore.
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body || {};

        if (!req.body) {
            return res.status(400).json({
                error: 'Missing request body. Send JSON and set Content-Type: application/json.',
            });
        }

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        const userRecord = await admin.auth().createUser({
            email,
            password,
            displayName: username || undefined,
        });

        const user = await upsertUserProfile({
            uid: userRecord.uid,
            email: userRecord.email,
            username: userRecord.displayName,
        });

        return res.status(201).json({ message: 'User registered successfully.', user });
    } catch (error) {
        console.error('Error registering user:', error);
        if (error?.errorInfo?.code === 'auth/configuration-not-found') {
            return res.status(500).json({
                error:
                    'Firebase Auth configuration not found. Ensure Email/Password sign-in is enabled in Firebase Console for project urbanexplorer-f32f2.',
            });
        }
        return res.status(500).json({ error: 'Failed to register user. ' + error.message });
    }
});

// POST /api/auth/verify-token
// Verifies Firebase ID tokens sent by frontend after login/oauth.
router.post('/verify-token', async (req, res) => {
    try {
        const authHeader = req.headers.authorization || '';
        const bodyToken = req.body?.idToken;
        const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
        const idToken = bearerToken || bodyToken;

        if (!idToken) {
            return res.status(400).json({ error: 'Missing Firebase idToken.' });
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const user = await upsertUserProfile({
            uid: decodedToken.uid,
            email: decodedToken.email || '',
            username: decodedToken.name || '',
            avatarUrl: decodedToken.picture || '',
        });

        return res.status(200).json({ message: 'Token verified.', user, decodedToken });
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Invalid token. ' + error.message });
    }
});

// POST /api/auth/sync
// Called by frontend after auth to ensure a profile exists in Firestore.
router.post('/sync', async (req, res) => {
    try {
            const { uid, email, username, avatarUrl } = req.body || {};

            if (!req.body) {
                return res.status(400).json({
                    error: 'Missing request body. Send JSON and set Content-Type: application/json.',
                });
            }

            if (!uid || !email) {
                return res.status(400).json({ error: 'Missing required user data (uid or email).' });
            }

            const user = await upsertUserProfile({ uid, email, username, avatarUrl });
            return res.status(200).json({ message: 'User synced successfully.', user });
    } catch (error) {
            console.error('Error syncing user:', error);
            return res.status(500).json({ error: 'Failed to sync user. ' + error.message });
    }
});

module.exports = router;