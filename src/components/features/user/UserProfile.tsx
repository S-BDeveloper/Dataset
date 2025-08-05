import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { firestoreService } from "../../../firebase/firestore";
import { authService } from "../../../firebase/auth";
import type { User } from "../../../types/Types";

interface UserProfileProps {
  className?: string;
}

export const UserProfile: React.FC<UserProfileProps> = ({ className = "" }) => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    preferences: {
      darkMode: false,
      language: "en",
      fontSize: "medium" as "small" | "medium" | "large",
      highContrast: false,
      reducedMotion: false,
    },
  });

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return;

      try {
        setIsLoading(true);
        const userProfile = await firestoreService.getUserProfile(user.uid);
        if (userProfile) {
          setProfile(userProfile);
          setFormData({
            displayName: userProfile.displayName || "",
            email: userProfile.email,
            preferences: userProfile.preferences,
          });
        }
      } catch (err) {
        setError("Failed to load profile");
        console.error("Profile load error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user?.uid]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    try {
      setIsLoading(true);
      setError(null);

      // Update user profile in Firestore
      await firestoreService.updateUserProfile(user.uid, {
        displayName: formData.displayName,
        preferences: formData.preferences,
        lastActive: new Date(),
      });

      // Update Firebase Auth profile
      await authService.updateUserProfile({
        displayName: formData.displayName,
      });

      setSuccess("Profile updated successfully!");
      setIsEditing(false);

      // Reload profile
      const updatedProfile = await firestoreService.getUserProfile(user.uid);
      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    } catch (err) {
      setError("Failed to update profile");
      console.error("Profile update error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle preference change
  const handlePreferenceChange = (
    key: keyof User["preferences"],
    value: boolean | string
  ) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value,
      },
    }));
  };

  if (loading || isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <p className="text-gray-600">Please sign in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className={`max-w-2xl mx-auto p-6 ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Profile
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Basic Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    displayName: e.target.value,
                  }))
                }
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Preferences
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="darkMode"
                  checked={formData.preferences.darkMode}
                  onChange={(e) =>
                    handlePreferenceChange("darkMode", e.target.checked)
                  }
                  disabled={!isEditing}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="darkMode"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Dark Mode
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="highContrast"
                  checked={formData.preferences.highContrast}
                  onChange={(e) =>
                    handlePreferenceChange("highContrast", e.target.checked)
                  }
                  disabled={!isEditing}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="highContrast"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  High Contrast
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reducedMotion"
                  checked={formData.preferences.reducedMotion}
                  onChange={(e) =>
                    handlePreferenceChange("reducedMotion", e.target.checked)
                  }
                  disabled={!isEditing}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="reducedMotion"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Reduced Motion
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Language
              </label>
              <select
                value={formData.preferences.language}
                onChange={(e) =>
                  handlePreferenceChange("language", e.target.value)
                }
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
                <option value="ur">اردو</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Font Size
              </label>
              <select
                value={formData.preferences.fontSize}
                onChange={(e) =>
                  handlePreferenceChange("fontSize", e.target.value)
                }
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Account Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Member Since:
                </span>
                <p className="text-gray-900 dark:text-white">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              <div>
                <span className="text-gray-500 dark:text-gray-400">
                  Last Active:
                </span>
                <p className="text-gray-900 dark:text-white">
                  {profile?.lastActive
                    ? new Date(profile.lastActive).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          {isEditing && (
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
