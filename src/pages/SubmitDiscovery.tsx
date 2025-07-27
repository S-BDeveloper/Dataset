import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import type { QuranicMiracle } from "../types/Types";

interface SubmissionForm {
  title: string;
  notes: string;
  type: string;
  primary: string;
  verification: string;
  references: string[];
  submitterName: string;
  submitterEmail: string;
  additionalNotes: string;
}

const SubmitDiscovery: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [formData, setFormData] = useState<SubmissionForm>({
    title: "",
    notes: "",
    type: "",
    primary: "",
    verification: "",
    references: [],
    submitterName: user?.displayName || "",
    submitterEmail: user?.email || "",
    additionalNotes: "",
  });

  const miracleTypes = [
    "pair",
    "middle",
    "numerical",
    "structure",
    "linguistic",
    "prophecy",
    "scientific",
  ];

  const handleInputChange = (
    field: keyof SubmissionForm,
    value: string | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReferencesChange = (value: string) => {
    const references = value
      .split(",")
      .map((ref) => ref.trim())
      .filter((ref) => ref.length > 0);
    setFormData((prev) => ({
      ...prev,
      references,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.notes || !formData.type) {
        setToast("Please fill in all required fields");
        return;
      }

      // Create the submission object
      const submission: Partial<QuranicMiracle> = {
        title: formData.title,
        notes: formData.notes,
        type: formData.type as QuranicMiracle["type"],
        sources: {
          primary: formData.primary,
          verification: formData.verification,
          references: formData.references,
          methodology: "Community Submission",
          academic: "Pending Review",
        },
      };

      // Here you would typically save to your database
      // For now, we'll simulate a successful submission
      console.log("Submission:", submission);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setToast("Thank you! Your discovery has been submitted for review.");

      // Reset form
      setFormData({
        title: "",
        notes: "",
        type: "",
        primary: "",
        verification: "",
        references: [],
        submitterName: user?.displayName || "",
        submitterEmail: user?.email || "",
        additionalNotes: "",
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch {
      setToast("Error submitting discovery. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-green-700 dark:text-green-400 mb-4">
            Submit New Discovery
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400">
            Share your findings of Allah's miraculous signs with the community.
            All submissions will be reviewed for accuracy and quality.
          </p>
        </div>

        {/* Submission Form */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                Discovery Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                placeholder="e.g., The Mathematical Miracle of Surah Al-Fatiha"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                Miracle Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                required
              >
                <option value="">Select a type</option>
                {miracleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                Detailed Description *
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                placeholder="Describe the miracle in detail, including its significance and impact..."
                required
              />
            </div>

            {/* Primary Source */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                Primary Source
              </label>
              <input
                type="text"
                value={formData.primary}
                onChange={(e) => handleInputChange("primary", e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                placeholder="e.g., Quran 2:255, Sahih Bukhari, etc."
              />
            </div>

            {/* Verification Method */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                Verification Method
              </label>
              <input
                type="text"
                value={formData.verification}
                onChange={(e) =>
                  handleInputChange("verification", e.target.value)
                }
                className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                placeholder="e.g., Mathematical analysis, Historical verification, etc."
              />
            </div>

            {/* References */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                References (comma-separated)
              </label>
              <input
                type="text"
                value={formData.references.join(", ")}
                onChange={(e) => handleReferencesChange(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                placeholder="e.g., Dr. Rashad Khalifa, Dr. Maurice Bucaille, etc."
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.additionalNotes}
                onChange={(e) =>
                  handleInputChange("additionalNotes", e.target.value)
                }
                rows={3}
                className="w-full px-4 py-3 border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100"
                placeholder="Any additional context, personal insights, or related discoveries..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? "Submitting..." : "Submit Discovery"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-8 py-3 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Guidelines */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
          <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-400 mb-3">
            📋 Submission Guidelines
          </h3>
          <ul className="space-y-2 text-sm text-blue-600 dark:text-blue-300">
            <li>• Ensure accuracy and provide reliable sources</li>
            <li>
              • Focus on discoveries that showcase Allah's miraculous signs
            </li>
            <li>• Include specific references and verification methods</li>
            <li>• All submissions will be reviewed by our team</li>
            <li>• Approved discoveries will be added to the main database</li>
          </ul>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}
    </div>
  );
};

export default SubmitDiscovery;
