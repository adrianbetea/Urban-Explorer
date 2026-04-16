const express = require('express');
const multer = require('multer');

const { admin, db } = require('./firebase');
const { uploadToS3 } = require('./s3');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

function parsePagination(query) {
    const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 10, 1), 50);
    const offset = (page - 1) * limit;
    return { page, limit, offset };
}

async function verifyFirebaseToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization || '';
        if (!authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid Authorization header.' });
        }

        const idToken = authHeader.slice(7);
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        return next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized. ' + error.message });
    }
}

// POST /api/posts
// Uploads image to S3 and stores post metadata in Firestore.
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { description, latitude, longitude, city, userId, username } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided.' });
        }

        const imageUrl = await uploadToS3(req.file.buffer, req.file.mimetype);

        const newPost = {
            userId: userId || 'anonymous_user',
            username: username || 'Explorer',
            description: description || '',
            location: {
                latitude: Number(latitude),
                longitude: Number(longitude),
                city: city || 'Unknown Location',
            },
            imageUrl,
            upvotes: 0,
            downvotes: 0,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        const docRef = await db.collection('posts').add(newPost);

        return res.status(201).json({
            message: 'Post created successfully.',
            postId: docRef.id,
            data: newPost,
        });
    } catch (error) {
        console.error('Error creating post:', error);
        return res.status(500).json({ error: 'Failed to create post. ' + error.message });
    }
});

// GET /api/posts?limit=10&page=1
// Paginated feed for Explore page.
router.get('/', async (req, res) => {
    try {
        const { page, limit, offset } = parsePagination(req.query);

        const baseQuery = db.collection('posts').orderBy('createdAt', 'desc');
        const snapshot = await baseQuery.offset(offset).limit(limit).get();
        const countSnapshot = await db.collection('posts').count().get();
        const total = countSnapshot.data().count;

        const posts = snapshot.docs.map((doc) => ({
            postId: doc.id,
            ...doc.data(),
            score: (doc.data().upvotes || 0) - (doc.data().downvotes || 0),
        }));

        return res.status(200).json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            data: posts,
        });
    } catch (error) {
        console.error('Error fetching posts feed:', error);
        return res.status(500).json({ error: 'Failed to fetch posts feed. ' + error.message });
    }
});

// GET /api/posts/city/:cityName
// Feed filtered by city for Map and Search pages.
router.get('/city/:cityName', async (req, res) => {
    try {
        const cityName = req.params.cityName;

        const snapshot = await db
            .collection('posts')
            .where('location.city', '==', cityName)
            .orderBy('createdAt', 'desc')
            .get();

        const posts = snapshot.docs.map((doc) => ({
            postId: doc.id,
            ...doc.data(),
            score: (doc.data().upvotes || 0) - (doc.data().downvotes || 0),
        }));

        return res.status(200).json({ city: cityName, count: posts.length, data: posts });
    } catch (error) {
        console.error('Error fetching city posts:', error);
        return res.status(500).json({ error: 'Failed to fetch city posts. ' + error.message });
    }
});

// GET /api/posts/user/:uid
// Returns posts authored by a specific user.
router.get('/user/:uid', async (req, res) => {
    try {
        const uid = req.params.uid;

        const snapshot = await db
            .collection('posts')
            .where('userId', '==', uid)
            .orderBy('createdAt', 'desc')
            .get();

        const posts = snapshot.docs.map((doc) => ({
            postId: doc.id,
            ...doc.data(),
            score: (doc.data().upvotes || 0) - (doc.data().downvotes || 0),
        }));

        return res.status(200).json({ uid, count: posts.length, data: posts });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return res.status(500).json({ error: 'Failed to fetch user posts. ' + error.message });
    }
});

// POST /api/posts/:postId/vote
// Body: { voteType: 1 } or { voteType: -1 }
router.post('/:postId/vote', verifyFirebaseToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const { voteType } = req.body;
        const userId = req.user.uid;

        if (voteType !== 1 && voteType !== -1) {
            return res.status(400).json({ error: 'Invalid voteType. Use 1 for upvote or -1 for downvote.' });
        }

        const postRef = db.collection('posts').doc(postId);
        const voteRef = db.collection('votes').doc(`${userId}_${postId}`);

        const result = await db.runTransaction(async (transaction) => {
            const [postSnap, voteSnap] = await Promise.all([transaction.get(postRef), transaction.get(voteRef)]);

            if (!postSnap.exists) {
                throw new Error('Post not found.');
            }

            const postData = postSnap.data();
            const previousVoteType = voteSnap.exists ? voteSnap.data().type : null;

            if (previousVoteType === voteType) {
                return {
                    changed: false,
                    upvotes: postData.upvotes || 0,
                    downvotes: postData.downvotes || 0,
                    score: (postData.upvotes || 0) - (postData.downvotes || 0),
                };
            }

            let upvoteDelta = 0;
            let downvoteDelta = 0;
            let scoreDeltaForAuthor = 0;

            if (previousVoteType === null) {
                if (voteType === 1) {
                    upvoteDelta = 1;
                    scoreDeltaForAuthor = 1;
                } else {
                    downvoteDelta = 1;
                    scoreDeltaForAuthor = -1;
                }
            } else if (previousVoteType === 1 && voteType === -1) {
                upvoteDelta = -1;
                downvoteDelta = 1;
                scoreDeltaForAuthor = -2;
            } else if (previousVoteType === -1 && voteType === 1) {
                upvoteDelta = 1;
                downvoteDelta = -1;
                scoreDeltaForAuthor = 2;
            }

            transaction.update(postRef, {
                upvotes: admin.firestore.FieldValue.increment(upvoteDelta),
                downvotes: admin.firestore.FieldValue.increment(downvoteDelta),
            });

            transaction.set(
                voteRef,
                {
                    userId,
                    postId,
                    type: voteType,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                },
                { merge: true }
            );

            if (postData.userId && scoreDeltaForAuthor !== 0) {
                const authorRef = db.collection('users').doc(postData.userId);
                transaction.set(
                    authorRef,
                    {
                        discoveryScore: admin.firestore.FieldValue.increment(scoreDeltaForAuthor),
                    },
                    { merge: true }
                );
            }

            const nextUpvotes = (postData.upvotes || 0) + upvoteDelta;
            const nextDownvotes = (postData.downvotes || 0) + downvoteDelta;

            return {
                changed: true,
                upvotes: nextUpvotes,
                downvotes: nextDownvotes,
                score: nextUpvotes - nextDownvotes,
            };
        });

        return res.status(200).json({
            message: result.changed ? 'Vote recorded.' : 'Vote unchanged (already applied).',
            data: result,
        });
    } catch (error) {
        console.error('Error voting on post:', error);
        return res.status(500).json({ error: 'Failed to process vote. ' + error.message });
    }
});

module.exports = router;