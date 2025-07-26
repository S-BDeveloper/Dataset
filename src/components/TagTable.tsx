import React, { useMemo, useState } from "react";
import type { IslamicFact } from "../types/Types";

interface TagTableProps {
  data: IslamicFact[];
}

const TagTable: React.FC<TagTableProps> = ({ data }) => {
  // Compute tag counts
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((fact) => {
      if (Array.isArray(fact.Tags)) {
        fact.Tags.forEach((tag) => {
          counts[tag] = (counts[tag] || 0) + 1;
        });
      }
    });
    return Object.entries(counts).map(([tag, count]) => ({ tag, count }));
  }, [data]);

  // State for sorting and filtering
  const [sortBy, setSortBy] = useState<"tag" | "count">("count");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filter, setFilter] = useState("");

  // Filter and sort tags
  const filteredTags = useMemo(() => {
    let tags = tagCounts;
    if (filter) {
      tags = tags.filter(({ tag }) =>
        tag.toLowerCase().includes(filter.toLowerCase())
      );
    }
    tags = [...tags].sort((a, b) => {
      if (sortBy === "tag") {
        return sortDir === "asc"
          ? a.tag.localeCompare(b.tag)
          : b.tag.localeCompare(a.tag);
      } else {
        return sortDir === "asc" ? a.count - b.count : b.count - a.count;
      }
    });
    return tags;
  }, [tagCounts, sortBy, sortDir, filter]);

  // Handlers
  const handleSort = (column: "tag" | "count") => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir(column === "count" ? "desc" : "asc");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Tags Table</h2>
      <input
        type="text"
        placeholder="Filter tags..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4 px-3 py-2 border border-stone-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th
                className="px-4 py-2 cursor-pointer text-left select-none"
                onClick={() => handleSort("tag")}
              >
                Tag {sortBy === "tag" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                className="px-4 py-2 cursor-pointer text-left select-none"
                onClick={() => handleSort("count")}
              >
                Count{" "}
                {sortBy === "count" ? (sortDir === "asc" ? "▲" : "▼") : ""}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTags.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-2 text-stone-400 italic text-center"
                >
                  No tags found
                </td>
              </tr>
            ) : (
              filteredTags.map(({ tag, count }) => (
                <tr key={tag}>
                  <td className="px-4 py-2 whitespace-nowrap">{tag}</td>
                  <td className="px-4 py-2">{count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TagTable;
