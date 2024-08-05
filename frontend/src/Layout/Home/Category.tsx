import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Image from 'next/image';
import SubHeadingComponent from '@/components/common/Heading';
import cryptoImage from '../../../public/assests/images/crypto.jpeg';
import metalImage from '../../../public/assests/images/metal.jpg';
import forexImage from '../../../public/assests/images/forex.jpg';
import energyImage from '../../../public/assests/images/energy.jpg';

const categoryData = [
    {
        image: cryptoImage,
        title: "Crypto",
        buttonLabel: "Explore Crypto",
    },
    {
        image: metalImage,
        title: "Metal",
        buttonLabel: "Explore Metal",
    },
    {
        image: forexImage,
        title: "Forex",
        buttonLabel: "Explore Forex",
    },
    {
        image: energyImage,
        title: "Energy",
        buttonLabel: "Explore Energy",
    },
];

const CategoryComponent = () => {
    return (
        <section className='category-section'>
            <div className='page-content'>
                <SubHeadingComponent 
                    title="Diverse Investment Categories" 
                    subtitle='The Fund Manager Bot diversifies funds'
                    description={`"Never put all your eggs in one basket", as a wise philosopher once said, and we firmly believe in this principle. Our Fund Manager Bot adheres to this philosophy by automatically diversifying investors' funds based on market conditions. Few of the categories are given below`}
                />
                <Container>
                    <Row className='category-cards'>
                        {categoryData.map((data, index) => (
                            <Col key={index} md={6} lg={6} className='category-card'>
                                <div className="image-wrapper">
                                    <Image src={data.image} alt={data.title} layout="responsive" />
                                </div>
                                <h4>{data.title}</h4>
                                {/* <button className="explore-button">{data.buttonLabel}</button> */}
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </section>
    );
};

export default CategoryComponent;
