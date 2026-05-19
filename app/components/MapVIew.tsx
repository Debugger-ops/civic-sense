'use client';

import { useState, useEffect } from "react";
import type { Issue } from "../types/Issue";
import { MapPin, Search, Settings, Filter } from "lucide-react";
import "./MapView.css";

interface MapViewProps {
  issues: Issue[];
  onViewDetails: (issue: Issue) => void;
  onCreateIssue?: (location: { lat: number; lng: number }) => void;
}

const statusColors: Record<string, string> = {
  open: "#ef4444",
  "in-progress": "#f59e0b",
  resolved: "#10b981",
  closed: "#6b7280",
};

const priorityEmoji: Record<string, string> = {
  urgent: "🔴",
  high: "🟠",
  medium: "🟡",
  low: "🟢",
};

export function MapView({ issues, onViewDetails, onCreateIssue }: MapViewProps) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [MapComponents, setMapComponents] = useState<any>(null);

  // Dynamically import Leaflet only on the client (avoids SSR issues)
  useEffect(() => {
    import("react-leaflet").then((mod) => {
      setMapComponents(mod);
    });
  }, []);

  const filteredIssues = issues.filter((issue) => {
    const statusMatch = filterStatus === "all" || issue.status === filterStatus;
    const searchMatch =
      searchQuery === "" ||
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  if (!MapComponents) {
    return (
      <div className="loading-map">
        <div className="loading-spinner" />
        <p>Loading Map...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, CircleMarker, Popup } = MapComponents;

  return (
    <div className="map-view-container">
      {/* Sidebar */}
      {showSidebar && (
        <div className="map-sidebar visible">
          <div className="sidebar-header">
            <div className="header-content">
              <MapPin className="header-icon" />
              <h3>Map Controls</h3>
            </div>
            <button onClick={() => setShowSidebar(false)} className="toggle-btn">×</button>
          </div>

          <div className="sidebar-content">
            <div className="control-group">
              <label>Search Issues</label>
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by title, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="control-group">
              <label>Status Filter</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="control-group">
              <label>Statistics</label>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-number">{filteredIssues.length}</span>
                  <span className="stat-label">Total</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {filteredIssues.filter((i) => i.status === "open").length}
                  </span>
                  <span className="stat-label">Open</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">
                    {filteredIssues.filter((i) => i.status === "resolved").length}
                  </span>
                  <span className="stat-label">Resolved</span>
                </div>
              </div>
            </div>

            <div className="control-group">
              <label>Legend</label>
              <div className="legend-items">
                {Object.entries(statusColors).map(([status, color]) => (
                  <div key={status} className="legend-item">
                    <div className="legend-color" style={{ backgroundColor: color }} />
                    <span style={{ textTransform: "capitalize" }}>{status.replace("-", " ")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!showSidebar && (
        <button className="sidebar-toggle" onClick={() => setShowSidebar(true)}>
          <Settings className="toggle-icon" />
        </button>
      )}

      {/* Map */}
      <div className="map-container">
        <div className="map-card" style={{ height: "600px" }}>
          <MapContainer
            center={[28.6315, 77.2167]}
            zoom={12}
            style={{ width: "100%", height: "100%", borderRadius: "12px" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredIssues.map((issue) => (
              <CircleMarker
                key={issue.id}
                center={[issue.lat, issue.lng]}
                radius={10}
                pathOptions={{
                  fillColor: statusColors[issue.status] || "#6b7280",
                  fillOpacity: 0.85,
                  color: "#ffffff",
                  weight: 2,
                }}
                eventHandlers={{
                  click: () => setSelectedIssue(issue),
                }}
              >
                <Popup>
                  <div className="info-window">
                    <div className="info-header">
                      <strong>{priorityEmoji[issue.priority] || "📍"} {issue.title}</strong>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: statusColors[issue.status], color: "#fff", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", marginLeft: "6px" }}
                      >
                        {issue.status}
                      </span>
                    </div>
                    <p style={{ margin: "4px 0", fontSize: "12px", color: "#555" }}>
                      📍 {issue.location}
                    </p>
                    <p style={{ margin: "4px 0", fontSize: "12px" }}>
                      {issue.description.substring(0, 80)}...
                    </p>
                    <p style={{ margin: "4px 0", fontSize: "11px", color: "#888" }}>
                      👍 {issue.votes} votes · 📅 {new Date(issue.reportedAt).toLocaleDateString()}
                    </p>
                    <button
                      onClick={() => onViewDetails(issue)}
                      className="details-btn"
                      style={{ marginTop: "8px", padding: "4px 12px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                    >
                      View Details
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
