'use client';
import { useState } from "react";
import "./ReportIssueForm.css";
import { MapPin, Camera, Send, AlertTriangle } from "lucide-react";

interface ReportIssueFormProps {
  onSubmit?: (issue: any) => void;
}

const ReportIssueForm = ({ onSubmit }: ReportIssueFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "",
    location: "",
    reporterName: "",
    reporterEmail: "",
    reporterPhone: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      alert("Please fill in all required fields.");
      return;
    }

    const newIssue = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      category: formData.category || "Other",
      priority: (formData.priority || "medium") as "low" | "medium" | "high" | "urgent",
      status: "open" as const,
      location: formData.location,
      votes: 0,
      comments: [] as string[],
      reportedAt: new Date().toISOString(),
      reportedBy: formData.reporterName || "Anonymous",
      lat: 28.6315 + (Math.random() - 0.5) * 0.1,
      lng: 77.2167 + (Math.random() - 0.5) * 0.1,
      image: imageFile ? URL.createObjectURL(imageFile) : undefined,
    };

    if (onSubmit) {
      onSubmit(newIssue);
    }

    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "",
      priority: "",
      location: "",
      reporterName: "",
      reporterEmail: "",
      reporterPhone: "",
    });
    setImageFile(null);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <div className="report-issue">
      <div className="report-container">
        {/* Header */}
        <div className="header">
          <h1>Report a Civic Issue</h1>
          <p>Help us improve your community by reporting issues that need attention</p>
        </div>

        {/* Guidelines */}
        <div className="card warning-card">
          <div className="card-header">
            <h2>
              <AlertTriangle size={20} /> Reporting Guidelines
            </h2>
          </div>
          <div className="card-content">
            <ul>
              <li>• Be specific and descriptive about the issue location</li>
              <li>• Include any safety concerns or urgency details</li>
              <li>• For emergencies, call 100 immediately</li>
              <li>• Provide accurate contact information for follow-up</li>
            </ul>
          </div>
        </div>

        {/* Report Form */}
        <div className="card">
          <div className="card-header">
            <h2>Issue Details</h2>
            <p>Please provide detailed information about the civic issue</p>
          </div>
          <div className="card-content">
            <form onSubmit={handleSubmit} className="form">
              {/* Title */}
              <div className="form-group">
                <label htmlFor="title">Issue Title *</label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  placeholder="Brief, descriptive title"
                  required
                />
              </div>

              {/* Category */}
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => updateFormData("category", e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  <option value="roads-transportation">Roads & Transportation</option>
                  <option value="public-safety">Public Safety</option>
                  <option value="public-property">Public Property</option>
                  <option value="waste-management">Waste Management</option>
                  <option value="parks-recreation">Parks & Recreation</option>
                  <option value="utilities">Utilities</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Priority */}
              <div className="form-group">
                <label>Priority Level</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      value="low"
                      checked={formData.priority === "low"}
                      onChange={(e) => updateFormData("priority", e.target.value)}
                    />
                    <span className="radio-text">Low - Minor inconvenience</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      value="medium"
                      checked={formData.priority === "medium"}
                      onChange={(e) => updateFormData("priority", e.target.value)}
                    />
                    <span className="radio-text">Medium - Moderate impact</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      value="high"
                      checked={formData.priority === "high"}
                      onChange={(e) => updateFormData("priority", e.target.value)}
                    />
                    <span className="radio-text">High - Safety concern or urgent</span>
                  </label>
                </div>
              </div>

              {/* Location */}
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <div className="input-icon">
                  <MapPin size={16} />
                  <input
                    id="location"
                    type="text"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                    placeholder="Specific address or intersection"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description">Detailed Description *</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  placeholder="Provide a detailed description of the issue, including any relevant details that would help identify and resolve the problem..."
                  rows={4}
                  required
                />
              </div>

              {/* Photo */}
              <div className="form-group">
                <label>Photo (Optional)</label>
                <div className="upload-box">
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="photo-upload" className="upload-label">
                    <Camera size={24} />
                    <p>{imageFile ? `Selected: ${imageFile.name}` : "Upload a photo of the issue"}</p>
                    <span className="upload-button">Choose File</span>
                  </label>
                </div>
              </div>

              {/* Reporter Info */}
              <div className="form-section">
                <h3>Contact Information</h3>
                <div className="grid">
                  <div className="form-group">
                    <label htmlFor="reporterName">Your Name</label>
                    <input
                      id="reporterName"
                      type="text"
                      value={formData.reporterName}
                      onChange={(e) => updateFormData("reporterName", e.target.value)}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="reporterPhone">Phone Number</label>
                    <input
                      id="reporterPhone"
                      type="text"
                      value={formData.reporterPhone}
                      onChange={(e) => updateFormData("reporterPhone", e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="reporterEmail">Email Address</label>
                  <input
                    id="reporterEmail"
                    type="email"
                    value={formData.reporterEmail}
                    onChange={(e) => updateFormData("reporterEmail", e.target.value)}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  <Send size={16} /> Submit Issue Report
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssueForm;