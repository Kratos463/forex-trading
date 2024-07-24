import React from 'react';
import SubHeadingComponent from '@/components/common/Heading';
import { Button, Container } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDollarSign, faUsers, faWallet } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const steps = [
    {
        icon: faDollarSign,
        step: 1,
        title: "Create Account"
    },
    {
        icon: faUsers,
        step: 2,
        title: "Deposit Money in Wallet"
    },
    {
        icon: faWallet,
        step: 3,
        title: "Create Investment"
    },
    {
        icon: faWallet,
        step: 4,
        title: "Get Weelky Profit"
    },
];

const HowToJoin: React.FC = () => {
    return (
        <section className='how-to-join-section'>
            <div className='page-content'>
                <SubHeadingComponent
                    subtitle='Ready to make weekly income'
                    title="How AI FXTRADER Works"
                    description='Get involved in our tremendous platform and invest. We will utilize your money and give you profit in your wallet automatically.'
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
                <Link href="/auth/register"> <Button className="button-full">Create an Account<i className="fas fa-arrow-right"></i></Button></Link>
            </div>
        </section>
    );
};

export default HowToJoin;
