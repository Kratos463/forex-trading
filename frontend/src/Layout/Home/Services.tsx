import React from 'react';
import { Container, Row, Col } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Example with FontAwesome
import { faDollarSign, faUsers, faWallet } from '@fortawesome/free-solid-svg-icons'; // Example icons
import SubHeadingComponent from '@/components/common/Heading';

const ServicesComponent = () => {
  return (
    <section className='services-section'>
      <SubHeadingComponent title="Benefits We Offer" subtitle='Unlock the full potential of our product with our amazing features and top-notch.' />
      <Container>
        <Row className='service-cards'>
          {/* Service Offerings: Investment Opportunities */}
          <div className='service-card'>
            <div className='icon'>
              <FontAwesomeIcon icon={faDollarSign} />
            </div>
            <h3>Investment Opportunities</h3>
            <p>Description of secure investment options with guaranteed returns. Emphasize weekly returns and transparent investment processes.</p>
          </div>

          {/* Service Offerings: Referral Program */}
          <div className='service-card'>
            <div className='icon'>
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <h3>Referral Program</h3>
            <p>Explanation of multi-level referral rewards. Benefits of referring others and earning passive income.</p>
          </div>

          {/* Service Offerings: Wallet Management */}
          <div className='service-card'>
            <div className='icon'>
              <FontAwesomeIcon icon={faWallet} />
            </div>
            <h3>Wallet Management</h3>
            <p>Features and benefits of wallet management: Easy fund deposits and secure withdrawals. Integration with multiple payment gateways for user convenience.</p>
          </div>
        </Row>
      </Container>
    </section>
  );
};

export default ServicesComponent;

