# JobConnect India 🇮🇳
> Premium Full-Stack MERN Career & Hiring Portal with Multi-Stage Pipeline, Real-Time Notifications, 1-Click Email Verification, and Rupee (₹ LPA) Localization.

---

## ✨ Features

### 🏢 Recruiter Talent Hub & Hiring Pipeline
- **Role-Customized Navigation**: Clean recruiter view focused on talent acquisition without applicant distractions.
- **Multi-Stage Hiring Pipeline**:
  - `Applied` ➔ `Online Assessment` ➔ `Technical Interview` ➔ `HR Interview` ➔ `Offer Released` ➔ `Accepted / Hired` (or `Rejected`).
- **Stage Management Modal**: Configure assessment links, schedule Google Meet / Zoom interviews with date & time, and release formal offer letters with CTC in ₹ LPA.
- **Automated Alerts**: Real-time in-app alerts and automated HTML email updates dispatched to candidates upon any status progression.

### 🎯 Job Seeker Career Portal & Progress Tracker
- **Seeker Dashboard**: Live metric counters for submitted applications, active assessments, interview calls, and job offers received.
- **Step-by-Step Progress Timeline**: Visual stepper showing "What's Done" and "What's Next" (assessment URLs, video meeting join links, preparation notes).
- **Official Offer Letter Acceptance**: Digital acceptance modal with CTC breakdown (₹ LPA) and celebratory confetti animation 🎊.

### 🔔 In-App Real-Time Notification Center
- Unread badge counter with background polling.
- 1-click deep navigation directly into the candidate's active application progress card.

### 🔐 Security, Strong Passwords & Email Verification
- **Live Password Strength Meter**: Validates length (8+), uppercase, lowercase, numbers, and special symbols.
- **1-Click Email Verification**: Automated verification emails with 1-click activation links and 6-digit OTP code.

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Redux Toolkit, React Router v6, Lucide Icons, Canvas Confetti, Lottie React
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt.js, Nodemailer (Gmail SMTP)
- **Styling**: Light-Theme Modern Glassmorphism & Responsive CSS

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or MongoDB Atlas URI

### 1. Backend Setup
```bash
cd job-portal-mern/backend
npm install
```
Configure your `.env` in `job-portal-mern/backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/jobconnect
JWT_SECRET=your_jwt_secret

# Optional: Real Gmail sending (Google App Password)
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_16_char_app_password
```
Run backend:
```bash
npm start
```

### 2. Frontend Setup
```bash
cd job-portal-mern/frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

