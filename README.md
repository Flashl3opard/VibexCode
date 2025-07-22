# VibeXCode

**VibeXCode** is a modern, collaborative group chat and forum platform built using **Next.js**, **Tailwind CSS**, **Socket.IO**, **MongoDB**, and **Appwrite**. It supports real-time messaging, image sharing, and authentication with both Appwrite and Firebase (including social login options).

## 🌟 Features

- 🔐 User Authentication with Appwrite & Firebase
- 💬 Real-time group chat using Socket.IO
- 🖼️ Image sharing support
- 🌗 Light and Dark mode UI
- 👤 Editable user profiles (name, email)
- 🧑‍💻 Developer-friendly tech stack
- 📱 Responsive design

---

## 📸 Screenshots

### 🏠 Main Page – Light Mode

<img width="1917" height="871" alt="Screenshot 2025-07-21 165058" src="https://github.com/user-attachments/assets/dbbaf631-13ab-4a8a-a3b6-79a7397c832b" />


### 🏠 Main Page – Dark Mode

<img width="1918" height="866" alt="Screenshot 2025-07-21 165011" src="https://github.com/user-attachments/assets/99fb3774-087a-4bb7-8b10-5d55f4b8dd63" />


### 📊 Dashboard Page

<img width="1884" height="874" alt="Screenshot 2025-07-21 165031" src="https://github.com/user-attachments/assets/1a1a59f1-2b44-49b5-a3a3-7b1ec3b5512c" />


### 👤 Profile Page

<img width="1892" height="862" alt="Screenshot 2025-07-21 165045" src="https://github.com/user-attachments/assets/f14cbb40-7228-4437-826c-72d9aa4faf6f" />



---

## ⚙️ Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Real-time Communication**: Socket.IO
- **Authentication**: Appwrite, Firebase
- **Database**: MongoDB
- **Deployment**: Vercel / Netlify / Custom

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- MongoDB (local or Atlas)
- Appwrite project & API keys
- Firebase setup (for optional social login)

### Setup

```bash
# Clone the repo
git clone https://github.com/yourusername/vibexcode.git
cd vibexcode

# Install dependencies
npm install

# Create and configure .env.local
cp .env.example .env.local
# Fill in Appwrite, Firebase, and MongoDB credentials

# Run the development server
npm run dev
