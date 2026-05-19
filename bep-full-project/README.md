# BEP — Bengali Education Platform

BEP (Bengali Education Platform) is a modern Bengali-first EdTech SaaS platform built for students from Class 6 to Masters level in Bangladesh.

The platform combines:

- Smart Question Bank
- Practice Engine
- Mock Exams
- Progress Analytics
- AI Study Assistant
- Community Discussions
- Premium Subscription System
- Admin CMS Dashboard
- Real-time Analytics
- Firebase Backend Infrastructure

BEP is inspired by platforms like:

- Udemy
- Quizlet
- Unacademy
- 10 Minute School
- Google Classroom
- Exam Preparation Apps

---

# 🚀 Tech Stack

## Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Router DOM
- Lucide Icons
- Framer Motion

## Backend & Infrastructure

- Firebase Authentication
- Firestore Database
- Firebase Storage
- Firebase Functions

## Deployment

- Vercel
- Firebase Hosting

---

# 📁 Project Structure

```bash
bep-full-project/
│
├── public/
├── src/
│
├── assets/
├── components/
├── features/
├── firebase/
├── hooks/
├── layouts/
├── lib/
├── pages/
├── routes/
├── services/
├── store/
├── styles/
├── types/
│
├── App.tsx
├── main.tsx
│
├── .env
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
│
└── README.md
```

---

# ⚡ Features

## 👨‍🎓 Student Features

- Authentication System
- Personalized Dashboard
- AI Study Assistant
- Question Practice
- Subject Progress Tracking
- Mock Tests & Exams
- Weak Topic Analysis
- Community Discussions
- Leaderboard Ranking
- Bookmark Questions
- Study Analytics
- Premium Subscription

---

## 🛠️ Admin Features

- Admin Dashboard
- User Management
- Subject Management
- Chapter Management
- Question Management
- Content Management
- Analytics Overview
- Moderation Tools
- System Settings

---

# 🔐 Authentication

BEP uses Firebase Authentication.

Supported authentication methods:

- Email & Password
- Google Login
- Social Provider Ready Architecture

---

# 🧠 AI Assistant

The platform includes an AI-powered study assistant capable of:

- Answering questions
- Explaining concepts
- Giving practice recommendations
- Weak topic guidance
- Personalized learning support

---

# 📦 Installation

## 1. Clone Repository

```bash
git clone https://github.com/your-username/bep-full-project.git
```

## 2. Enter Project

```bash
cd bep-full-project
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Setup Environment Variables

Create a `.env` file in the root directory.

Example:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

# ▶️ Run Development Server

```bash
npm run dev
```

Default development URL:

```bash
http://localhost:5173
```

---

# 🏗️ Build Production

```bash
npm run build
```

---

# 🚀 Deploy To Vercel

## Install Vercel CLI

```bash
npm install -g vercel
```

## Deploy

```bash
vercel
```

---

# 🔥 Firebase Setup

## Enable Services

Inside Firebase Console enable:

- Authentication
- Firestore Database
- Storage
- Functions

---

## Firestore Rules Example

```js
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /profiles/{userId} {
      allow read, write: if request.auth != null;
    }

    match /questions/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

# 🎨 UI Design System

BEP uses:

- Glassmorphism
- Cyber UI
- Gradient Effects
- Neon Glow
- Modern Dashboard Layout
- Fully Responsive Design

---

# 📱 Responsive Support

Optimized for:

- Desktop
- Tablet
- Mobile Devices

---

# 🧩 State Management

Global state handled using:

- Zustand Store
- Persistent Storage
- Modular Store Architecture

---

# 📊 Analytics Features

- Study Tracking
- Progress Monitoring
- Exam Performance
- Weak Topic Detection
- Rank System
- Learning Insights

---

# 🧪 Recommended VSCode Extensions

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Error Lens
- GitLens

---

# 🛡️ Security

- Firebase Security Rules
- Protected Routes
- Admin Route Guards
- Role-Based Access
- Secure Environment Variables

---

# 📚 Future Roadmap

- Live Classes
- Video Courses
- AI Mock Interview
- Smart Recommendations
- Offline Support
- Native Mobile App
- Advanced Analytics
- Payment Gateway Integration
- Gamification System

---

# 👨‍💻 Development Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

---

# 🤝 Contributing

Contributions are welcome.

Steps:

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push branch
5. Open pull request

---

# 📄 License

This project is licensed under the MIT License.

---

# ❤️ BEP Vision

Our mission is to build the most advanced Bengali-first education ecosystem for students in Bangladesh.

BEP aims to make modern AI-powered learning accessible, interactive, and scalable for everyone.

---

# 🌐 Suggested Production Stack

- Vercel
- Firebase
- Cloudflare
- Stripe
- OpenAI API
- Resend Email API

---

# 📬 Contact

For business or collaboration:

```txt
support@bep-platform.com
```

---

# ⭐ Final Note

BEP is designed with scalability, maintainability, and premium user experience in mind.

The architecture follows a modern SaaS-based modular approach suitable for large-scale educational platforms.
