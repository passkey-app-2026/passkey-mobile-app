# PassKey App 🔐

A modern full-stack mobile authentication system built using Flutter, Node.js, MongoDB, and Passkeys (WebAuthn/FIDO2).

This project demonstrates secure passwordless authentication using biometric login such as Fingerprint and Face ID.

---

# 🚀 Features

## Frontend (Flutter)

* User Registration
* Passkey Authentication
* Fingerprint Login
* Face ID Login
* JWT Authentication
* Secure Token Storage
* Modern Clean UI
* API Integration
* Protected Screens

---

## Backend (Node.js)

* REST API Architecture
* Passkey Registration Verification
* Passkey Login Verification
* JWT Token Generation
* MongoDB Database
* Secure Authentication Flow
* Input Validation
* Error Handling
* Rate Limiting

---

# 🛠️ Tech Stack

## Frontend

* Flutter
* Dart
* Provider / Riverpod
* Dio
* Flutter Secure Storage
* Passkeys Package

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* SimpleWebAuthn

---

# 📂 Project Structure

```bash
Passkey_App/
│
├── frontend/
├── backend/
└── README.md
```

---

# 🔐 Passkey Authentication Flow

## Registration

```text
User enters email
→ Backend generates challenge
→ Device creates passkey
→ Fingerprint/FaceID verification
→ Public key saved in database
```

---

## Login

```text
User taps login
→ Backend sends challenge
→ Device signs challenge
→ Backend verifies signature
→ JWT token generated
→ Login success
```

---

# ⚡ Installation Guide

# 1️⃣ Clone Repository

```bash
git clone https://github.com/THEEKSHANA-LS/passkey-mobile-app.git
cd Passkey_App
```

---

# 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

Run backend:

```bash
npm run dev
```

---

# 3️⃣ Flutter Setup

```bash
cd frontend
flutter pub get
```

Run app:

```bash
flutter run
```

---

# 📦 Required Packages

## Flutter Packages

```yaml
dio:
provider:
flutter_secure_storage:
passkeys:
```

---

## Backend Packages

```bash
npm install express mongoose cors dotenv
npm install jsonwebtoken bcryptjs helmet morgan
npm install @simplewebauthn/server
```

---

# 🔒 Security Features

* Passwordless Authentication
* Biometric Verification
* JWT Authorization
* Secure Token Storage
* HTTPS Support
* Public/Private Key Cryptography
* Rate Limiting
* Secure Headers
