import { useState, useEffect } from "react";
import type { QuranicMiracle } from "../types/Types";
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

// useFavorites manages the user's favorite Quranic miracles in Firestore
export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<QuranicMiracle[]>([]);
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
          setFavorites(snap.data().miracles || []);
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

  // Add a miracle to favorites in Firestore
  const addFavorite = async (miracle: QuranicMiracle) => {
    if (!user) return;
    const ref = doc(db, "favorites", user.uid);
    try {
      await setDoc(ref, { miracles: arrayUnion(miracle) }, { merge: true });
      setFavorites((prev) =>
        prev.some((m) => m.title === miracle.title && m.type === miracle.type)
          ? prev
          : [...prev, miracle]
      );
    } catch {
      setError("Failed to add favorite");
    }
  };

  // Remove a miracle from favorites in Firestore
  const removeFavorite = async (miracle: QuranicMiracle) => {
    if (!user) return;
    const ref = doc(db, "favorites", user.uid);
    try {
      await updateDoc(ref, { miracles: arrayRemove(miracle) });
      setFavorites((prev) =>
        prev.filter(
          (m) => !(m.title === miracle.title && m.type === miracle.type)
        )
      );
    } catch {
      setError("Failed to remove favorite");
    }
  };

  return { favorites, addFavorite, removeFavorite, loading, error };
}
