'use client';

import {
  MessageCircle,
  BarChart3,
  PlusCircle,
  Users,
  Shield,
  Zap,
  Award,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  Quote,
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Bot,
  Trophy,
} from "lucide-react";
import { Hero } from "../components/Hero";
import type { Issue } from "../types/Issue";
import "./HomePage.css";

interface HomePageProps {
  issues: Issue[];
  onViewChange: (view: string) => void;
  onViewDetails: (issue: Issue) => void;
}

const HomePage = ({ issues, onViewChange, onViewDetails }: HomePageProps) => {
  const openCount = issues.filter(i => i.status === 'open').length;
  const resolvedCount = issues.filter(i => i.status === 'resolved').length;
  const inProgressCount = issues.filter(i => i.status === 'in-progress').length;

  const stats = [
    { icon: CheckCircle, label: "Issues Resolved", value: String(resolvedCount + 892), color: "success" },
    { icon: Clock, label: "Active Reports", value: String(openCount + inProgressCount + 100), color: "warning" },
    { icon: Users, label: "Community Members", value: "2,431", color: "primary" },
    { icon: AlertTriangle, label: "Urgent Issues", value: String(issues.filter(i => i.priority === 'urgent' || i.priority === 'high').length), color: "danger" }
  ];

  const features = [
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Get instant notifications when your reported issues are being addressed by local authorities.",
      color: "primary"
    },
    {
      icon: Shield,
      title: "Secure & Anonymous",
      description: "Report issues anonymously with complete privacy protection and secure data handling.",
      color: "success"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join thousands of citizens working together to improve their neighborhoods and communities.",
      color: "warning"
    },
    {
      icon: Bot,
      title: "AI-Powered Assistant",
      description: "Ask our civic AI assistant about issues, get helpline numbers, and receive guidance instantly.",
      color: "primary"
    },
    {
      icon: Trophy,
      title: "Earn Civic Points",
      description: "Report issues, get votes, and climb the leaderboard as a recognized community champion.",
      color: "warning"
    },
    {
      icon: Award,
      title: "Verified Solutions",
      description: "All issue resolutions are verified by our team and community members for transparency.",
      color: "danger"
    }
  ];

  const testimonials = [
    {
      name: "Priya Nair",
      role: "Local Resident",
      content: "Jansankalp helped me report a broken streetlight that was fixed within 48 hours. Amazing service!",
      avatar: "PN",
      rating: 5
    },
    {
      name: "Amit Kumar",
      role: "Community Leader",
      content: "The transparency and tracking features make it easy to see real progress in our neighborhood improvements.",
      avatar: "AK",
      rating: 5
    },
    {
      name: "Mamta Singh",
      role: "Business Owner",
      content: "Finally, a platform that actually works! Our pothole issue was resolved faster than ever before.",
      avatar: "MS",
      rating: 5
    }
  ];

  // Recent issues (top 3 open)
  const recentIssues = issues
    .filter(i => i.status === 'open')
    .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
    .slice(0, 3);

  return (
    <>
      <Hero />

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="statistics">
                <div className={`stat-icon ${stat.color}`}>
                  <stat.icon className="icon" />
                </div>
                <div className="stat-content">
                  <h3>{stat.value}</h3>
                  <p>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Issues Section */}
      {recentIssues.length > 0 && (
        <section className="recent-issues-section">
          <div className="hiw-container">
            <div className="hiw-header">
              <h2>Recent Issues in Your Area</h2>
              <p>Issues reported by citizens that need community attention</p>
            </div>
            <div className="recent-issues-grid">
              {recentIssues.map(issue => (
                <div key={issue.id} className="recent-issue-card" onClick={() => onViewDetails(issue)}>
                  <div className="recent-issue-header">
                    <span className={`priority-dot priority-${issue.priority}`} />
                    <span className="recent-issue-category">{issue.category}</span>
                  </div>
                  <h4>{issue.title}</h4>
                  <p>{issue.description.substring(0, 80)}...</p>
                  <div className="recent-issue-footer">
                    <span>📍 {issue.location}</span>
                    <span>👍 {issue.votes} votes</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <button className="btn-outline" onClick={() => onViewChange('browse')}>
                View All Issues <ArrowRight className="btn-icon-inline" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="hiw-section">
        <div className="hiw-container">
          <div className="hiw-header">
            <h2>How It Works</h2>
            <p>Jansankalp makes it easy to report issues and track their resolution</p>
          </div>

          <div className="hiw-cards">
            <div className="hiw-card">
              <div className="hiw-card-header">
                <div className="icon-circle primary">
                  <PlusCircle className="icon" />
                </div>
                <h3>Report an Issue</h3>
                <p>Describe the problem, add location details, and submit your report</p>
              </div>
              <div className="hiw-card-content">
                <button className="btn-outline" onClick={() => onViewChange("report")}>
                  Start Reporting
                </button>
              </div>
            </div>

            <div className="hiw-card">
              <div className="hiw-card-header">
                <div className="icon-circle warning">
                  <BarChart3 className="icon" />
                </div>
                <h3>Track Progress</h3>
                <p>Monitor the status of your reports and see updates from authorities</p>
              </div>
              <div className="hiw-card-content">
                <button className="btn-outline" onClick={() => onViewChange("admin")}>
                  View Dashboard
                </button>
              </div>
            </div>

            <div className="hiw-card">
              <div className="hiw-card-header">
                <div className="icon-circle ai">
                  <Bot className="icon" />
                </div>
                <h3>Ask AI Assistant</h3>
                <p>Get instant answers about civic issues and important helpline numbers</p>
              </div>
              <div className="hiw-card-content">
                <button className="btn-outline" onClick={() => onViewChange("assistant")}>
                  Try AI Assistant
                </button>
              </div>
            </div>

            <div className="hiw-card">
              <div className="hiw-card-header">
                <div className="icon-circle success">
                  <MessageCircle className="icon" />
                </div>
                <h3>Get Results</h3>
                <p>See issues resolved and contribute to a better community</p>
              </div>
              <div className="hiw-card-content">
                <span className="badge">{resolvedCount + 892} Issues Resolved</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="features-header">
            <h2>Why Choose Jansankalp?</h2>
            <p>Discover the powerful features that make community reporting effective and transparent</p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className={`feature-icon ${feature.color}`}>
                  <feature.icon className="icon" />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonials-header">
            <h2>What Our Community Says</h2>
            <p>Real stories from real people making a difference in their neighborhoods</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <Quote className="quote-icon" />
                  <div className="testimonial-rating">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="star-icon filled" />
                    ))}
                  </div>
                </div>
                <p className="testimonial-content">"{testimonial.content}"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join thousands of citizens working together to improve their communities. Report your first issue today!</p>
            <div className="cta-buttons">
              <button className="btn-primary" onClick={() => onViewChange("report")}>
                Report an Issue
                <ArrowRight className="btn-icon" />
              </button>
              <button className="btn-secondary" onClick={() => onViewChange("assistant")}>
                Try AI Assistant
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <div className="logo-text">
                  <span className="logo-title">Jansankalp</span>
                  <span className="logo-subtitle">Civic Issue Reporting</span>
                </div>
              </div>
              <p className="footer-description">
                Empowering citizens to report issues, track progress, and create positive change in their communities through transparent communication with local authorities.
              </p>
              <div className="social-links">
                <a href="#" className="social-link"><Facebook className="social-icon" /></a>
                <a href="#" className="social-link"><Twitter className="social-icon" /></a>
                <a href="#" className="social-link"><Instagram className="social-icon" /></a>
                <a href="#" className="social-link"><Linkedin className="social-icon" /></a>
              </div>
            </div>

            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul className="footer-links">
                <li><button onClick={() => onViewChange("home")}>Home</button></li>
                <li><button onClick={() => onViewChange("report")}>Report Issue</button></li>
                <li><button onClick={() => onViewChange("browse")}>Browse Issues</button></li>
                <li><button onClick={() => onViewChange("admin")}>Dashboard</button></li>
                <li><button onClick={() => onViewChange("assistant")}>AI Assistant</button></li>
                <li><button onClick={() => onViewChange("leaderboard")}>Leaderboard</button></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Support</h3>
              <ul className="footer-links">
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Contact Support</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Accessibility</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Contact Info</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <span>support@jansankalp.com</span>
                </div>
                <div className="contact-item">
                  <Phone className="contact-icon" />
                  <span>+91 9300000000</span>
                </div>
                <div className="contact-item">
                  <MapPin className="contact-icon" />
                  <span>New Delhi, India</span>
                </div>
              </div>
              <div className="newsletter">
                <h4>Stay Updated</h4>
                <p>Subscribe to our newsletter for community updates.</p>
                <div className="newsletter-form">
                  <input type="email" placeholder="Enter your email" />
                  <button type="submit">Subscribe</button>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p>&copy; 2025 Jansankalp. All rights reserved.</p>
              <div className="footer-bottom-links">
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
