import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import Image from 'next/image';
import SubHeadingComponent from '@/components/common/Heading';
import f1 from '../../../public/assests/images/f1.png';
import f2 from '../../../public/assests/images/f2.png';
import f3 from '../../../public/assests/images/f3.png';
import f4 from '../../../public/assests/images/f4.png';

const serviceData = [
  {
    image: f1,
    title: "Security is Priority",
    description: "We prioritize security, which is why all payments are processed through cryptocurrency, leveraging the security of blockchain technology."
  },
  {
    image: f2,
    title: "No Need to Spend Time Analyzing the Market",
    description: "With AIFXTRADER, you can earn effortlessly without the hassle of market analysis or searching for investment opportunities. Simply invest and enjoy consistent weekly returns."
  },
  {
    image: f3,
    title: "Free From Human Flaws",
    description: "As humans, we sometimes let emotions affect our trading decisions, leading to significant losses. However, the bot operates without emotions or human errors."
  },
  {
    image: f4,
    title: "Seamless Money Making",
    description: "Simply invest your funds and relax. The automated Fund Manager Bot will generate profits for you, allowing you to enjoy the returns with your loved ones."
  },
]

const ServicesComponent = () => {
  return (
    <section className='services-section'>
      <div className='page-content'>
        <SubHeadingComponent title="Trusted & Tested Fund Manager Bot" subtitle='Why Become an AIFXTRADER Investor?'
          description='Our team of specialists closely monitors the Fund Manager Bot, continuously implementing improvements to increase profitability. The profit percentage is steadily growing every day.'
        />

        <Row className='service-cards'>
          {serviceData.map((data, index) => (
            <Col key={index} md={6} lg={6} className='service-card'>

              <Image src={data.image} alt={data.title} width={0} height={0} />

              <h4>{data.title}</h4>
              <p>{data.description}</p>
            </Col>
          ))}
        </Row>

      </div>
    </section>
  );
};

export default ServicesComponent;
