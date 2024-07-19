import React from 'react';

interface SubHeadingProps {
  title: string;
  subtitle?: string; // Subtitle is optional
}

const SubHeadingComponent: React.FC<SubHeadingProps> = ({ title, subtitle }) => {
  return (
    <div className='section-heading'>
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

export default SubHeadingComponent;
