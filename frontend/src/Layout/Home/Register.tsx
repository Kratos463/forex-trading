import Link from 'next/link';
import React from 'react';
import { Container, Button } from 'reactstrap';

const RegisterComponent = () => {
  return (
    <section className='register-section'>
      <Container>
        <div className='register-card'>
            <div className='register-info'>
              <h2>Join Our Forex Trading MLM Platform</h2>
              <p>
                Unlock financial growth with our secure Forex trading platform and lucrative MLM opportunities.
              </p>
            </div>
            <div className='register-actions'>
              <Link href='/auth/register' className='register-button'>Register</Link>
              <Link href="/auth/login" className='login-button'>Login</Link>
            </div>
        </div>
      </Container>
    </section>
  );
};

export default RegisterComponent;


