import React, { useState } from "react";
import type { QuranicMiracle } from "../types/Types";

interface Alert {
  id: string;
  type: "news" | "academic" | "user_contribution" | "fulfillment";
  title: string;
  description: string;
  prophecyId: string;
  prophecyTitle: string;
  timestamp: Date;
  priority: "low" | "medium" | "high" | "critical";
  read: boolean;
  source: string;
  evidence: string;
}

interface AutomatedAlertsProps {
  prophecies: QuranicMiracle[];
}

// Sample alerts data
const SAMPLE_ALERTS: Alert[] = [
  {
    id: "1",
    type: "news",
    title: "New Evidence: Israel Settlement Expansion",
    description:
      "Recent news articles suggest fulfillment of 'Return of Jews to Palestine' prophecy",
    prophecyId: "prophecy_001",
    prophecyTitle: "Return of Jews to Palestine",
    timestamp: new Date("2024-01-15T10:30:00Z"),
    priority: "high",
    read: false,
    source: "Reuters",
    evidence:
      "Israeli government approved 3,000 new housing units in West Bank",
  },
  {
    id: "2",
    type: "academic",
    title: "Academic Study: Prophecy Fulfillment Patterns",
    description:
      "New research paper analyzes historical patterns of Islamic prophecy fulfillment",
    prophecyId: "prophecy_002",
    prophecyTitle: "Rebuilding of Jerusalem",
    timestamp: new Date("2024-01-14T15:45:00Z"),
    priority: "medium",
    read: false,
    source: "Journal of Islamic Studies",
    evidence:
      "Statistical analysis shows 87% accuracy rate in historical prophecies",
  },
  {
    id: "3",
    type: "user_contribution",
    title: "User Contribution: New Prophecy Evidence",
    description:
      "Community member submitted evidence for 'Modernization of Mecca' prophecy",
    prophecyId: "prophecy_003",
    prophecyTitle: "Modernization of Mecca",
    timestamp: new Date("2024-01-13T09:20:00Z"),
    priority: "low",
    read: true,
    source: "Community Member",
    evidence: "Photographic evidence of new construction projects around Kaaba",
  },
  {
    id: "4",
    type: "fulfillment",
    title: "Prophecy Fulfilled: Dubai Development",
    description:
      "Strong evidence suggests 'Dubai Development' prophecy has been fulfilled",
    prophecyId: "prophecy_004",
    prophecyTitle: "Dubai Development",
    timestamp: new Date("2024-01-12T14:15:00Z"),
    priority: "critical",
    read: false,
    source: "Multiple Sources",
    evidence: "UAE Mars mission success and economic growth indicators",
  },
  {
    id: "5",
    type: "news",
    title: "Breaking: Turkey Infrastructure Milestone",
    description:
      "Istanbul Airport becomes world's busiest, supporting 'Modern Istanbul' prophecy",
    prophecyId: "prophecy_005",
    prophecyTitle: "Modern Istanbul",
    timestamp: new Date("2024-01-11T11:30:00Z"),
    priority: "high",
    read: false,
    source: "CNN",
    evidence:
      "Airport traffic data confirms Istanbul's global transportation hub status",
  },
];

export const AutomatedAlerts: React.FC<AutomatedAlertsProps> = ({
  prophecies,
}) => {
  const [alerts, setAlerts] = useState<Alert[]>(SAMPLE_ALERTS);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [showRead, setShowRead] = useState<boolean>(true);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    sms: false,
    frequency: "immediate" as "immediate" | "daily" | "weekly",
  });

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    const typeMatch = selectedType === "all" || alert.type === selectedType;
    const priorityMatch =
      selectedPriority === "all" || alert.priority === selectedPriority;
    const readMatch = showRead || !alert.read;
    return typeMatch && priorityMatch && readMatch;
  });

  // Calculate statistics
  const totalAlerts = alerts.length;
  const unreadAlerts = alerts.filter((alert) => !alert.read).length;
  const criticalAlerts = alerts.filter(
    (alert) => alert.priority === "critical"
  ).length;
  const highPriorityAlerts = alerts.filter(
    (alert) => alert.priority === "high"
  ).length;

  // Use prophecies prop to enhance statistics
  const totalProphecies = prophecies.length;
  const pendingProphecies = prophecies.filter(
    (p) => p.fulfillmentStatus === "pending"
  ).length;
  const fulfilledProphecies = prophecies.filter(
    (p) => p.fulfillmentStatus === "fulfilled"
  ).length;

  // Mark alert as read
  const markAsRead = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })));
  };

  // Get priority color
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "critical":
        return "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30";
      case "high":
        return "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30";
      case "medium":
        return "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30";
      case "low":
        return "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30";
      default:
        return "text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-900/30";
    }
  };

  // Get type icon
  const getTypeIcon = (type: string): string => {
    switch (type) {
      case "news":
        return "📰";
      case "academic":
        return "🎓";
      case "user_contribution":
        return "👥";
      case "fulfillment":
        return "✅";
      default:
        return "🔔";
    }
  };

  return (
    <div className="w-full bg-white dark:bg-stone-800 rounded-2xl shadow-lg border border-stone-200 dark:border-stone-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-green-700 dark:text-green-400">
          Automated Alerts
        </h3>
        <div className="flex items-center gap-2">
          {unreadAlerts > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadAlerts} new
            </span>
          )}
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {totalAlerts}
          </div>
          <div className="text-xs text-green-600 dark:text-green-400">
            Total Alerts
          </div>
        </div>
        <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {criticalAlerts}
          </div>
          <div className="text-xs text-red-600 dark:text-red-400">Critical</div>
        </div>
        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {highPriorityAlerts}
          </div>
          <div className="text-xs text-orange-600 dark:text-orange-400">
            High Priority
          </div>
        </div>
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {unreadAlerts}
          </div>
          <div className="text-xs text-blue-600 dark:text-blue-400">Unread</div>
        </div>
      </div>

      {/* Prophecy Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            {pendingProphecies}
          </div>
          <div className="text-xs text-stone-600 dark:text-stone-400">
            Pending Fulfillment
          </div>
        </div>
        <div className="text-center p-3 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
          <div className="text-2xl font-bold text-stone-600 dark:text-stone-300">
            {fulfilledProphecies}
          </div>
          <div className="text-xs text-stone-600 dark:text-stone-400">
            Fulfilled
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Type:
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Types</option>
            <option value="news">News</option>
            <option value="academic">Academic</option>
            <option value="user_contribution">User Contribution</option>
            <option value="fulfillment">Fulfillment</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Priority:
          </label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
            <input
              type="checkbox"
              checked={showRead}
              onChange={(e) => setShowRead(e.target.checked)}
              className="rounded border-stone-300 dark:border-stone-600"
            />
            Show Read
          </label>
        </div>
        <div className="flex items-end">
          <button
            onClick={markAllAsRead}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition-all ${
                alert.read
                  ? "bg-stone-50 dark:bg-stone-700 border-stone-200 dark:border-stone-600"
                  : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTypeIcon(alert.type)}</span>
                  <h4 className="font-semibold text-stone-900 dark:text-stone-100 text-sm">
                    {alert.title}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                      alert.priority
                    )}`}
                  >
                    {alert.priority.toUpperCase()}
                  </span>
                  {!alert.read && (
                    <button
                      onClick={() => markAsRead(alert.id)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-stone-600 dark:text-stone-400 mb-2">
                {alert.description}
              </p>

              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
                <span>Prophecy: {alert.prophecyTitle}</span>
                <span>{alert.timestamp.toLocaleDateString()}</span>
              </div>

              <div className="text-xs text-stone-500 dark:text-stone-400 mb-2">
                <strong>Source:</strong> {alert.source}
              </div>

              <div className="text-xs text-stone-600 dark:text-stone-400 bg-stone-100 dark:bg-stone-600 p-2 rounded">
                <strong>Evidence:</strong> {alert.evidence}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-stone-500 dark:text-stone-400">
            <div className="text-lg font-semibold mb-2">No Alerts Found</div>
            <div className="text-sm">Try adjusting your filters</div>
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="mt-6 p-4 bg-stone-50 dark:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-600">
        <h5 className="text-sm font-semibold text-stone-700 dark:text-stone-300 mb-3">
          Notification Settings
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
              <input
                type="checkbox"
                checked={notificationSettings.email}
                onChange={(e) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    email: e.target.checked,
                  }))
                }
                className="rounded border-stone-300 dark:border-stone-600"
              />
              Email Notifications
            </label>
            <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
              <input
                type="checkbox"
                checked={notificationSettings.push}
                onChange={(e) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    push: e.target.checked,
                  }))
                }
                className="rounded border-stone-300 dark:border-stone-600"
              />
              Push Notifications
            </label>
            <label className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
              <input
                type="checkbox"
                checked={notificationSettings.sms}
                onChange={(e) =>
                  setNotificationSettings((prev) => ({
                    ...prev,
                    sms: e.target.checked,
                  }))
                }
                className="rounded border-stone-300 dark:border-stone-600"
              />
              SMS Notifications
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
              Update Frequency:
            </label>
            <select
              value={notificationSettings.frequency}
              onChange={(e) =>
                setNotificationSettings((prev) => ({
                  ...prev,
                  frequency: e.target.value as "immediate" | "daily" | "weekly",
                }))
              }
              className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="immediate">Immediate</option>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Summary</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
