import Link from 'next/link';
import React from 'react';
import { Container, Button } from 'reactstrap';

const RegisterComponent = () => {
  return (
    <section className='register-section'>
      <Container>
        <div className='register-card'>
            <div className='register-info'>
              <h2>Join Our AI FXTRADER Platform</h2>
              <p>
                Unlock financial growth with our secure AI FXTRADER trading platform.
              </p>
            </div>
            <div className='register-actions'>
              <Link href='/auth/register' className='button-full'>Register</Link>
              <Link href="/auth/login" className='button-full'>Login</Link>
            </div>
        </div>
      </Container>
    </section>
  );
};

export default RegisterComponent;


