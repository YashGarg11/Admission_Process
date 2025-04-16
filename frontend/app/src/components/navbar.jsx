// CollegeNavbar.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Link } from 'react-scroll';
import './navbar.module.css'; // Optional

export default function CollegeNavbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow">
      <div className="container">
        <Link
          to="home"
          className="navbar-brand fw-bold"
          smooth={true}
          duration={500}
        >
          📘 ABC College
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collegeNavbar"
          aria-controls="collegeNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="collegeNavbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                to="home"
                className="nav-link"
                smooth={true}
                duration={500}
                offset={-70}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="courses"
                className="nav-link"
                smooth={true}
                duration={500}
                offset={-70}
              >
                Courses
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="admission"
                className="nav-link"
                smooth={true}
                duration={500}
                offset={-70}
              >
                Admission
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="contact"
                className="nav-link"
                smooth={true}
                duration={500}
                offset={-70}
              >
                Contact
              </Link>
            </li>
            <li className="nav-item">
              <a className="btn btn-light btn-sm ms-3" href="/admin">
                Admin/Login
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
