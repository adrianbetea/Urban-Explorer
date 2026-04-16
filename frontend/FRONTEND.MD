# Urban Explorer- Frontend Architecture & UI Components

This document outlines the frontend structure of the Urban Explorer application, built with React Native and Expo. It breaks down the navigation flow, core pages, and the reusable components/containers required for each screen.

## Navigation Structure (React Navigation)
*   **Auth Stack:** Handles unauthenticated users (`Login/Register`).
*   **Main App (Bottom Tab / Stack Navigator):** Handles authenticated routing between `Home`, `Explore`, `Map`, `Search`, and `Profile`.
*   **Modal Stack:** For global actions like `Add Post / Upload Photo`.

---

## 1. Login / Register Page
**Purpose:** Entry point for the app. Handles user authentication (OAuth) and account creation.

**Key Components:**
*   `AppLogo`: The Urban Explorer branding/logo.
*   `AuthForm`: 
    *   `EmailInput`: Text field for email.
    *   `PasswordInput`: Secure text field for password.
    *   `SubmitButton`: Triggers Login or Register action.
    *   `ToggleAuthMode`: Text link to switch between "Log In" and "Create Account".
*   `OAuthContainer`: Buttons for "Sign in with Google" and "Sign in with Apple" (Firebase Auth integration).

---

## 2. Home Page (Dashboard)
**Purpose:** The central hub of the app. Provides quick access to the main modules of the application.

**Key Components:**
*   `WelcomeHeader`: Displays "Hello, [Username]!" and current location status.
*   `DashboardGrid` (Main Layout):
    *   **Explore Container:** A large, visually appealing card navigating to the Feed. (e.g., shows a blurred trending photo).
    *   **Map Container:** A card with a mini-map preview navigating to the full interactive Map.
    *   **Search Container:** A card with a search icon for quick access to the Search Page.
*   `ProfileShortcut`: A circular avatar at the top right navigating to the Profile Page.
*   `AddPostFAB` (Floating Action Button): A prominent "+" button pinned to the bottom right to trigger the `Create Post` modal from anywhere on the Home screen.

---

## 3. Explore Page (Feed)
**Purpose:** A socially-driven feed (similar to Facebook/Instagram) where users view, discover, and rate hidden gems posted by others.

**Key Components:**
*   `FeedList`: A React Native `<FlatList>` that loads posts dynamically (paginated from Firebase).
*   `PostCard` (Reusable Component representing a single post):
    *   `PostHeader`: Displays user avatar, username, and the Location/City tag.
    *   `ImageGallery`: An image carousel fetching photos from Amazon S3.
    *   `PostDescription`: Text description of the spot.
    *   `InteractionBar`:
        *   **Upvote Button:** Thumb-up icon (increases visibility/score).
        *   **Downvote Button:** Thumb-down icon (for spam, bad representations, or low-effort posts).
        *   `ScoreDisplay`: Shows the net score (Upvotes - Downvotes).

---

## 4. Map Page
**Purpose:** A geospatial view of the urban exploration data. Users can look around, click on cities, and see localized posts.

**Key Components:**
*   `InteractiveMap`: Full-screen map using `react-native-maps`.
*   `CityMarker / PostMarker`: Custom pins on the map representing cities with active posts or exact post locations.
*   `CityBottomSheet` (Modal/Slide-up panel):
    *   Triggered when a user taps a city/marker.
    *   Displays a mini-feed (`HorizontalFlatList`) of top-rated posts from that specific city.
*   `PostHereButton`: A contextual button inside the bottom sheet that says "Add a Spot in [City Name]", which auto-fills the location data in the Create Post form.

---

## 5. Search Page
**Purpose:** Allows users to manually search for specific cities or regions to view discoveries without navigating the map.

**Key Components:**
*   `SearchBar`: Input field with auto-complete/suggestions for city names.
*   `TrendingCitiesList`: Displays popular cities (e.g., cities with the most upvoted spots) before the user types anything.
*   `SearchResultsContainer`:
    *   Displays a list of cities matching the query.
    *   When a city is tapped, it navigates to a `CityFeedView` (reusing the `FeedList` component but filtered by the selected city).

---

## 6. Profile Page & Settings
**Purpose:** User management area. Users view their own contributions, manage their content (CRUD), and update account settings.

**Key Components:**
*   **Profile View:**
    *   `ProfileHeader`: Shows Avatar, Username, and "Total Discovery Score" (sum of all upvotes received).
    *   `SettingsButton`: Gear icon navigating to Settings.
    *   `UserPostsGrid`: A grid view (`<FlatList numColumns={3}>`) or list view of all spots discovered by the user.
*   **Post Management (Update/Delete):**
    *   When clicking their own post, a `PostOptionsModal` appears.
    *   `EditPostForm`: Update description or location tags.
    *   `DeletePostButton`: Permanently removes the post from Firebase and deletes the images from S3.
*   **Profile Settings Page (Sub-page):**
    *   `UpdateUsernameInput`: Field to change display name.
    *   `UpdatePasswordInput`: Fields for current and new password (handled via Firebase Auth).
    *   `SaveSettingsButton`: Submits updates to the database.

---

## Shared / Global Components
*(These are components used across multiple pages to keep code DRY - Don't Repeat Yourself)*
*   `LoadingSpinner`: Used during API calls to Firebase/S3.
*   `ImageUploader`: Interface handling the selection of photos from the phone gallery or camera, previewing them, and formatting them for AWS S3 upload. Used in both Map and Home pages.
*   `LocationFetcher`: Invisible utility component that grabs the user's current GPS coordinates when they create a post.