# 🗾️ ITSYOURSART

Deployed and accessible at [ITSYOURSART](https://itsyourart.netlify.app)

---

## 🗾️ What is ITSYOURSART?

**ITSYOURSART** showcases works from The Metropolitan Museum of Art and the Art Institute of Chicago, offering users an intuitive way to discover, view, and even curate their own personal collections. Whether you're a curious browser or a passionate collector, ITSYOURSART lets you explore exhibitions, save your favorites, and create your own collections — all from your phone or browser.

Users have free roam across the application in terms of searching and browsing. However, if a user wants to begin curating their own exhibitions, they will need to log in. That’s all super easy — all that’s required is a few personal details and the user is away.

---

## 🌟 Key Features of ITSYOURSART Frontend

🔍 **Browse by Collection**
Explore artwork from both The Met and The Art Institute of Chicago APIs.

🎨 **Search and Filter**
Find specific artworks using search, filter by artist, or sort based on your preferences.

🗾️ **Create a Custom Collection**
Add your favorite artworks to a personal collection and save in the db.

🧹 **Manage Your Collection**
Easily add or delete any piece from your collection.

🔗 **Accessible UI**
Includes responsive layouts, screen reader support, and clean design for all users.

🌍 **Access**
Access your artworks from any device through creating an account.

📱 **Fully Mobile & Web Friendly**
Works seamlessly across devices — built with Expo + React Native Web.

---

## ⚙️ Running the Project Locally – Frontend

### 1. Requirements

Make sure you have the following installed:

* Node.js (v18 or later)
* npm or yarn
* Expo CLI (Install via `npm install -g expo-cli`)

---

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/yourart.git
cd yourart/front
```

---

### 3. Install Dependencies

```bash
npm install
```

---

### 4. Start the Development Server

```bash
npm start
# or
expo start
```

Then press `W` — this will open the application in your web browser.

---

## 🔪 Tech Stack – Frontend

* **React Native (v0.79)** – Mobile & Web interface
* **React 19** – Core UI library
* **Expo 53 + Expo Router** – Routing and deployment
* **TypeScript** – Type safety
* **Axios** – API requests to Met & AIC
* **AsyncStorage** – Store user collections locally
* **Google Fonts** – Knewave, Lexend, Nunito Sans, Special Elite

---

## 🌍 APIs Used

* **Metropolitan Museum of Art Collection API**
* **Art Institute of Chicago API**

---

## 🌟 Key Features of ITSYOURSART Backend

---

## 🛠️ Backend Overview

The backend for **ITSYOURSART** is built with **Express.js**, **TypeScript**, and **MongoDB** (via Mongoose). It handles user data and provides a foundation for authentication and data persistence for personalized collections.

---

## ⚙️ Running the Project Locally – Backend

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/yourart.git
cd yourart/back
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Set Environment Variables

Create a `.env` file in the root:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=yourart
```

---

## 📦 Tech Stack – Backend

* **Express** – Web framework for routing and middleware
* **TypeScript** – Type-safe backend code
* **Mongoose** – ODM for MongoDB
* **MongoDB** – NoSQL database for storing user data
* **dotenv** – Secure environment variable configuration
* **Jest + Supertest** – For backend testing
* **CORS** – Cross-origin resource sharing for API requests

---

## 📁 Features

* 🔗 Designed to connect with a React Native frontend (mobile & web)
* 📁 Modular structure with `controllers`, `routes`, `models`
* 🧪 Testing setup included with `jest` and `supertest`
