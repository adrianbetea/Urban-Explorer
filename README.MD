# Urban Explorer 

**Urban Explorer** is a cross-platform mobile application that allows users to discover, document, and share hidden gems, street art, historical spots, and unique architecture in their city. It serves as a social mapping platform for urban explorers, heavily relying on cloud-based technologies for data processing, real-time database management, and scalable file storage.

---

## Features & Functionalities

*   **Secure User Authentication:** Users can log in securely using OAuth (Google/Apple) to track their discoveries and maintain a unique profile.
*   **Interactive Urban Map:** A dynamic map interface displaying pins of user-generated hidden spots based on geolocation.
*   **Spot Creation & GPS Tracking:** Users can add new locations by uploading photos, adding descriptions, and capturing real-time GPS coordinates.
*   **Social Interactions:** Users can upvote or downvote spots and leave comments on location pages.
*   **Discovery Score System:** Gamification element where users earn points based on the popularity (upvotes) of the locations they discover.
*   **Cloud-based Media Storage:** High-resolution photos of locations are securely uploaded and fetched from an Amazon S3 bucket.
*   **Automated Cloud Processing (Privacy Guard):** Uploaded images are processed in the cloud to automatically strip EXIF metadata (device info, exact time) to protect user privacy before being publicly displayed.

---

## Technology Stack

### Frontend (Mobile App)
*   **Framework:**[React Native](https://reactnative.dev/)
*   **Build Tool:** [Expo](https://expo.dev/) (For rapid cross-platform deployment on Android & iOS)
*   **Maps:** `react-native-maps` for the interactive UI.

### Backend (Server & API)
*   **Environment:** [Node.js](https://nodejs.org/)
*   **Development Tool:** [Nodemon](https://nodemon.io/) (for automatic server restarts during development)
*   **API:** Express.js (handling requests between the mobile app, Firebase, and AWS)

### Cloud Integration (Course Requirements)
*   **Authentication:** **Firebase Auth** (OAuth Provider Integration)
*   **Database:** **Firebase Firestore** (NoSQL Cloud Database used for storing user profiles, spot coordinates, upvotes, and comments)
*   **File Storage:** **Amazon S3** (AWS Simple Storage Service for hosting user-uploaded image galleries)
*   **Data Processing:** **AWS Lambda** / Node Backend (Triggered scripts to compress images and strip EXIF metadata for privacy)

---

## Installation & Setup

### Prerequisites
*   [Node.js](https://nodejs.org/) installed on your machine.
*   [Expo CLI](https://docs.expo.dev/get-started/installation/) installed globally (`npm install -g expo-cli`).
*   Expo Go app installed on your physical mobile device (or an Android/iOS emulator like Vysor).
*   Active accounts/projects on Firebase and AWS.

### 1. Clone the Repository
```bash
git clone https://github.com/adrianbetea/Urban-Explorer.git
cd urban-explorer