# OS-CA

# 🚀 Safeguard File Nexus – Secure File Management System

---

## 📌 Overview

**Safeguard File Nexus** is a **high-security file management system** designed to protect digital assets through advanced authentication, encryption, and real-time threat detection. It ensures **secure storage, controlled access, and file operations** while preventing unauthorized access and cyber threats.

🔹 **Authentication:** Password & Two-Factor Authentication (2FA)  
🔹 **End-to-End Encryption:** AES/RSA-based encryption for file security  
🔹 **Role-Based Access Control (RBAC):** User permission management  
🔹 **File Operations:** Secure **upload, download, read, write, and share**  
🔹 **Threat Detection:** Identifies malware, buffer overflow, unauthorized access  
🔹 **Audit Logs & Tracking:** Tracks all file activities for security compliance  

---

## 🏗️ Technology Stack

### **Frontend**
- ⚛️ **React.js** – Modern UI with component-based architecture  
- ⚡ **Vite** – Faster development & build process  
- 🎨 **ShadCN UI** – Beautiful & responsive UI components  

### **Backend**
- 🌐 **Node.js + Express.js** – Handles authentication & file processing  
- 🛢️ **MongoDB / PostgreSQL** – Secure file metadata storage  
- 🔑 **JWT Authentication** – Secure user sessions  

### **Security Implementations**
- 🔐 **AES/RSA Encryption** – Protects stored files  
- 🛡️ **OAuth 2.0 & MFA** – Enhanced authentication security  
- 🚧 **Rate Limiting & Logging** – Prevents brute-force attacks  

---

## ⚙️ Installation & Setup

### **🔧 Prerequisites**
- Install **Node.js & npm**
- Set up **MongoDB/PostgreSQL**
- Create a `.env` file with **API keys & database credentials**

### **🚀 Steps to Run Locally**
```sh
# 1️⃣ Clone the repository
git clone https://github.com/yourusername/safeguard-file-nexus.git
cd safeguard-file-nexus

# 2️⃣ Install dependencies
npm install

# 3️⃣ Start the backend server
npm run start

# 4️⃣ Navigate to frontend & start the app
cd client
npm run dev

# 5️⃣ Open the application in browser
http://localhost:3000
