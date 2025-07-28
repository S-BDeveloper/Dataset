import React, { useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { useNavigate } from "react-router-dom";

interface Submission {
  id: string;
  title: string;
  type: string;
  submitterName: string;
  submitterEmail: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  notes: string;
}

const AdminReview: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: "1",
      title: "Mathematical Miracle in Surah Al-Fatiha",
      type: "numerical",
      submitterName: "Ahmed Hassan",
      submitterEmail: "ahmed@example.com",
      status: "pending",
      submittedAt: "2024-01-15T10:30:00Z",
      notes:
        "Discovered a fascinating numerical pattern in the opening chapter...",
    },
    {
      id: "2",
      title: "Linguistic Miracle in Quranic Verses",
      type: "linguistic",
      submitterName: "Fatima Ali",
      submitterEmail: "fatima@example.com",
      status: "approved",
      submittedAt: "2024-01-14T15:45:00Z",
      notes: "Analysis of word patterns and linguistic structures...",
    },
  ]);

  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  // Check if user is admin (you can implement your own admin logic)
  const isAdmin = user?.email === "admin@example.com";

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center">
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Access Denied
          </h2>
          <p className="text-stone-600 dark:text-stone-400 mb-6">
            You don't have permission to access the admin panel.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const handleStatusChange = (id: string, status: "approved" | "rejected") => {
    setSubmissions((prev) =>
      prev.map((sub) => (sub.id === id ? { ...sub, status } : sub))
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-stone-100 text-stone-800 dark:bg-stone-700 dark:text-stone-300";
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors duration-300">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-green-700 dark:text-green-400 mb-4">
            Content Review Panel
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
            Review and moderate community submissions for accuracy and quality.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-stone-800 rounded-xl p-6 shadow-lg border border-stone-200 dark:border-stone-700">
            <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Pending Review
            </h3>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {submissions.filter((s) => s.status === "pending").length}
            </p>
          </div>
          <div className="bg-white dark:bg-stone-800 rounded-xl p-6 shadow-lg border border-stone-200 dark:border-stone-700">
            <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Approved
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {submissions.filter((s) => s.status === "approved").length}
            </p>
          </div>
          <div className="bg-white dark:bg-stone-800 rounded-xl p-6 shadow-lg border border-stone-200 dark:border-stone-700">
            <h3 className="text-lg font-semibold text-stone-700 dark:text-stone-300 mb-2">
              Rejected
            </h3>
            <p className="text-3xl font-bold text-red-600 dark:text-red-400">
              {submissions.filter((s) => s.status === "rejected").length}
            </p>
          </div>
        </div>

        {/* Submissions List */}
        <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 overflow-hidden">
          <div className="p-6 border-b border-stone-200 dark:border-stone-700">
            <h2 className="text-2xl font-bold text-stone-700 dark:text-stone-300">
              Community Submissions
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-stone-50 dark:bg-stone-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Submission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Submitter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                {submissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="hover:bg-stone-50 dark:hover:bg-stone-700/50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-stone-900 dark:text-stone-100">
                          {submission.title}
                        </div>
                        <div className="text-sm text-stone-500 dark:text-stone-400">
                          {submission.notes.substring(0, 60)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {submission.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-stone-900 dark:text-stone-100">
                          {submission.submitterName}
                        </div>
                        <div className="text-sm text-stone-500 dark:text-stone-400">
                          {submission.submitterEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          submission.status
                        )}`}
                      >
                        {submission.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-stone-500 dark:text-stone-400">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedSubmission(submission)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                        >
                          View
                        </button>
                        {submission.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(submission.id, "approved")
                              }
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-sm font-medium"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(submission.id, "rejected")
                              }
                              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submission Detail Modal */}
        {selectedSubmission && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-stone-200 dark:border-stone-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-stone-700 dark:text-stone-300">
                    Submission Details
                  </h3>
                  <button
                    onClick={() => setSelectedSubmission(null)}
                    className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h4 className="font-semibold text-stone-700 dark:text-stone-300 mb-2">
                    Title
                  </h4>
                  <p className="text-stone-600 dark:text-stone-400">
                    {selectedSubmission.title}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-stone-700 dark:text-stone-300 mb-2">
                    Type
                  </h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                    {selectedSubmission.type}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-stone-700 dark:text-stone-300 mb-2">
                    Description
                  </h4>
                  <p className="text-stone-600 dark:text-stone-400">
                    {selectedSubmission.notes}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-stone-700 dark:text-stone-300 mb-2">
                    Submitter
                  </h4>
                  <p className="text-stone-600 dark:text-stone-400">
                    {selectedSubmission.submitterName} (
                    {selectedSubmission.submitterEmail})
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-stone-700 dark:text-stone-300 mb-2">
                    Submitted
                  </h4>
                  <p className="text-stone-600 dark:text-stone-400">
                    {new Date(selectedSubmission.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="p-6 border-t border-stone-200 dark:border-stone-700 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="px-4 py-2 text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                >
                  Close
                </button>
                {selectedSubmission.status === "pending" && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedSubmission.id, "approved");
                        setSelectedSubmission(null);
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleStatusChange(selectedSubmission.id, "rejected");
                        setSelectedSubmission(null);
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReview;
