import React from 'react';
import SubHeadingComponent from '@/components/common/Heading';
import { Button, Container } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faUsers, faWallet, faChartLine } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const steps = [
    {
        icon: faUsers,
        step: 1,
        title: "Create Account"
    },
    {
        icon: faWallet,
        step: 2,
        title: "Deposit Money in Wallet"
    },
    {
        icon: faChartLine,
        step: 3,
        title: "Create Investment"
    },
    {
        icon: faDollarSign,
        step: 4,
        title: "Get Weekly Profit"
    },
];

const HowToJoin: React.FC = () => {
    return (
        <section className='how-to-join-section'>
            <div className='page-content'>
                <SubHeadingComponent
                    subtitle='Ready to put your money to work?'
                    title="Start Your Journey To Effortless Earnings"
                    description='At AIFXTRADER, earning is simple: register, add funds to your main wallet, invest, and then relax. Enjoy weekly profits effortlessly'
                />
                <Container className='container'>
                    {steps.map((data, index) => (
                        <div className='step-card' key={index}>
                            <div className='icon-container'>
                                <div className='icon'>
                                    <FontAwesomeIcon icon={data.icon} />
                                </div>
                                <span className='step-number'>{data.step}</span>
                            </div>
                            <p className='title'>{data.title}</p>
                        </div>
                    ))}
                </Container>
                <Link href="/auth/register">
                    <Button className="button-full">Create an Account<i className="fas fa-arrow-right"></i></Button>
                </Link>
            </div>
        </section>
    );
};

export default HowToJoin;
