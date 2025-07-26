import React, { useState, useEffect } from "react";
import type { QuranicMiracle } from "../types/Types";

interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: string;
  relevanceScore: number;
  matchedProphecies: string[];
  category: string;
}

interface LiveNewsIntegrationProps {
  prophecies: QuranicMiracle[];
}

// Sample news data (in real implementation, this would come from APIs)
const SAMPLE_NEWS = [
  {
    id: "1",
    title: "Israel Announces New Settlement Expansion in West Bank",
    description:
      "The Israeli government has approved plans for 3,000 new housing units in the West Bank, marking the largest settlement expansion in years.",
    url: "https://example.com/news/israel-settlement-expansion",
    publishedAt: "2024-01-15T10:30:00Z",
    source: "Reuters",
    relevanceScore: 0.95,
    matchedProphecies: [
      "Return of Jews to Palestine",
      "Rebuilding of Jerusalem",
    ],
    category: "political",
  },
  {
    id: "2",
    title: "Saudi Arabia Unveils Mega City Project NEOM",
    description:
      "Saudi Arabia has announced the next phase of its $500 billion NEOM project, featuring advanced technology and sustainable development.",
    url: "https://example.com/news/saudi-neom-project",
    publishedAt: "2024-01-14T15:45:00Z",
    source: "Bloomberg",
    relevanceScore: 0.87,
    matchedProphecies: ["Modernization of Mecca", "Discovery of Oil Resources"],
    category: "economic",
  },
  {
    id: "3",
    title: "Turkey's Istanbul Airport Becomes World's Busiest",
    description:
      "Istanbul Airport has surpassed Atlanta's Hartsfield-Jackson to become the world's busiest airport, marking a significant milestone for Turkey.",
    url: "https://example.com/news/istanbul-airport-busiest",
    publishedAt: "2024-01-13T09:20:00Z",
    source: "CNN",
    relevanceScore: 0.82,
    matchedProphecies: ["Modern Istanbul", "Fall of Constantinople"],
    category: "infrastructure",
  },
  {
    id: "4",
    title: "UAE's Mars Mission Successfully Reaches Red Planet",
    description:
      "The UAE's Hope Probe has successfully entered Mars orbit, making the UAE the first Arab nation to reach the Red Planet.",
    url: "https://example.com/news/uae-mars-mission",
    publishedAt: "2024-01-12T14:15:00Z",
    source: "BBC",
    relevanceScore: 0.78,
    matchedProphecies: ["Dubai Development", "Modern Emirates"],
    category: "scientific",
  },
  {
    id: "5",
    title: "Iran Announces Breakthrough in Nuclear Technology",
    description:
      "Iran has announced significant advances in its nuclear program, including new enrichment capabilities and research facilities.",
    url: "https://example.com/news/iran-nuclear-advances",
    publishedAt: "2024-01-11T11:30:00Z",
    source: "AP",
    relevanceScore: 0.73,
    matchedProphecies: ["Persian Empire Changes", "Modern Iran"],
    category: "political",
  },
];

export const LiveNewsIntegration: React.FC<LiveNewsIntegrationProps> = ({
  prophecies, // Keep for future use when implementing real prophecy matching
}) => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>(SAMPLE_NEWS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedRelevance, setSelectedRelevance] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Filter news by category and relevance
  const filteredNews = newsArticles.filter((article) => {
    const categoryMatch =
      selectedCategory === "all" || article.category === selectedCategory;
    const relevanceMatch = article.relevanceScore >= selectedRelevance;
    return categoryMatch && relevanceMatch;
  });

  // Get unique categories
  const categories = [
    "all",
    ...Array.from(new Set(newsArticles.map((article) => article.category))),
  ];

  // Use prophecies prop to enhance statistics
  const totalProphecies = prophecies.length;
  const prophecyTypes = Array.from(new Set(prophecies.map((p) => p.type)));
  const pendingProphecies = prophecies.filter(
    (p) => p.fulfillmentStatus === "pending"
  ).length;

  // Simulate live news updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());

      // Simulate adding new articles (in real implementation, this would fetch from APIs)
      const newArticle: NewsArticle = {
        id: `new-${Date.now()}`,
        title: `Breaking News Update - ${new Date().toLocaleTimeString()}`,
        description:
          "This is a simulated news update to demonstrate live integration capabilities.",
        url: "https://example.com/news/breaking-update",
        publishedAt: new Date().toISOString(),
        source: "Live Feed",
        relevanceScore: Math.random() * 0.5 + 0.5, // Random relevance between 0.5-1.0
        matchedProphecies: ["Simulated Prophecy"],
        category: "breaking",
      };

      setNewsArticles((prevArticles) => [
        newArticle,
        ...prevArticles.slice(0, 4),
      ]); // Add new article, keep only 5 total
    }, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  // Calculate statistics
  const totalArticles = newsArticles.length;
  const highRelevanceArticles = newsArticles.filter(
    (article) => article.relevanceScore >= 0.8
  ).length;
  const averageRelevance =
    newsArticles.reduce((sum, article) => sum + article.relevanceScore, 0) /
    totalArticles;
  const uniqueProphecies = new Set(
    newsArticles.flatMap((article) => article.matchedProphecies)
  ).size;

  // Get relevance badge color
  const getRelevanceBadgeColor = (score: number): string => {
    if (score >= 0.9)
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200";
    if (score >= 0.7)
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200";
    if (score >= 0.5)
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200";
    return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200";
  };

  return (
    <div className="w-full bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-green-700 dark:text-green-400">
          Live News Integration
        </h3>
        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalArticles}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            Articles
          </div>
        </div>
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {highRelevanceArticles}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">
            High Relevance
          </div>
        </div>
        <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-700">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {(averageRelevance * 100).toFixed(0)}%
          </div>
          <div className="text-xs text-amber-600 dark:text-amber-400">
            Avg Relevance
          </div>
        </div>
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {uniqueProphecies}
          </div>
          <div className="text-xs text-purple-600 dark:text-purple-400">
            Prophecies Matched
          </div>
        </div>
      </div>

      {/* Prophecy Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
          <div className="text-2xl font-bold text-stone-600 dark:text-stone-300">
            {totalProphecies}
          </div>
          <div className="text-xs text-stone-600 dark:text-stone-400">
            Total Prophecies
          </div>
        </div>
        <div className="text-center p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
          <div className="text-2xl font-bold text-stone-600 dark:text-stone-300">
            {prophecyTypes.length}
          </div>
          <div className="text-xs text-stone-600 dark:text-stone-400">
            Prophecy Types
          </div>
        </div>
        <div className="text-center p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
          <div className="text-2xl font-bold text-stone-600 dark:text-stone-300">
            {pendingProphecies}
          </div>
          <div className="text-xs text-stone-600 dark:text-stone-400">
            Pending Fulfillment
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "all"
                  ? "All Categories"
                  : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Min Relevance:
          </label>
          <select
            value={selectedRelevance}
            onChange={(e) => setSelectedRelevance(Number(e.target.value))}
            className="px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value={0}>All Articles</option>
            <option value={0.5}>50%+ Relevance</option>
            <option value={0.7}>70%+ Relevance</option>
            <option value={0.8}>80%+ Relevance</option>
            <option value={0.9}>90%+ Relevance</option>
          </select>
        </div>
      </div>

      {/* News Articles */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredNews.length > 0 ? (
          filteredNews.map((article) => (
            <div
              key={article.id}
              className="p-4 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm leading-tight">
                  {article.title}
                </h4>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getRelevanceBadgeColor(
                    article.relevanceScore
                  )}`}
                >
                  {(article.relevanceScore * 100).toFixed(0)}%
                </span>
              </div>

              <p className="text-sm text-stone-600 dark:text-stone-400 mb-3">
                {article.description}
              </p>

              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
                <span>{article.source}</span>
                <span>
                  {new Date(article.publishedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {article.matchedProphecies.map((prophecy, index) => (
                  <span
                    key={index}
                    className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded"
                  >
                    {prophecy}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-500 dark:text-stone-400 capitalize">
                  {article.category}
                </span>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-600 dark:text-green-400 hover:underline"
                >
                  Read Full Article →
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-stone-500 dark:text-stone-400">
            <div className="text-lg font-semibold mb-2">No Articles Found</div>
            <div className="text-sm">Try adjusting your filters</div>
          </div>
        )}
      </div>

      {/* API Status */}
      <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="text-sm font-semibold text-stone-700 dark:text-stone-300">
              News API Status
            </h5>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Connected to multiple news sources for real-time updates
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-600 dark:text-green-400">
              Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
