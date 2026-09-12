# AYRIX - Modern E-Commerce Platform

AYRIX is a full-stack fashion e-commerce application built with Next.js and Node.js. It focuses on solving common online shopping challenges like sizing issues and return management by integrating smart AI features. The platform provides a complete shopping experience for customers, alongside dedicated dashboards for Admins and Product Managers to manage inventory, analyze return trends, and handle order fulfillment.

## ✨ Key Features

### 👕 Smart Sizing & AI Support
- **Personalized Size Recommendations:** Suggests the right size based on the user's past purchases and brand sizing differences.
- **Return Risk Indicator:** Alerts users if an item has a high return rate due to sizing issues before they checkout.
- **AI Support Chatbot:** Integrated with Google Gemini to handle customer queries about sizing, product details, and store policies automatically.

### 👥 Role-Based Dashboards
- **Customer Portal:** Product catalog, smart search, cart management, wallet system, order tracking, and a clean Myntra-style checkout flow.
- **Product Manager (PM) Dashboard:** Analytics for return rates, order fulfillment management (Update order status to Shipped/Delivered), and discount coupon generation.
- **Admin Dashboard:** System health monitoring, audit logs, user management, and the ability to credit bonuses directly to user wallets.

### 💳 Core E-Commerce Flows
- **Wallet Integration:** Users can maintain a digital wallet balance and use it seamlessly during checkout.
- **Order Tracking:** Real-time visual order status (Processing, Shipped, Delivered) linked directly to backend fulfillment.
- **Post-Purchase Feedback:** A smooth feedback modal that asks customers how an item fit them, which helps improve future size recommendations.

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- React, TypeScript, Tailwind CSS
- Context API for State Management (Auth, Cart, Wishlist)

**Backend:**
- Node.js, Express.js
- MongoDB & Mongoose
- Google Gemini API (for AI Chatbot)
- JWT (JSON Web Tokens) & Google OAuth 2.0 for Authentication

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Gemini API Key
- Google OAuth Client ID

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ankitchaudhary/ayrix-ecommerce.git
   cd ayrix-ecommerce
   ```

2. **Backend Setup:**
   ```bash
   cd server
   npm install
   # Create a .env file with your MONGO_URI, JWT_SECRET, and GEMINI_API_KEY
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd client
   npm install
   # Create a .env.local file with NEXT_PUBLIC_API_URL=http://localhost:5001/api
   npm run dev
   ```

4. **Access the Application:**
   Open `http://localhost:3000` in your browser.

## 🔑 Demo Credentials

To explore the role-based dashboards, use the following credentials:
- **Product Manager:** `pm@ayrix.com` / `AdminPass123!`
- **Lead Admin:** `admin@ayrix.com` / `AdminPass123!`

---
*Built by Ankit Chaudhary*
