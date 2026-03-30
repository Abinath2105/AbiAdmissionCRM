# AbiAdmissionCRM

# 🎓 Admission Management & CRM

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Status](https://img.shields.io/badge/Status-Frontend%20Only-orange)
![Storage](https://img.shields.io/badge/Storage-LocalStorage-yellow)
![License](https://img.shields.io/badge/License-MIT-green)

A simple **Admission Management System** built using **React + LocalStorage** to simulate real-world admission workflows with role-based access.

---

## 🚀 Live Demo (Optional)

> Add your deployed link here (Vercel / Netlify)

---

## 📌 Features

### 🏗️ Master Setup (Admin)

* Institution, Campus, Department creation
* Program / Branch configuration
* Academic Year, Course Type (UG/PG)
* Entry Type (Regular / Lateral)
* Admission Mode (Govt / Management)
* Seat Matrix with quotas:

  * KCET
  * COMEDK
  * Management

---

### 👨‍💻 Applicant Management (Officer)

* Create applicants (≤ 15 fields)
* Category: GM / SC / ST / OBC
* Entry Type & Quota Type
* Marks / Exam details
* Document tracking:

  * Pending / Submitted / Verified

---

### 🎯 Seat Allocation

#### Government Flow

* Enter allotment number
* Select quota
* Seat auto-validation & locking

#### Management Flow

* Manual allocation
* Program + quota selection

---

### ✅ Admission Confirmation

* Fee status tracking (Pending / Paid)
* Generate Admission Number:

```
INST/2026/UG/CSE/KCET/0001
```

---

### 📊 Dashboards

#### 👨‍💼 Admin

* Program setup overview

#### 🧑‍💻 Officer

* Applicant tracking
* Allocation progress

#### 📈 Management

* Seat status per program
* Quota distribution (Pie Chart)
* Alerts:

  * Fee pending
  * Documents pending
* Filters (Program / Course Type)
* CSV Export

---

## 🔐 Role-Based Access

| Role       | Access                              |
| ---------- | ----------------------------------- |
| Admin      | Master Setup                        |
| Officer    | Applicants + Allocation + Admission |
| Management | Dashboard (View Only)               |

---

## 🔑 Demo Credentials

| Role       | Username | Password   |
| ---------- | -------- | ---------- |
| Admin      | admin    | admin123   |
| Officer    | officer  | officer123 |
| Management | mgmt     | mgmt123    |

---

## 🧠 Business Rules

* ❌ No seat overbooking
* ❌ No quota overflow
* ✅ Quota seats = intake
* ✅ Admission number is unique & immutable
* ✅ Admission confirmed only after fee payment
* ✅ Real-time seat tracking

---

## 🧭 User Flow

```
Admin → Setup Programs → Define Quotas
       ↓
Officer → Create Applicant → Allocate Seat
       ↓
Verify Docs → Fee Paid → Confirm Admission
       ↓
Management → Monitor Dashboard
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── layouts/
│   └── ProtectedRoute.jsx
├── context/
│   ├── AppContext.jsx
│   └── AuthContext.jsx
├── pages/
│   ├── Dashboard.jsx
│   ├── OfficerDashboard.jsx
│   ├── ManagementDashboard.jsx
│   ├── MasterSetup.jsx
│   ├── ApplicantForm.jsx
│   ├── SeatAllocation.jsx
│   └── AdmissionConfirmation.jsx
├── services/
├── utils/
├── mock/
├── routes.jsx
├── App.js
└── Login.jsx
```

---

## ⚙️ Installation

```bash
git clone https://github.com/Abinath2105/AbiAdmissionCRM.git
cd admission-crm
npm install
npm start
```

---

## 💾 Data Storage

All data is stored in **LocalStorage**:

* Programs
* Applicants
* Admissions
* User role

To reset:

```js
localStorage.clear()
```

---

## 📊 Charts

* Pie Chart for quota distribution (Recharts)

Install if not already:

```bash
npm install recharts
```

---

## 🚫 Limitations

* No backend (mock only)
* No payment gateway
* No notifications (SMS/Email)
* No multi-college support

---

## 🚀 Future Enhancements

* 🔐 Real authentication (JWT)
* 🌐 Backend integration
* 📩 Notifications
* 📄 PDF reports
* 📊 Advanced analytics

---

## 📸 Screenshots (Optional)

> Add UI screenshots here

---

## 📝 License

MIT License

---

## 👨‍💻 Author

Frontend Developer – Admission CRM System

---
