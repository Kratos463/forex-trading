"use client"
import React from 'react';
import { useRouter } from 'next/router'; 
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { ToastContainer } from 'react-toastify';
import MainProvider from '@/MainProvider';
import Header from '@/Layout/UserDashboard/Header';
import '../../public/assests/scss/style.scss'

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  // Check if the current path starts with '/user'
  const isUserPage = router.pathname.startsWith('/user');

  return (
    <>
      <div className='page-wrapper'>
        <MainProvider>
          {isUserPage ? <Header /> : <Navbar />}
          <main>{children}</main>
          <Footer />
        </MainProvider>
      </div>
      <ToastContainer />
    </>
  );
};

export default RootLayout;
