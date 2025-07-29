import React, { useState } from "react";
import { useAuth } from "../hooks/useContext";
import Button from "../components/ui/AccessibleButton";
import Breadcrumb from "../components/common/Breadcrumb";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email] = useState(user?.email || "");
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Placeholder save handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
    // Add real update logic here
  };

  if (!user) {
    return (
      <main className="max-w-xl mx-auto px-4 py-8">
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow border border-stone-200 dark:border-stone-700 p-8 text-center text-green-700 dark:text-green-400">
          Please log in to view your profile.
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <Breadcrumb />
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-6">
        My Profile
      </h1>
      <form
        className="bg-white dark:bg-stone-800 rounded-2xl shadow border border-stone-200 dark:border-stone-700 p-6 flex flex-col gap-5"
        onSubmit={handleSave}
        aria-label="Profile form"
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
            Display Name
          </span>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="border border-stone-300 dark:border-stone-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition text-sm text-stone-800 dark:text-stone-100 bg-stone-50 dark:bg-stone-700"
            disabled={!editing}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-stone-700 dark:text-stone-300">
            Email
          </span>
          <input
            value={email}
            disabled
            className="border border-stone-200 dark:border-stone-600 rounded-lg px-3 py-2 bg-stone-100 dark:bg-stone-700 text-stone-500 dark:text-stone-400 text-sm cursor-not-allowed"
          />
        </label>
        {success && (
          <div className="text-green-700 dark:text-green-400 text-sm">
            Profile updated!
          </div>
        )}
        <div className="flex gap-3 mt-2">
          {editing ? (
            <>
              <Button type="submit" variant="primary" className="!px-4 !py-2">
                Save
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="!px-4 !py-2"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              type="button"
              variant="primary"
              className="!px-4 !py-2"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </div>
      </form>
    </main>
  );
};

export default Profile;

