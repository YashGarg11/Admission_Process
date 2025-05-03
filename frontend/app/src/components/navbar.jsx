// CollegeNavbar.jsx
import 'bootstrap/dist/css/bootstrap.min.css';
import { gsap } from 'gsap';
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-scroll';
import './navbar.module.css'; // Optional custom styles

export default function CollegeNavbar() {
  const navbarRef = useRef(null);
  const navItemsRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      navbarRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
    );

    gsap.fromTo(
      navItemsRef.current,
      { y: -20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.15,
        delay: 0.5,
      }
    );
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'courses', label: 'Courses' },
    { id: 'admission', label: 'Admission' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow"
      ref={navbarRef}
    >
      <div className="container">
        <Link
          to="home"
          className="navbar-brand fw-bold"
          smooth={true}
          duration={500}
        >
          ABC College
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
            {navItems.map((item, index) => (
              <li className="nav-item" key={item.id} ref={el => (navItemsRef.current[index] = el)}>
                <Link
                  to={item.id}
                  className="nav-link"
                  smooth={true}
                  duration={500}
                  offset={-70}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="nav-item" ref={el => (navItemsRef.current[navItems.length] = el)}>
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
