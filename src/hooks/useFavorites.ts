import { useState, useEffect } from "react";
import type { IslamicFact } from "../types/Types";
import { db } from "../firebase/config";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { useAuth } from "../contexts/useAuth";

// useFavorites manages the user's favorite facts in Firestore
export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<IslamicFact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load favorites from Firestore on mount or when user changes
  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    setLoading(true);
    const ref = doc(db, "favorites", user.uid);
    getDoc(ref)
      .then((snap) => {
        if (snap.exists()) {
          setFavorites(snap.data().facts || []);
        } else {
          setFavorites([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setFavorites([]);
        setLoading(false);
        setError("Failed to load favorites from Firestore");
      });
  }, [user]);

  // Add a fact to favorites in Firestore
  const addFavorite = async (fact: IslamicFact) => {
    if (!user) return;
    const ref = doc(db, "favorites", user.uid);
    try {
      await setDoc(ref, { facts: arrayUnion(fact) }, { merge: true });
      setFavorites((prev) =>
        prev.some((f) => f.Fact === fact.Fact && f.Source === fact.Source)
          ? prev
          : [...prev, fact]
      );
    } catch {
      setError("Failed to add favorite");
    }
  };

  // Remove a fact from favorites in Firestore
  const removeFavorite = async (fact: IslamicFact) => {
    if (!user) return;
    const ref = doc(db, "favorites", user.uid);
    try {
      await updateDoc(ref, { facts: arrayRemove(fact) });
      setFavorites((prev) =>
        prev.filter((f) => !(f.Fact === fact.Fact && f.Source === fact.Source))
      );
    } catch {
      setError("Failed to remove favorite");
    }
  };

  return { favorites, addFavorite, removeFavorite, loading, error };
}
