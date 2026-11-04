# 🎓 FeedbackHub — Student Course Evaluation & Analytics System (MERN Stack)

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-lightgrey.svg)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](#license)

A modern, full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) web application designed for academic institutions to collect, analyze, and moderate student feedback on courses, curriculum, and faculty instruction.

---

## 🌟 Key Features

- **🎓 Student Portal**:
  - Secure student authentication (Student Roll No / Password)
  - Course-specific feedback submissions with interactive 5-star rating widgets
  - Multi-dimensional evaluation: *Course Content, Teaching Effectiveness, Practical Labs, and Learning Resources*
  - Student feedback submission history with live status updates
- **🛡️ Institutional Admin Console**:
  - Interactive KPI dashboard with aggregate ratings, total submissions, and department breakdowns
  - Real-time feedback moderation and review table with multi-criteria filtering
  - Registered student management and course curriculum mapping
  - One-click dataset export (CSV format) for academic quality audit reports
- **⚡ Modern Responsive UI**:
  - Glassmorphic design system styled with responsive CSS variables & flex/grid
  - Google Fonts (*Plus Jakarta Sans* & *Inter*) with smooth micro-interactions
  - 1-click demo login auto-fill for frictionless testing

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, React Router DOM v6, Lucide Icons, Context API |
| **Backend API** | Node.js (ES Modules), Express.js 4, CORS, Dotenv |
| **Database** | MongoDB (Port 27017), Mongoose ODM (Schemas, Relationships, Indexes) |
| **Authentication** | JSON Web Tokens (JWT), BcryptJS Password Hashing |
| **Tooling & Scripts** | npm, PowerShell / Windows Batch (`start.bat`), Bash script (`run.sh`) |

---

## 📂 Project Directory Structure

```text
MERN-Project/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Mongoose connection
│   ├── controllers/
│   │   ├── authController.js     # Student & Admin login/register
│   │   ├── feedbackController.js # Feedback creation & history
│   │   ├── adminController.js    # Statistics, moderation & dataset export
│   │   └── courseController.js   # Courses, departments & subjects
│   ├── middleware/
│   │   └── auth.js               # JWT verification & role authorization
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt password hashing
│   │   ├── Feedback.js           # Feedback schema with rating dimensions
│   │   └── Course.js             # Academic courses & curriculum schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── feedbackRoutes.js
│   │   ├── adminRoutes.js
│   │   └── courseRoutes.js
│   ├── seed/
│   │   └── seedData.js           # Database seeder with sample records
│   ├── .env.example              # Environment variables template
│   ├── server.js                 # Express server bootstrap
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, StarRating, StatCard, ProtectedRoute
│   │   ├── context/              # AuthContext (state management & session persistence)
│   │   ├── pages/                # StudentLogin, AdminLogin, Dashboard, Submit, AdminPages
│   │   ├── services/             # Centralized API fetch client with JWT injection
│   │   ├── App.jsx               # Application routes
│   │   ├── index.css             # Glassmorphic CSS design system
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js            # Vite configuration with /api proxy to backend
│   └── package.json
├── run.sh                        # Bash startup & control script (macOS/Linux)
├── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18.x or newer) and **npm** installed: `node -v`
- **MongoDB** running locally on default port `27017`:
  - *Windows*: Ensure MongoDB service is running (`net start MongoDB` or Windows Services).
  - *macOS/Linux*: `brew services start mongodb-community`

---

### 2. Installation & Setup

#### Step A: Configure Backend
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` (or copy from `.env.example`):
```env
PORT=5050
MONGODB_URI=mongodb://127.0.0.1:27017/student_feedback_mern
JWT_SECRET=feedbackhub_mern_secret_key_2026_super_secure
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

*(Optional)* Seed sample courses, admin account, and demo students:
```bash
npm run seed
```

#### Step B: Configure Frontend
```bash
cd ../frontend
npm install
```

---

### 3. Running the Application

#### Option 1: 1-Click Windows Launcher (Fastest on Windows)
Run `start.bat` in the project root:
```text
..\start.bat
```

#### Option 2: Manual Terminal Execution

**Terminal 1 — Backend:**
```powershell
cd backend
node server.js
```
> Running at: `http://localhost:5050`

**Terminal 2 — Frontend:**
```powershell
cd ../frontend
node node_modules\vite\bin\vite.js --port 5173
```
> Running at: `http://localhost:5173`

#### Option 3: macOS / Linux (using `run.sh`)
```bash
chmod +x run.sh
./run.sh start
```

---

## 🌐 Access Points & Endpoints

| Portal / Service | URL | Description |
| :--- | :--- | :--- |
| **Web Application** | [http://localhost:5173](http://localhost:5173) | Main portal landing page |
| **Student Login** | [http://localhost:5173/login](http://localhost:5173/login) | Student feedback submission & history |
| **Admin Console** | [http://localhost:5173/admin/login](http://localhost:5173/admin/login) | Institutional evaluation analytics & moderation |
| **Backend REST API** | [http://localhost:5050/api](http://localhost:5050/api) | Express API base endpoint |
| **API Health Check** | [http://localhost:5050/api/health](http://localhost:5050/api/health) | API status & version ping |

---

## 🔑 Demo Test Accounts

| Role | Username / Identifier | Password | Name / Academic Role |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` *(or `admin@college.edu`)* | `admin123` | Prof. Robert Vance (Dean / Admin) |
| **Student** | `CS202601` | `student123` | Aarav Sharma (Computer Science) |
| **Student** | `CS202602` | `student123` | Diya Patel (Computer Science) |
| **Student** | `AI202615` | `student123` | Rohan Gupta (AI & Machine Learning) |

> 💡 **Tip:** Both login screens feature a **"Quick Demo Auto-Fill"** button to populate test credentials instantly.

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/login` — Student authentication with Roll No/Email and password
- `POST /api/auth/admin-login` — Admin authentication with username and password
- `POST /api/auth/register` — Register new student profile
- `GET /api/auth/me` — Retrieve authenticated user profile (JWT protected)

### Feedback Management
- `POST /api/feedback` — Submit a course & faculty evaluation (Student role required)
- `GET /api/feedback/my` — Retrieve student's personal submission history (Student role required)
- `DELETE /api/feedback/:id` — Remove a submitted feedback entry

### Institutional Admin
- `GET /api/admin/stats` — High-level KPI metrics & course ratings
- `GET /api/admin/feedbacks` — Moderation list with filters (department, search, rating)
- `GET /api/admin/students` — List of all registered students
- `DELETE /api/admin/feedbacks/:id` — Delete inappropriate or obsolete feedback
- `GET /api/admin/export` — Export full evaluation dataset as CSV

### Courses & Curriculum
- `GET /api/courses` — Retrieve available departments, academic courses, and subject faculties

---

## 🐙 Step-by-Step Guide to Push into GitHub

Follow these steps to initialize Git and push this repository to your GitHub account:

### Step 1: Create a New Repository on GitHub
1. Log into your GitHub account: [github.com](https://github.com/)
2. Click the **"+"** icon in the top-right corner and select **New repository**.
3. Name your repository (e.g., `StudentFeedbackMern` or `feedbackhub-mern`).
4. Keep it **Public** (or **Private** as desired).
5. **Do NOT** check *"Initialize this repository with a README"*, `.gitignore`, or license (we already have them).
6. Click **Create repository**.
7. Copy the repository URL (e.g. `https://github.com/your-username/StudentFeedbackMern.git`).

---

### Step 2: Initialize Git & Commit in Terminal

Open your terminal in the project root directory (`StudentFeedbackMern`):

```bash
# 1. Initialize local Git repository
git init

# 2. Add all files (respecting .gitignore which excludes node_modules and logs)
git add .

# 3. Check staged files
git status

# 4. Commit the initial codebase
git commit -m "Initial commit: FeedbackHub MERN Stack Student Feedback System"
```

---

### Step 3: Link Remote & Push to GitHub

```bash
# 1. Set the default branch to 'main'
git branch -M main

# 2. Add your GitHub repository as remote origin (replace with your copied URL)
git remote add origin https://github.com/sravanidhanumuri11-dot/StduentFeedbackManagementSystem-Mern.git

# 3. Push to GitHub
git push -u origin main
```

> 🔐 **GitHub Authentication Note:**  
> When prompted for your password, use a **GitHub Personal Access Token (PAT)**:
> 1. In GitHub: Settings ➡️ Developer settings ➡️ Personal access tokens ➡️ Tokens (classic).
> 2. Generate a token with the `repo` scope enabled.
> 3. Paste the token as your password when git prompts.

---

### Step 4: Pushing Future Updates
Whenever you make changes in the future, push them with:
```bash
git add .
git commit -m "Describe your updates here"
git push
```

---

## 📄 License
This project is open-source and licensed under the [ISC License](LICENSE).
