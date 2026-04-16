
# Urban Explorer - Backend Architecture & API Design

This document outlines the backend architecture of the Urban Explorer application. The backend is built using **Node.js + Express.js** and integrates seamlessly with **Firebase** (Database & Auth) and **Amazon S3** (File Storage) to fulfill the cloud computing course requirements.

---

## 🗄️ 1. Database Schema (Firebase Firestore)
Since Firestore is a NoSQL cloud database, data is stored in Collections and Documents.

### Collection: `users`
Stores user profile information. Managed via backend after a user registers through Firebase Auth.
```json
{
  "uid": "String (Auth ID)",
  "email": "String",
  "username": "String",
  "avatarUrl": "String (Optional S3 URL)",
  "discoveryScore": "Number (Total upvotes received)",
  "createdAt": "Timestamp"
}
Collection: posts

Stores the hidden gems/spots discovered by users.

code
JSON
download
content_copy
expand_less
{
  "postId": "String (Auto-generated)",
  "userId": "String (Reference to users.uid)",
  "username": "String (Snapshot of author's name)",
  "description": "String",
  "location": {
    "latitude": "Number",
    "longitude": "Number",
    "city": "String (Extracted via reverse geocoding)"
  },
  "imageUrl": "String (Amazon S3 Object URL)",
  "upvotes": "Number (Default: 0)",
  "downvotes": "Number (Default: 0)",
  "createdAt": "Timestamp"
}
Collection: votes (Sub-collection or Top-level)

Crucial to prevent users from voting on the same post multiple times.

code
JSON
download
content_copy
expand_less
{
  "voteId": "String (userId_postId)",
  "userId": "String",
  "postId": "String",
  "type": "Number (1 for upvote, -1 for downvote)"
}
🔐 2. Authentication Logic (Firebase Auth)

The app uses Firebase Authentication to handle both Simple Login (Email/Password) and OAuth (Google/Apple).

Flow:

The React Native app authenticates the user directly with Firebase Auth.

Firebase returns a secure JWT (JSON Web Token) to the mobile app.

For every backend request (creating a post, voting, etc.), the mobile app sends this JWT in the Authorization header.

The Node.js backend uses firebase-admin SDK (Middleware) to verify the token. If valid, the request proceeds; if not, it returns a 401 Unauthorized.

☁️ 3. Posting Logic & S3 Integration

When a user adds a new spot, the data is processed across multiple cloud services.

The Workflow:

Client Upload: User selects an image and types a description in React Native. The app sends a multipart/form-data request to the backend API.

Backend Intercepts (multer): The Node.js server receives the image file in memory.

(Optional Cloud Processing Bonus): The backend runs an image processing library (like sharp) or triggers an AWS Lambda function to compress the image and strip EXIF (GPS) metadata for privacy.

S3 Upload (@aws-sdk/client-s3): The backend uploads the processed image directly to the Amazon S3 Bucket.

Database Save: S3 returns a public URL for the image. The backend then saves the text description, coordinates, and the S3 Image URL into the Firebase Firestore posts collection.

Response: The backend tells the frontend the post was successfully created.

📡 4. REST API Endpoints
🟢 User Routes

POST /api/users/sync

Purpose: Called right after a user registers via OAuth/Email. Checks if the user exists in Firestore; if not, creates the user profile document.

Body: { uid, email, username }

🔵 Post Routes

POST /api/posts

Purpose: Uploads a photo to S3 and creates a new post in Firestore.

Headers: Authorization: Bearer <Firebase_JWT>

Body (Form-Data): image (file), description, latitude, longitude, city.

GET /api/posts

Purpose: Fetches a paginated feed of posts for the Explore Page.

Query Params: ?limit=10&page=1

GET /api/posts/city/:cityName

Purpose: Fetches all posts matching a specific city for the Map and Search pages.

GET /api/posts/user/:uid

Purpose: Fetches all posts created by a specific user (for the Profile page).

DELETE /api/posts/:postId

Purpose: Deletes a post. The backend will first delete the document from Firestore, and then delete the corresponding image object from Amazon S3 to save cloud storage space.

🟣 Social & Interaction Routes

POST /api/posts/:postId/vote

Purpose: Handles upvoting or downvoting.

Headers: Authorization: Bearer <Firebase_JWT>

Body: { voteType: 1 } (1 for upvote, -1 for downvote).

Logic:

Checks the votes collection.

If the user already voted exactly the same way, do nothing.

If it's a new vote or a changed vote (e.g., from down to up), it increments/decrements the upvotes or downvotes counter on the post document using a Firestore transaction.

Updates the author's discoveryScore accordingly.

code
Code
download
content_copy
expand_less
***

### 💡 How to use this with Copilot
Just like with the frontend, you can create a `.github/copilot-instructions.md` in your backend folder, or use the Copilot Chat in VS Code:
> *"@workspace Read `#file:BACKEND_ARCHITECTURE.md`. Generate the Express.js code for the **Posting Logic & S3 Integration**. Set up the `POST /api/posts` route using `multer` and `@aws-sdk/client-s3`."*