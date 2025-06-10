# College Management System

A comprehensive web-based College Management System built with React, Node.js, and MySQL. This system streamlines the admission process and provides efficient management of student records, courses, and academic activities.

## Features

### Admission Process

- Online application submission
- Document upload and verification
- Application status tracking
- Admission fee payment integration
- Automated email notifications

### Student Management

- Student profile management
- Academic record tracking
- Course registration
- Grade management
- Attendance tracking

### Course Management

- Course catalog
- Course scheduling
- Faculty assignment
- Prerequisite management
- Course capacity tracking

### Faculty Management

- Faculty profiles
- Course assignments
- Teaching schedule
- Performance tracking
- Leave management

### Administrative Features

- User role management
- System configuration
- Report generation
- Data analytics
- Audit logging

## Tech Stack

### Frontend

- React.js
- Material-UI
- Redux for state management
- Axios for API calls
- React Router for navigation

### Backend

- Node.js
- Express.js
- MySQL database
- JWT authentication
- Nodemailer for email notifications

### Development Tools

- Git for version control
- npm for package management
- ESLint for code linting
- Prettier for code formatting

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/college-management-system.git
cd college-management-system
```

2. Install frontend dependencies:

```bash
cd frontend
npm install
```

3. Install backend dependencies:

```bash
cd ../backend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=college_management
JWT_SECRET=your_jwt_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

5. Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Database Setup

1. Create a MySQL database:

```sql
CREATE DATABASE college_management;
```

2. Import the database schema:

```bash
mysql -u your_username -p college_management < backend/database/schema.sql
```

## Running the Application

1. Start the backend server:

```bash
cd backend
npm run dev
```

2. Start the frontend development server:

```bash
cd frontend
npm start
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Project Structure

```
college-management-system/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   └── package.json
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
└── README.md
```

## API Documentation

### Authentication Endpoints

- POST /api/auth/login - User login
- POST /api/auth/register - User registration
- GET /api/auth/profile - Get user profile

### Admission Endpoints

- POST /api/admissions/apply - Submit application
- GET /api/admissions/status - Check application status
- PUT /api/admissions/update - Update application

### Student Endpoints

- GET /api/students - Get all students
- GET /api/students/:id - Get student details
- PUT /api/students/:id - Update student information

### Course Endpoints

- GET /api/courses - Get all courses
- POST /api/courses - Create new course
- PUT /api/courses/:id - Update course details

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@collegemanagementsystem.com or create an issue in the repository.

## Acknowledgments

- Material-UI for the frontend components
- Express.js team for the backend framework
- MySQL team for the database system
