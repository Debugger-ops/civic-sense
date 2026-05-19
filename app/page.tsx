'use client';
import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import HomePage from "./components/HomePage";
import ReportIssueForm from './report/ReportIssueForm';
import { IssuesList } from './components/IssuesList';
import { MapView } from './components/MapVIew';
import { AdminDashboard } from './dashboard/page';
import { IssueDetails } from './components/IssueDetails';
import { AIAssistant } from './components/AIAssistant';
import { Leaderboard } from './components/Leaderboard';
import type { Issue } from './types/Issue';
import { Toaster } from './components/ui/sonner';
import './page.css';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const [issues, setIssues] = useState<Issue[]>([
    {
      id: '1',
      title: 'Large pothole on Main Street',
      description: 'There is a significant pothole near the intersection of Main Street and 5th Avenue that poses a safety risk to vehicles and cyclists. The hole is approximately 2 feet wide and 6 inches deep.',
      category: 'Road & Transportation',
      status: 'open',
      priority: 'high',
      location: 'Main Street & 5th Avenue',
      image: 'https://images.unsplash.com/photo-1469510090920-fd33379d1f7c?w=400',
      votes: 23,
      comments: ["Needs urgent fix", "This is dangerous"],
      reportedAt: '2024-01-15T08:30:00Z',
      reportedBy: 'Shivam Mittal',
      lat: 28.6315,
      lng: 77.2167
    },
    {
      id: '2',
      title: 'Broken streetlight on Oak Avenue',
      description: 'The streetlight on Oak Avenue near the library has been out for several days, creating a safety concern for pedestrians walking at night.',
      category: 'Lighting & Electrical',
      status: 'in-progress',
      priority: 'medium',
      location: 'Oak Avenue near Library',
      image: 'https://images.unsplash.com/photo-1695236200077-f61c1450f21a?w=400',
      votes: 18,
      comments: ["Needs urgent fix"],
      reportedAt: '2024-01-14T16:45:00Z',
      reportedBy: 'Aniket Singh',
      lat: 28.5494,
      lng: 77.2001
    },
    {
      id: '3',
      title: 'Graffiti on community center wall',
      description: 'Large graffiti tags have appeared on the side wall of the community center. The artwork is inappropriate and should be removed.',
      category: 'Public Safety',
      status: 'resolved',
      priority: 'low',
      location: 'Community Center, West Wall',
      image: 'https://images.unsplash.com/photo-1611063158871-7dd3ed4a2ac8?w=400',
      votes: 12,
      comments: ["Needs urgent fix"],
      reportedAt: '2024-01-12T10:20:00Z',
      reportedBy: 'Anmol Dutt',
      lat: 28.6210,
      lng: 77.0870
    },
    {
      id: '4',
      title: 'Overgrown vegetation blocking sidewalk',
      description: 'Bushes and trees have grown over the sidewalk on Elm Street, making it difficult for pedestrians to pass safely.',
      category: 'Parks & Recreation',
      status: 'open',
      priority: 'medium',
      location: 'Elm Street between 2nd and 3rd Street',
      image: 'https://images.unsplash.com/photo-1667567704975-404eb834f857?w=400',
      votes: 15,
      comments: ["Needs urgent fix"],
      reportedAt: '2024-01-13T14:15:00Z',
      reportedBy: 'Meera Rajput',
      lat: 28.6392,
      lng: 77.2927
    },
    {
      id: '5',
      title: 'Overflowing garbage bin near market',
      description: 'The public garbage bin near the weekly market has been overflowing for 3 days. It is causing foul smell and attracting stray animals.',
      category: 'Waste Management',
      status: 'open',
      priority: 'urgent',
      location: 'Lajpat Nagar Market, Gate 2',
      votes: 41,
      comments: ["Health hazard!", "Please fix ASAP"],
      reportedAt: '2024-01-16T09:00:00Z',
      reportedBy: 'Sunita Verma',
      lat: 28.5677,
      lng: 77.2432
    },
    {
      id: '6',
      title: 'Water leakage from municipal pipe',
      description: 'A municipal water pipe has been leaking for 5 days near Gandhi Chowk. Significant water is being wasted daily.',
      category: 'Utilities',
      status: 'in-progress',
      priority: 'high',
      location: 'Gandhi Chowk, Sector 14',
      votes: 35,
      comments: ["Please fix urgently", "Water wastage"],
      reportedAt: '2024-01-11T07:30:00Z',
      reportedBy: 'Rajesh Kumar',
      lat: 28.6100,
      lng: 77.3200
    },
  ]);

  const handleReportIssue = (issueData: any) => {
    setIssues([issueData, ...issues]);
    setCurrentView('browse');
  };

  const handleVote = (issueId: string) => {
    setIssues(issues.map((issue) =>
      issue.id === issueId ? { ...issue, votes: issue.votes + 1 } : issue
    ));
  };

  const handleViewDetails = (issue: Issue) => {
    setSelectedIssue(issue);
    setCurrentView('details');
  };

  const handleUpdateIssueStatus = (issueId: string, status: string, note?: string) => {
    setIssues(issues.map((issue) =>
      issue.id === issueId ? { ...issue, status: status as Issue['status'] } : issue
    ));
  };

  const handleBackFromDetails = () => {
    setSelectedIssue(null);
    setCurrentView('browse');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomePage
            issues={issues}
            onViewChange={setCurrentView}
            onViewDetails={handleViewDetails}
          />
        );
      case 'report':
        return <ReportIssueForm onSubmit={handleReportIssue} />;
      case 'browse':
        return (
          <IssuesList
            issues={issues}
            onVote={handleVote}
            onViewDetails={handleViewDetails}
          />
        );
      case 'map':
        return <MapView issues={issues} onViewDetails={handleViewDetails} />;
      case 'admin':
        return (
          <AdminDashboard
            issues={issues}
            onUpdateIssueStatus={handleUpdateIssueStatus}
          />
        );
      case 'details':
        return selectedIssue ? (
          <IssueDetails
            issue={selectedIssue}
            onBack={handleBackFromDetails}
            onVote={handleVote}
          />
        ) : null;
      case 'assistant':
        return <AIAssistant issues={issues} onViewChange={setCurrentView} />;
      case 'leaderboard':
        return <Leaderboard issues={issues} />;
      default:
        return (
          <HomePage
            issues={issues}
            onViewChange={setCurrentView}
            onViewDetails={handleViewDetails}
          />
        );
    }
  };

  return (
    <div className={`app-container${darkMode ? ' dark' : ''}`}>
      <Header
        currentView={currentView}
        onViewChange={setCurrentView}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
      />
      <main className="app-main">{renderCurrentView()}</main>
      <Toaster richColors position="top-right" />
    </div>
  );
}
