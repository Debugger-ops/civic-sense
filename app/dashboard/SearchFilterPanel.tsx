'use client';
import React from 'react';
import './SearchFilterPanel.css';

interface SearchFilterPanelProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  filterPriority: string;
  onFilterPriorityChange: (value: string) => void;
  onClearFilters: () => void;
}

export function SearchFilterPanel({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  filterPriority,
  onFilterPriorityChange,
  onClearFilters
}: SearchFilterPanelProps) {
  return (
    <div className="search-filter-panel">
      <div className="panel-header">
        <span className="panel-title">🔍 Search & Filter</span>
      </div>

      <div className="panel-content">
        {/* Search Input */}
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search issues..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Filter Controls */}
        <div className="filter-controls">
          <select value={filterStatus} onChange={(e) => onFilterStatusChange(e.target.value)}>
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select value={filterPriority} onChange={(e) => onFilterPriorityChange(e.target.value)}>
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button className="clear-filters-btn" onClick={onClearFilters}>
            ❌ Clear Filters
          </button>
        </div>

        {/* Active Filter Indicators */}
        {(searchTerm || filterStatus !== 'all' || filterPriority !== 'all') && (
          <div className="active-filters">
            <span className="active-label">Active filters:</span>
            {searchTerm && <span className="filter-chip">Search: "{searchTerm}"</span>}
            {filterStatus !== 'all' && <span className="filter-chip">Status: {filterStatus}</span>}
            {filterPriority !== 'all' && <span className="filter-chip">Priority: {filterPriority}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
