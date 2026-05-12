# 🚀 Internship Application Tracker

A sleek, full-stack web application designed to help job seekers organize their recruitment journey. Featuring a responsive interface with **Dark and Light mode** support and a robust **Flask API**.

## 📝 Description

This tracker allows users to log their job applications, track their status (Applied, Interviewing, Offer, Rejected), and manage entries in real-time. It solves the "spreadsheet fatigue" by providing a clean, visual dashboard that adapts to your preferred viewing environment.

## ✨ Features

* **Theme Toggle**: Seamlessly switch between polished Light and Dark modes.
* **Real-time CRUD**: Create, Read, Update, and Delete applications instantly.
* **Status Badges**: High-contrast, color-coded tags for quick status identification.
* **Responsive Design**: Modern UI with consistent spacing and clear "touch targets" for buttons.
* **Loading & Error Handling**: Graceful UI states for API fetches and server downtime.

## 🛠 Tech Stack

### Frontend

* **React** (Vite)
* **CSS3** (Custom Properties & Flexbox)
* **Lucide React** (Icons)

### Backend

* **Flask** (Python)
* **Flask-CORS** (Cross-Origin Resource Sharing)
* **Gunicorn** (Production Server)

### Deployment

* **Vercel**: Frontend Hosting
* **Render**: Backend Hosting

## 📸 Screenshots

### Dark Mode
<img width="1069" height="1047" alt="Screenshot 2026-05-12 at 11 41 19" src="https://github.com/user-attachments/assets/fed2d4d2-e860-4e1c-af07-88479f582020" />

### Light Mode
<img width="1070" height="1057" alt="Screenshot 2026-05-12 at 11 41 07" src="https://github.com/user-attachments/assets/0fd9d619-b6f0-4023-8385-706300a91cbb" />

## 🌐 Live Demo

Check out the live application here: **https://internship-tracker-react.vercel.app/**

---

## ⚙️ Setup Instructions

### Prerequisites

* Node.js & npm
* Python 3.x

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py

```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev

```

### 3. Environment Variables

Create a `.env` file in the frontend directory:

```text
VITE_API_URL=http://127.0.0.1:5000

```

---

## 🤝 Contributing

Feel free to fork this project and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.
