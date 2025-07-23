# Smart Admission Portal

A comprehensive full-stack admission management system built for educational institutions to streamline student registration, secure file uploads, form tracking, payment processing, and admin approvals — all within a secure and scalable environment.

---

## 📌 Table of Contents

* [Overview](#overview)
* [Features](#features)
* [Tech Stack](#tech-stack)
* [Architecture](#architecture)
* [Project Modules](#project-modules)
* [Installation Guide](#installation-guide)
* [Environment Setup](#environment-setup)
* [API Endpoints](#api-endpoints)
* [Security Features](#security-features)
* [Deployment](#deployment)
* [Screenshots](#screenshots)
* [Video Demo](#video-demo)
* [License](#license)
* [Authors](#authors)

---

## 📖 Overview

The Smart Admission Portal enables seamless digital admissions for colleges/universities. Students can apply through a step-by-step guided form with live progress tracking. Admins can manage applicants, review uploads, approve/reject applications, and oversee payment status. The system is designed for high security, scalability, and performance.

---

## 🚀 Live Demo

🔗 [Click here to view the live application](https://admission-process-sr5l.vercel.app/)

---
## 🚀 Features

### Student Side

* Registration/Login with HTTP-only cookie authentication
* Multi-step admission form (Personal, Academic, Course, Documents, Payment, Preview)
* Resume from where left off (form progress tracking)
* Upload photos, Aadhar, marksheets, and more to AWS S3
* Real-time status updates (Submitted, Under Review, Accepted, Rejected)
* Secure payment integration using JudoPay

### Admin Side

* Admin login with role-based access control
* Dashboard showing total applications by status
* View and verify student applications
* Approve or reject applications
* View payment confirmation and update status

---

## 🛠 Tech Stack

### Frontend

* React.js
* Tailwind CSS + Custom CSS
* React Router DOM
* Axios
* GSAP for transitions/animations
* Lenis for smooth scrolling

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* AWS S3 SDK (v3)
* Multer for file uploads
* Bcrypt & JWT for authentication

### Tools & Services

* MongoDB Atlas
* AWS S3 Bucket (Manual upload using SDK)
* JudoPay (or Razorpay alternative)
* Vercel for frontend hosting
* Render / Railway / EC2 for backend hosting

---

## 🧱 Architecture

```
Student (React UI)
    ⬇️
  API Gateway (Express + Node)
    ⬇️                    ⬇️
MongoDB (Student Data)   AWS S3 (Document Uploads)
    ⬇️                    ⬇️
      Admin Panel       Payment Gateway (JudoPay)
```

---

## 🧩 Project Modules

1. **Authentication**: Register/login (JWT-based)
2. **Admission Form**:

   * Step 1: Personal Information
   * Step 2: Academic Details
   * Step 3: Course Selection
   * Step 4: Document Upload
   * Step 5: Payment
   * Step 6: Preview & Submit
3. **Progress Tracking**: MongoDB-stored checkpoints
4. **Document Upload**: AWS S3 with unique file naming
5. **Admin Dashboard**: View/manage student submissions
6. **Secure Payment**: Integrated using payment API (JudoPay)
7. **Status Handling**: Application status visible to both sides

---

## 💻 Installation Guide

### Clone Frontend

```bash
git clone https://github.com/yourname/admission-frontend.git
cd admission-frontend
npm install
npm run dev
```

### Clone Backend

```bash
git clone https://github.com/yourname/admission-backend.git
cd admission-backend
npm install
npm run dev
```

---

## 🔐 Environment Setup

### Backend `.env`

```
PORT=5000
MONGO_URI=your_mongodb_atlas_url
JWT_SECRET=your_secure_secret
AWS_REGION=your_aws_region
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=your_bucket_name
```

---

## 🔗 API Endpoints

### Auth Routes

* `POST /api/auth/register`
* `POST /api/auth/login`
* `POST /api/auth/logout`

### Student Routes

* `GET /api/student/progress/:userId`
* `POST /api/student/form/submit`
* `POST /api/student/upload` (multipart form)
* `POST /api/student/payment/:userId`

### Admin Routes

* `GET /api/admin/students`
* `GET /api/admin/student/:userId`
* `POST /api/admin/status/:userId`
* `POST /api/admin/payment-approval/:userId`

---

## 🛡️ Security Features

* All cookies are HTTP-only and secure
* JWT tokens expire after 1 hour
* Files validated by MIME type & size before S3 upload
* Admin routes are protected by middleware and roles
* MongoDB queries protected with sanitization

---

## ☁️ Deployment

* **Frontend:** Vercel (automatic CI/CD)
* **Backend:** Render / Railway / AWS EC2
* **Database:** MongoDB Atlas (Global Cluster)
* **File Storage:** AWS S3 (Free Tier up to 5 GB)
* **Monitoring:** GitHub + Logs

---
## 🖼 Screenshots

### 🎓 Student & Admin Views

#### 🔐 Login Page
Secure student and admin login with token-based HTTP-only cookie auth.
![Login Page](https://raw.githubusercontent.com/YashGarg11/Admission_Process/main/frontend/app/public/Screenshot%202025-04-27%20131607.png)

 #### 📤 S3 Bucket - Document Upload
Initial landing with call-to-actions for student registration and login.
![Landing Page](https://raw.githubusercontent.com/YashGarg11/Admission_Process/main/frontend/app/public/Screenshot%202025-07-17%20121841.png)

 ####  Cover Page
Powerful admin panel to monitor applications, approve documents, and manage users.
![Admin Dashboard](https://raw.githubusercontent.com/YashGarg11/Admission_Process/main/frontend/app/public/Screenshot%202025-07-18%20114358.png)

#### 🏠 Landing  page
Students securely upload required documents via S3 integration.
![Document Upload](https://raw.githubusercontent.com/YashGarg11/Admission_Process/main/frontend/app/public/Screenshot%202025-07-18%20114443.png)

 #### 📊 Admin Dashboard
Students can securely pay admission fees via integrated payment gateway.
![Payment Page](https://raw.githubusercontent.com/YashGarg11/Admission_Process/main/frontend/app/public/Screenshot%202025-07-18%20114506.png)

#### 💳 Fee Payment Integration
Comprehensive form to fill in personal, academic, and course preferences.
![Personal Details](https://raw.githubusercontent.com/YashGarg11/Admission_Process/main/frontend/app/public/Screenshot%202025-07-18%20114546.png)

#### 🧾 Personal Details
Students can view progress across all stages: submitted, approved, rejected.
![Application Status](https://raw.githubusercontent.com/YashGarg11/Admission_Process/main/frontend/app/public/Screenshot%202025-07-18%20114616.png)

#### ✅ Final Submit  & Academic Details 
Final step with full preview and confirmation of submitted application.
![Final Submit](https://raw.githubusercontent.com/YashGarg11/Admission_Process/main/frontend/app/public/Screenshot%202025-07-18%20114721.png)


## 📄 License

MIT License

```
MIT License

Copyright (c) 2025 Yash Garg

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

---

## Tags
#mern #mongodb #express #react #nodejs #cloudinary #pdfgeneration #qrcode
#websockets #gsap #fullstack #collegeportal #admissionsystem #projectshowcase
#jwt #bootstrap #realtime #authentication #studentproject

## 👨‍💻 Authors

* **Yash Garg** – Full Stack Developer
  [LinkedIn](https://linkedin.com/in/your-profile) | [GitHub](https://github.com/your-profile)
