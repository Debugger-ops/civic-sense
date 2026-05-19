# 🏙️ Jansankalp — Civic Issue Reporting Platform

**Jansankalp** is a full-stack civic engagement web application that empowers citizens to report local infrastructure and public safety issues, track their resolution status, and collaborate with their communities to drive real change.

> _"Jansankalp" (जनसंकल्प) means "People's Resolve" — a commitment by citizens to build better, safer communities._

---

## ✨ Features

| Feature | Description |
|---|---|
| 📝 **Report Issues** | Submit civic problems with title, description, category, location, priority, and photo |
| 🗺️ **Map View** | Interactive Leaflet map showing all reported issues with location pins |
| 📋 **Browse & Filter** | Search and filter issues by status, category, and priority |
| 📊 **Admin Dashboard** | Charts, statistics, and tools to manage and update issue statuses |
| 🤖 **AI Assistant** | Ask our civic AI for help finding issue info and helpline numbers |
| 🏆 **Leaderboard** | Community rankings to reward active and impactful reporters |
| 🌙 **Dark Mode** | Full dark/light theme toggle |
| 🔐 **Authentication** | Sign-in and admin registration with Aadhaar-based verification |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + custom CSS modules
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (Radix UI primitives)
- **Maps:** [React-Leaflet](https://react-leaflet.js.org/) + Leaflet.js
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Database:** MongoDB via [Mongoose](https://mongoosejs.com/)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Forms:** React Hook Form

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/civic-sense.git
cd civic-sense

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your MongoDB URI
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/jansankalp
```

### Running the App

```bash
# Development server
npm run dev

# Production build
npm run build
npm start

# Lint
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
civic-sense/
├── app/
│   ├── api/                  # API routes (admin registration, etc.)
│   ├── components/           # Reusable React components
│   │   ├── ui/               # shadcn/ui base components
│   │   ├── Hero.tsx          # Landing page hero carousel
│   │   ├── Header.tsx        # Navigation bar
│   │   ├── HomePage.tsx      # Home page layout
│   │   ├── IssueCard.tsx     # Individual issue card
│   │   ├── IssuesList.tsx    # Filterable issues list
│   │   ├── IssueDetails.tsx  # Issue detail view
│   │   ├── MapVIew.tsx       # Leaflet map view
│   │   ├── AIAssistant.tsx   # AI chat assistant
│   │   ├── Leaderboard.tsx   # Community leaderboard
│   │   ├── AuthModal.tsx     # Sign in / register modal
│   │   └── AdminCard.tsx     # Admin login / register card
│   ├── context/              # React context (AuthContext)
│   ├── dashboard/            # Admin dashboard page & components
│   ├── report/               # Report issue form
│   ├── models/               # Mongoose models
│   ├── lib/                  # Utilities (MongoDB connection, etc.)
│   ├── types/                # TypeScript type definitions
│   ├── hooks/                # Custom React hooks
│   ├── globals.css           # Global styles + Tailwind base
│   └── page.tsx              # Root app with view routing
├── public/                   # Static assets
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

---

## 🧭 Usage Guide

### Reporting an Issue

1. Click **"Report Issue"** in the navigation bar.
2. Fill in the issue title, description, category, priority, and location.
3. Optionally attach a photo.
4. Submit — your issue appears on the map and in the browse list.

### Admin Dashboard

1. Click **"Dashboard"** in the navigation bar.
2. View statistics, charts, and all submitted issues.
3. Update issue statuses (Open → In Progress → Resolved).

### AI Assistant

1. Click **"AI Assistant"** in the navigation bar.
2. Ask questions like "What helpline number handles road issues?" or "How many urgent issues are open?"

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

```bash
# Fork and create a feature branch
git checkout -b feature/your-feature-name

# Commit your changes
git commit -m "feat: add your feature"

# Push and open a PR
git push origin feature/your-feature-name
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👥 Built by

Jansankalp was created to make civic reporting accessible, transparent, and community-driven across India.

For support, reach out at **support@jansankalp.com** or visit [New Delhi, India].
