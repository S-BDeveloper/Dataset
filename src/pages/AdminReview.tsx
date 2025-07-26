import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import Breadcrumb from "../components/Breadcrumb";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../contexts/useAuth";
import Button from "../components/Button";

interface Submission {
  id: string;
  fact: string;
  source: string;
  category: string;
  status: string;
  userId: string;
  submittedAt?: { seconds: number; nanoseconds: number };
}

const AdminReview: React.FC = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch submissions from Firestore
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getDocs(collection(db, "submissions"))
      .then((snapshot) => {
        const subs: Submission[] = [];
        snapshot.forEach((docSnap) => {
          subs.push({ id: docSnap.id, ...docSnap.data() } as Submission);
        });
        setSubmissions(subs);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load submissions.");
        setLoading(false);
      });
  }, [user]);

  // Approve submission: add to facts, remove from submissions
  const handleApprove = async (submission: Submission) => {
    try {
      await addDoc(collection(db, "facts"), {
        Fact: submission.fact,
        Source: submission.source,
        Category: submission.category,
        Status: submission.status,
        Notes: "",
        addedBy: submission.userId,
        addedAt: serverTimestamp(),
      });
      await deleteDoc(doc(db, "submissions", submission.id));
      setSubmissions((subs) => subs.filter((s) => s.id !== submission.id));
    } catch {
      setError("Failed to approve submission.");
    }
  };

  // Reject submission: remove from submissions
  const handleReject = async (id: string) => {
    try {
      await deleteDoc(doc(db, "submissions", id));
      setSubmissions((subs) => subs.filter((s) => s.id !== id));
    } catch {
      setError("Failed to delete submission.");
    }
  };

  if (loading) {
    return <div className="text-center mt-12 text-green-700">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-2xl shadow border text-center">
        Please log in as an admin.
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb />
      <h1 className="text-3xl font-bold text-green-700 mb-6">Content Review</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {submissions.length === 0 ? (
        <div className="bg-white rounded-2xl shadow border p-8 text-center text-green-700">
          No submissions to review.
        </div>
      ) : (
        <ul className="space-y-6">
          {submissions.map((sub) => (
            <li
              key={sub.id}
              className="bg-stone-50 rounded-2xl p-6 shadow border border-stone-200 flex flex-col gap-2"
            >
              <div className="text-lg font-semibold text-stone-700 mb-1">
                {sub.fact}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-stone-600">
                <span>
                  <span className="font-semibold">Source:</span> {sub.source}
                </span>
                <span>
                  <span className="font-semibold">Category:</span>{" "}
                  {sub.category}
                </span>
                <span>
                  <span className="font-semibold">Status:</span> {sub.status}
                </span>
              </div>
              <div className="flex gap-3 mt-3">
                <Button
                  variant="primary"
                  className="!px-4 !py-1.5"
                  onClick={() => handleApprove(sub)}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  className="!px-4 !py-1.5"
                  onClick={() => handleReject(sub.id)}
                >
                  Reject
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default AdminReview;
