import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Image from 'next/image';
import SubHeadingComponent from '@/components/common/Heading';
import f1 from '../../../public/assests/images/f1.webp';
import f2 from '../../../public/assests/images/f2.webp';
import f3 from '../../../public/assests/images/f3.webp';
import f4 from '../../../public/assests/images/f4.webp';

const serviceData = [
    {
        image: f2,
        title: "Our Index Fund Performance",
        description: "AI FXTRADER provides a way to track the performance of the forex, CFD & crypto markets as a whole by holding a single index asset. Index funds have consistently beaten the average managed fund since their inception."
    },
    {
        image: f3,
        title: "Ease & Simplicity",
        description: "There are literally thousands of trading script for investors to choose from. Choice paralysis: choice adds cost, complexity and the need for advice. AI FXTRADER eliminates this complexity for all kind of investors."
    },
    {
        image: f1,
        title: "Power of Ideas",
        description: "We believe in the power of ideas over a top-down investing approach or philosophy. We seek out and embrace diverse thinking and ideas to create the best outcomes for our clients and their differing needs."
    },
    {
        image: f4,
        title: "Managing with Trust",
        description: "This is why we’re trusted to manage $1.3 trillion of assets*, giving our clients the confidence of working with a partner with size, scale and stability, who takes the utmost pride in their duty of care."
    },
]

const CategoryComponent = () => {
    return (
        <section className='category-section'>
            <div className='page-content'>
                <SubHeadingComponent title="Singular focus on Asset Management" subtitle='WHY TO BECOME AN AI FXTRADER'
                    description='We have no alternative business interests. This means that we are single-mindedly committed to do well for our investors and for ourselves.'
                />
                <Container>
                    <Row className='service-cards'>
                        {serviceData.map((data, index) => (
                            <Col key={index} md={6} lg={6} className='service-card'>

                                <Image src={data.image} alt={data.title} width={25} height={25} />

                                <h4>{data.title}</h4>
                                <p>{data.description}</p>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>
        </section>
    );
};

export default CategoryComponent;
