"use client"
import React from 'react';
import Link from 'next/link';
import avatar from '/public/assests/images/profile.png';
import { useRouter } from 'next/router';
import { LOGIN_ROUTE, REGISTER_ROUTE } from '@/Constants';

const Navbar = () => {
  const router = useRouter();
  const isLoginPage = router.pathname === LOGIN_ROUTE;
  const isRegisterPage = router.pathname === REGISTER_ROUTE;

  // Hide Navbar on login and register pages
  if (isLoginPage || isRegisterPage) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className='navbar-content'>
        <div className="logo">
          <Link href="/">Logo</Link>
        </div>
        <div className="links">
          <Link href="/contact">Contact</Link>
          <Link href="/community">Community</Link>
          <Link href="/services">Services</Link>
          <Link href="/auth/register" className="button">Register</Link>
          <Link href="/auth/login" className="button">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
