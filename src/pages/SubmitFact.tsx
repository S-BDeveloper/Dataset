import React, { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../contexts/useAuth";
import Button from "../components/Button";

const SubmitFact: React.FC = () => {
  const { user } = useAuth();
  const [fact, setFact] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    if (!fact || !source || !category || !status) {
      setLoading(false);
      setError("All fields are required");
      return;
    }
    if (!user) {
      setLoading(false);
      setError("You must be logged in to submit a fact.");
      return;
    }
    try {
      await addDoc(collection(db, "submissions"), {
        fact,
        source,
        category,
        status,
        userId: user.uid,
        submittedAt: serverTimestamp(),
      });
      setSuccess(true);
      setFact("");
      setSource("");
      setCategory("");
      setStatus("");
    } catch {
      setError("Failed to submit fact. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-700 mb-6">
        Submit a New Fact
      </h1>
      <form
        className="bg-white rounded-2xl shadow border border-stone-200 p-6 flex flex-col gap-5"
        onSubmit={handleSubmit}
        aria-label="Submit fact form"
      >
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-stone-700">Fact</span>
          <textarea
            value={fact}
            onChange={(e) => setFact(e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition text-sm text-stone-800 bg-stone-50"
            required
            rows={3}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-stone-700">Source</span>
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition text-sm text-stone-800 bg-stone-50"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-stone-700">Category</span>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition text-sm text-stone-800 bg-stone-50"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-stone-700">Status</span>
          <input
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-stone-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition text-sm text-stone-800 bg-stone-50"
            required
          />
        </label>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && (
          <div className="text-green-700 text-sm">
            Fact submitted for review!
          </div>
        )}
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="w-full !py-2 !text-lg mt-2"
        >
          Submit Fact
        </Button>
      </form>
    </main>
  );
};

export default SubmitFact;
