"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LOGIN_ROUTE, REGISTER_ROUTE } from '@/Constants';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import logo from '../../../public/assests/images/aifx_logo_ver.png';

const Navbar = () => {
  const router = useRouter();
  const isLoginPage = router.pathname === LOGIN_ROUTE;
  const isRegisterPage = router.pathname === REGISTER_ROUTE;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Default state is false


  // Hide Navbar on login and register pages
  if (isLoginPage || isRegisterPage) {
    return null;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prevState => !prevState);
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="logo">
          <Link href="/">
            <Image src={logo.src} alt="logo" width={220} height={140} />
          </Link>
        </div>
        <div className="mobile-menu" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </div>
        <div className={`links ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link href="/">Home</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/community">Community</Link>
          <Link href="/services">About Us</Link>
        </div>
        <div className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
          <Link href="/">Home</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/community">Community</Link>
          <Link href="/services">About Us</Link>
          <Link href="/auth/register" className="button-join">Join Now</Link>
          <Link href="/auth/login" className="button">Login</Link>
        </div>
        <div className='buttons'>
          <Link href="/auth/register" className="button-join">Join Now</Link>
          <Link href="/auth/login" className="button">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
