const express = require('express');
const app = express();
const { db, firestoreDatabaseId } = require('./routes/firebase');
const postRoutes = require('./routes/posts-routes');
const authRoutes = require('./routes/auth-routes');
const oauthRoutes = require('./routes/oauth-routes');

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/oauth', oauthRoutes);

// Add this test route to your Express app
app.get('/test-firebase', async (req, res) => {
    try {
        const testDoc = await db.collection('test').add({ message: "Firebase is connected!" });
        res.send(`Connected! Document ID: ${testDoc.id}`);
    } catch (error) {
        if (error.code === 5) {
            return res.status(500).send(
                "Firebase error: 5 NOT_FOUND. Firestore database is missing or database id is wrong. " +
                `Current database id: ${firestoreDatabaseId || '(default)'}.`
            );
        }

        if (error.code === 7) {
            return res.status(500).send(
                "Firebase error: 7 PERMISSION_DENIED. Enable Firestore API and verify IAM permissions for the service account."
            );
        }

        res.status(500).send("Firebase error: " + error.message);
    }
});

app.get('/', (req, res) => {
    res.send('Urban Explorer Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});