import React, { useEffect, useMemo } from 'react';
import { useAppDispatch } from '@/Redux/Hooks';
import { fetchUser } from '@/Redux/Auth';
import Hero from '@/Layout/Home/Hero';
import About from '@/Layout/Home/About';
import ServicesComponent from '@/Layout/Home/Services';
import RegisterComponent from '@/Layout/Home/Register';
import WhyChooseUs from '@/Layout/Home/WhyChooseUs';
import Testimonials from '@/Layout/Home/Testimonials';

const Home = () => {
    const dispatch = useAppDispatch();

    // Memoize the token retrieval
    const token = useMemo(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    }, []);

    useEffect(() => {
        if (token) {
            dispatch(fetchUser());
        }
    }, [dispatch, token]);

    return (
        <>
            <div className="page-content">
                <Hero />
                <About />
                <ServicesComponent />
            </div>
            <RegisterComponent />
            <Testimonials />
            <div className="page-content">
                <WhyChooseUs />
            </div>
        </>
    );
};

export default Home;
