import React, { useEffect, useMemo } from 'react';
import { useAppDispatch } from '@/Redux/Hooks';
import { fetchUser } from '@/Redux/Auth';
import Hero from '@/Layout/Home/Hero';
import About from '@/Layout/Home/About';
import ServicesComponent from '@/Layout/Home/Services';
import RegisterComponent from '@/Layout/Home/Register';
import WhyChooseUs from '@/Layout/Home/WhyChooseUs';
import HowToJoin from '@/Layout/Home/HowToJoin';
import CategoryComponent from '@/Layout/Home/Category';
import TeamComponent from '@/Layout/Home/Team';
import CompanyOverview from '@/Layout/Home/CompanyOverview';
const Home = () => {
    const dispatch = useAppDispatch();

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
            <Hero />
            <CompanyOverview />
            <About />
            <ServicesComponent />
            <HowToJoin />
            <CategoryComponent />
            <WhyChooseUs />
            {/* <Testimonials /> */}
            <RegisterComponent />
            <TeamComponent />
        </>
    );
};

export default Home;
