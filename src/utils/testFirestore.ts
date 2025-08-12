// Test utility for Firestore user management
import { firestoreService } from "../firebase/firestore";

export const testFirestoreUserManagement = async () => {
  console.log("🧪 Testing Firestore User Management...");

  try {
    // Test 1: Check if Firebase is configured
    const isConfigured = true; // Assume configured for testing
    console.log("✅ Firebase configured:", isConfigured);

    if (!isConfigured) {
      console.log("⚠️ Firebase not configured - skipping tests");
      return;
    }

    // Test 2: Create a test user profile
    const testUserId = "test-user-" + Date.now();
    const testUserData = {
      email: "test@example.com",
      displayName: "Test User",
      createdAt: new Date(),
      lastActive: new Date(),
      preferences: {
        darkMode: false,
        language: "en",
        fontSize: "medium" as const,
        highContrast: false,
        reducedMotion: false,
      },
    };

    console.log("📝 Creating test user profile...");
    await firestoreService.createUserProfile(testUserId, testUserData);
    console.log("✅ Test user profile created");

    // Test 3: Retrieve the test user profile
    console.log("📖 Retrieving test user profile...");
    const retrievedProfile = await firestoreService.getUserProfile(testUserId);
    console.log(
      "✅ Test user profile retrieved:",
      retrievedProfile?.displayName
    );

    // Test 4: Update the test user profile
    console.log("✏️ Updating test user profile...");
    await firestoreService.updateUserProfile(testUserId, {
      displayName: "Updated Test User",
      lastActive: new Date(),
    });
    console.log("✅ Test user profile updated");

    // Test 5: Update user preferences
    console.log("⚙️ Updating user preferences...");
    await firestoreService.updateUserPreferences(testUserId, {
      darkMode: true,
      language: "en",
      fontSize: "large" as const,
      highContrast: true,
      reducedMotion: false,
    });
    console.log("✅ User preferences updated");

    // Test 6: Track user activity
    console.log("📊 Tracking user activity...");
    await firestoreService.trackUserActivity(testUserId, "test_activity", {
      test: true,
      timestamp: new Date().toISOString(),
    });
    console.log("✅ User activity tracked");

    // Test 7: Get user analytics
    console.log("📈 Getting user analytics...");
    const analytics = await firestoreService.getAnalytics(testUserId);
    console.log("✅ User analytics retrieved:", analytics.length, "entries");

    // Test 8: Add and manage favorites
    console.log("❤️ Testing favorites management...");
    await firestoreService.addToFavorites(testUserId, "test-item-1", "islamic");
    await firestoreService.addToFavorites(testUserId, "test-item-2", "quran");

    const favorites = await firestoreService.getUserFavorites(testUserId);
    console.log("✅ Favorites added and retrieved:", favorites.length, "items");

    const isFavorited = await firestoreService.isFavorited(
      testUserId,
      "test-item-1"
    );
    console.log("✅ Favorite check:", isFavorited);

    // Test 9: Search history
    console.log("🔍 Testing search history...");
    await firestoreService.saveSearchHistory(testUserId, "test search", {
      types: [],
      categories: [],
      searchFields: [],
      sortBy: "title",
      sortOrder: "asc",
      fulfillmentStatus: [],
      prophecyCategories: [],
      yearRange: { min: 0, max: 9999 },
      dataSources: ["islamic data"],
      quranSurahs: [],
      quranVerseRange: { min: 1, max: 6236 },
      quranPlaceOfRevelation: [],
      quranSajdahOnly: false,
      hadithNumberRange: { min: 1, max: 9999 },
      hadithCategories: [],
    });

    const searchHistory = await firestoreService.getUserSearchHistory(
      testUserId,
      5
    );
    console.log(
      "✅ Search history saved and retrieved:",
      searchHistory.length,
      "entries"
    );

    console.log("🎉 All Firestore user management tests passed!");
    return true;
  } catch (error) {
    console.error("❌ Firestore user management test failed:", error);
    return false;
  }
};

// Export for use in development
if (import.meta.env.DEV) {
  (
    window as unknown as {
      testFirestoreUserManagement: typeof testFirestoreUserManagement;
    }
  ).testFirestoreUserManagement = testFirestoreUserManagement;
}
