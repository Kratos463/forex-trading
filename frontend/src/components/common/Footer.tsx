import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LOGIN_ROUTE, REGISTER_ROUTE } from '@/Constants';

const Footer = () => {
  const router = useRouter();

  // Check if current route is login or register
  const isLoginPage = router.pathname === LOGIN_ROUTE;
  const isRegisterPage = router.pathname === REGISTER_ROUTE;

  // Hide Footer on login and register pages
  if (isLoginPage || isRegisterPage) {
    return null; // Return null to render nothing
  }

  return (
    <footer className="footer">
      <div className="footer-wrapper">
        <div className="footer-column"> 
          <h2 className="footer-heading">© 2024 AIFXTRADER</h2>
          <p className="footer-address">
            Reg. No: 38021 <br />
            Premises No. 482, Fourth Floor <br />
            Building 08 <br />
            Honda Media City, <br />
            Mumbai, India
          </p>
        </div>
        <div className="footer-social">
          <Link href="#"><i className="fab fa-facebook-f"></i></Link>
          <Link href="#"><i className="fab fa-instagram"></i></Link>
          <Link href="#"><i className="fab fa-twitter"></i></Link>
          <Link href="#"><i className="fab fa-youtube"></i></Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
