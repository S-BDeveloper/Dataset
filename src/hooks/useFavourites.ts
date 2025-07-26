import { useState, useEffect } from "react";
import type { IslamicFact } from "../types/Types";

// useFavourites manages the user's favourite facts (localStorage version, British spelling)
export function useFavourites() {
  const [favourites, setFavourites] = useState<IslamicFact[]>([]);

  // Load favourites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("favourites");
    if (stored) {
      try {
        setFavourites(JSON.parse(stored));
      } catch {
        setFavourites([]);
      }
    }
  }, []);

  // Persist favourites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  // Add a fact to favourites
  const addFavourite = (fact: IslamicFact) => {
    setFavourites((prev) =>
      prev.some((f) => f.Fact === fact.Fact && f.Source === fact.Source)
        ? prev
        : [...prev, fact]
    );
  };

  // Remove a fact from favourites
  const removeFavourite = (fact: IslamicFact) => {
    setFavourites((prev) =>
      prev.filter((f) => !(f.Fact === fact.Fact && f.Source === fact.Source))
    );
  };

  return { favourites, addFavourite, removeFavourite };
}
