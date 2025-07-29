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
import { useAuth } from "./useContext";

// useFavorites manages the user's favorite Quranic miracles in Firestore
export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<QuranicMiracle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load favorites from Firestore on mount or when user changes
  useEffect(() => {
    if (!user) {
      // Fallback to localStorage when user is not authenticated
      try {
        const localFavorites = localStorage.getItem("localFavorites");
        if (localFavorites) {
          setFavorites(JSON.parse(localFavorites));
        } else {
          setFavorites([]);
        }
      } catch {
        setFavorites([]);
      }
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

  // Add a miracle to favorites
  const addFavorite = async (miracle: QuranicMiracle) => {
    if (!user) {
      // Use localStorage when not authenticated
      try {
        const localFavorites = JSON.parse(
          localStorage.getItem("localFavorites") || "[]"
        );
        const updatedFavorites = localFavorites.some(
          (m: QuranicMiracle) =>
            m.title === miracle.title && m.type === miracle.type
        )
          ? localFavorites
          : [...localFavorites, miracle];
        localStorage.setItem(
          "localFavorites",
          JSON.stringify(updatedFavorites)
        );
        setFavorites(updatedFavorites);
      } catch {
        setError("Failed to add favorite to local storage");
      }
      return;
    }

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

  // Remove a miracle from favorites
  const removeFavorite = async (miracle: QuranicMiracle) => {
    if (!user) {
      // Use localStorage when not authenticated
      try {
        const localFavorites = JSON.parse(
          localStorage.getItem("localFavorites") || "[]"
        );
        const updatedFavorites = localFavorites.filter(
          (m: QuranicMiracle) =>
            !(m.title === miracle.title && m.type === miracle.type)
        );
        localStorage.setItem(
          "localFavorites",
          JSON.stringify(updatedFavorites)
        );
        setFavorites(updatedFavorites);
      } catch {
        setError("Failed to remove favorite from local storage");
      }
      return;
    }

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
