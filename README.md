# 🏥 ClinicConnect

ClinicConnect is a full-stack Hospital & Clinic Management System built using the MERN Stack. It streamlines the complete healthcare workflow by connecting patients, receptionists, doctors, administrators, and pharmacists through a centralized platform.

The system enables appointment scheduling, doctor availability management, patient records, prescriptions, medical reports, notifications, and role-based dashboards, making clinic operations efficient, organized, and scalable.

---

## ✨ Features

### 👨‍⚕️ Patient Module
- Patient registration and profile management
- Book appointments with available doctors
- View appointment history
- View prescriptions and medical reports

### 🏥 Receptionist Module
- Book appointments
- Walk-in appointment booking
- Search patients
- Patient check-in
- Manage today's appointments
- Appointment queue management

### 👨‍⚕️ Doctor Module
- Manage doctor profiles
- View today's appointments
- Access complete patient history
- Start and complete consultations
- View prescriptions and reports

### 💊 Pharmacy Module
- Manage prescriptions
- Medicine dispensing workflow
- Prescription history

### 🩺 Appointment Management
- Doctor availability scheduling
- Automatic slot generation
- Duplicate booking prevention
- Token number generation
- Consultation tracking
- Walk-in patient support

### 📄 Medical Records
- Digital prescriptions
- Medical reports
- Follow-up management
- Consultation notes

### 📊 Dashboard
- Receptionist Dashboard
- Doctor Dashboard
- Admin Dashboard
- Real-time appointment statistics
- Queue monitoring

### 🔐 Security
- Role-based architecture
- JWT Authentication (In Progress)
- Protected API routes
- Input validation
- Error handling

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Other Tools
- JWT Authentication
- Cloudinary
- Postman
- Git & GitHub

---

## 📂 Project Structure

```
ClinicConnect
│
├── client/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   └── assets/
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── validators/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   └── config/
│
└── README.md
```

---

## 🚀 Core Functionalities

- Patient Registration
- Appointment Booking
- Walk-in Appointment
- Doctor Availability Management
- Automatic Slot Generation
- Duplicate Slot Prevention
- Token Management
- Patient Check-In
- Consultation Workflow
- Prescription Management
- Medical Report Management
- Dashboard APIs
- Notification System *(In Progress)*
- Authentication *(In Progress)*

---

## 📌 Appointment Workflow

```
Patient
   │
   ▼
Book Appointment
   │
   ▼
Receptionist Check-In
   │
   ▼
Doctor Starts Consultation
   │
   ▼
Prescription & Reports
   │
   ▼
Consultation Completed
```

---

## 📷 Screenshots

> Add screenshots of:
- Landing Page
- Patient Dashboard
- Receptionist Dashboard
- Doctor Dashboard
- Appointment Booking
- Prescription Module

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/yourusername/ClinicConnect.git
```

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🌐 Environment Variables

Create a `.env` file inside the `server` directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

---

## 📈 Current Progress

- ✅ Patient Module
- ✅ Doctor Module
- ✅ Receptionist Module
- ✅ Appointment Module
- ✅ Doctor Availability
- ✅ Prescription Module
- ✅ Medical Report Module
- ✅ Dashboard APIs (In Progress)
- 🚧 Notification Module
- 🚧 Authentication & Authorization

---

## 🎯 Future Enhancements

- Email Notifications
- SMS & WhatsApp Notifications
- Online Payments
- Video Consultation
- AI Appointment Assistant
- Inventory Management
- Analytics Dashboard
- Multi-Clinic Support
- Mobile Application

---

## 👨‍💻 Contributors

- **Darshan Gaikwad**
- Team Members
**Atharva Navgire**
**Atharv Harde**
---

## 📄 License

This project is developed for educational and learning purposes.
