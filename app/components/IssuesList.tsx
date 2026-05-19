'use client';

import { useState, useMemo } from 'react';
import { IssueCard} from './IssueCard';
import type { Issue } from '../types/Issue';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Search, 
  Filter, 
  SortDesc, 
  X, 
  Layers3, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  XCircle
} from 'lucide-react';
import './IssuesList.css';

interface IssuesListProps {
  issues: Issue[];
  onVote: (issueId: string) => void;
  onViewDetails: (issue: Issue) => void;
}

const statusIcons = {
  open: AlertCircle,
  'in-progress': PlayCircle,
  resolved: CheckCircle2,
  closed: XCircle
};

export function IssuesList({ issues, onVote, onViewDetails }: IssuesListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const categories = [
    'Road & Transportation',
    'Lighting & Electrical',
    'Parks & Recreation',
    'Waste Management',
    'Water & Utilities',
    'Public Safety',
    'Building & Infrastructure',
    'Environmental',
    'Other'
  ];

  const priorities = ['low', 'medium', 'high', 'urgent', 'critical'];
  const statuses = ['open', 'in-progress', 'resolved', 'closed'];

  const filteredAndSortedIssues = useMemo(() => {
    return issues
      .filter(issue => {
        const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             issue.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
        const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
        const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
        
        return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'votes':
            return b.votes - a.votes;
          case 'priority':
            const priorityOrder = { critical: 5, urgent: 4, high: 3, medium: 2, low: 1 };
            return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
          case 'oldest':
            return new Date(a.reportedAt).getTime() - new Date(b.reportedAt).getTime();
          case 'recent':
          default:
            return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
        }
      });
  }, [issues, searchTerm, statusFilter, categoryFilter, priorityFilter, sortBy]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setPriorityFilter('all');
    setSortBy('recent');
  };

  const hasActiveFilters = searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all' || sortBy !== 'recent';

  const getStatusStats = () => {
    return statuses.map(status => {
      const count = issues.filter(issue => issue.status === status).length;
      const Icon = statusIcons[status as keyof typeof statusIcons];
      return { status, count, Icon };
    });
  };

  return (
    <div className="issues-list-container">
      {/* Header Section */}
      <div className="issues-header">
        <div className="header-content">
          <div className="header-text">
            <h2 className="issues-title">Community Issues</h2>
            <p className="issues-subtitle">
              Track and manage community-reported issues in your area
            </p>
          </div>
          
          <div className="status-stats">
            {getStatusStats().map(({ status, count, Icon }) => (
              <div key={status} className={`stat-card status-${status}`}>
                <Icon className="stat-icon" />
                <div className="stat-content">
                  <span className="stat-number">{count}</span>
                  <span className="stat-label">{status.replace('-', ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <div className="filters-header">
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <Input
                placeholder="Search by title, description, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="clear-search-btn"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="filter-actions">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="clear-filters-btn"
              >
                <X className="w-4 h-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>
        
        <div className="filters-grid">
          <div className="filter-group">
            <label className="filter-label">
              <Filter className="w-4 h-4" />
              Status
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="filter-select">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => {
                  const Icon = statusIcons[status as keyof typeof statusIcons];
                  const count = issues.filter(issue => issue.status === status).length;
                  return (
                    <SelectItem key={status} value={status}>
                      <div className="select-item-content">
                        <Icon className="w-4 h-4" />
                        <span>{status.replace('-', ' ')}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {count}
                        </Badge>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">
              <Layers3 className="w-4 h-4" />
              Category
            </label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="filter-select">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => {
                  const count = issues.filter(issue => issue.category === category).length;
                  return (
                    <SelectItem key={category} value={category}>
                      <div className="select-item-content">
                        <span>{category}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {count}
                        </Badge>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">
              <AlertCircle className="w-4 h-4" />
              Priority
            </label>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="filter-select">
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {priorities.map((priority) => {
                  const count = issues.filter(issue => issue.priority === priority).length;
                  return (
                    <SelectItem key={priority} value={priority}>
                      <div className="select-item-content">
                        <span className={`priority-dot priority-${priority}`}></span>
                        <span>{priority}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {count}
                        </Badge>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <div className="filter-group">
            <label className="filter-label">
              <SortDesc className="w-4 h-4" />
              Sort By
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="filter-select">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">
                  <div className="select-item-content">
                    <Clock className="w-4 h-4" />
                    <span>Most Recent</span>
                  </div>
                </SelectItem>
                <SelectItem value="oldest">
                  <div className="select-item-content">
                    <Clock className="w-4 h-4" />
                    <span>Oldest First</span>
                  </div>
                </SelectItem>
                <SelectItem value="votes">
                  <div className="select-item-content">
                    <TrendingUp className="w-4 h-4" />
                    <span>Most Votes</span>
                  </div>
                </SelectItem>
                <SelectItem value="priority">
                  <div className="select-item-content">
                    <AlertCircle className="w-4 h-4" />
                    <span>Highest Priority</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="filters-footer">
          <div className="results-info">
            <p className="results-count">
              <strong>{filteredAndSortedIssues.length}</strong> of <strong>{issues.length}</strong> issues
            </p>
            {hasActiveFilters && (
              <div className="active-filters">
                {searchTerm && (
                  <Badge variant="secondary" className="filter-badge">
                    Search: "{searchTerm}"
                    <button onClick={() => setSearchTerm('')} className="filter-badge-remove">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {statusFilter !== 'all' && (
                  <Badge variant="secondary" className="filter-badge">
                    Status: {statusFilter.replace('-', ' ')}
                    <button onClick={() => setStatusFilter('all')} className="filter-badge-remove">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {categoryFilter !== 'all' && (
                  <Badge variant="secondary" className="filter-badge">
                    Category: {categoryFilter}
                    <button onClick={() => setCategoryFilter('all')} className="filter-badge-remove">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {priorityFilter !== 'all' && (
                  <Badge variant="secondary" className="filter-badge">
                    Priority: {priorityFilter}
                    <button onClick={() => setPriorityFilter('all')} className="filter-badge-remove">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Issues Grid */}
      {filteredAndSortedIssues.length === 0 ? (
        <div className="no-results">
          <div className="no-results-content">
            <div className="no-results-icon-container">
              {searchTerm || hasActiveFilters ? (
                <Filter className="no-results-icon" />
              ) : (
                <Layers3 className="no-results-icon" />
              )}
            </div>
            <h3 className="no-results-title">
              {searchTerm || hasActiveFilters ? 'No matching issues found' : 'No issues yet'}
            </h3>
            <p className="no-results-text">
              {searchTerm || hasActiveFilters 
                ? 'Try adjusting your search terms or filters to find what you\'re looking for.'
                : 'Be the first to report an issue in your community!'
              }
            </p>
            {hasActiveFilters && (
              <Button onClick={clearAllFilters} className="clear-all-btn">
                Clear All Filters
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="issues-grid">
          {filteredAndSortedIssues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onVote={onVote}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}