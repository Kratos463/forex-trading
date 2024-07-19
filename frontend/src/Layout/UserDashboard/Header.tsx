"use client"
import React from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from "@/Redux/Hooks";
import { logout } from '@/Redux/Auth';
import avatar from '/public/assests/images/profile.png';
import { useRouter } from 'next/router';
import { LOGIN_ROUTE, REGISTER_ROUTE } from '@/Constants';
import logo from '../../../public/assests/images/aifx_logo_ver.png'
import Image from 'next/image';

const Header = () => {
    const user = useAppSelector((store) => store.auth.user);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const isLoginPage = router.pathname === LOGIN_ROUTE;
    const isRegisterPage = router.pathname === REGISTER_ROUTE;

    // Hide Navbar on login and register pages
    if (isLoginPage || isRegisterPage) {
        return null;
    }

    const handleLogout = () => {
        router.push("/")
        dispatch(logout());
    };

    return (
        <nav className="navbar user-page-wrapper">
            <div className='navbar-content page-content'>
                <div className="logo">
                    <Link href="/user/dashboard"><Image src={logo} alt="logo" /></Link>
                </div>
                <div className="links">
                    <div className="user-menu">
                        <div className="avatar">
                            <img src={avatar.src} alt="User Avatar" /> {/* Replace with actual avatar path */}
                            <span>{user?.username}</span>
                        </div>
                        <div className="dropdown">
                            <Link href="/user/dashboard">Dashboard</Link>
                            <Link href="/user/wallet">Add Fund to Main Wallet</Link>
                            <Link href="/user/investment">Invest to Earn</Link>
                            <Link href="/user/earnings-payouts">Earnings & Payouts</Link>
                            <Link href="/user/withdrawal">Withdrawal Request</Link>
                            <Link href="/user/referrals">Team</Link>
                            <Link href="/user/referral-code">My Referral Code</Link>
                            <Link href="/user/settings">Settings</Link>
                            {/* <Link href="/user/support">Support</Link> */}
                            <div className="logout" onClick={handleLogout}>Logout</div>
                        </div>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Header;
