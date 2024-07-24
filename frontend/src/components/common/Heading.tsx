import React from 'react';

interface SubHeadingProps {
  title: string;
  subtitle?: string; // Subtitle is optional
  description?: string
}

const SubHeadingComponent: React.FC<SubHeadingProps> = ({ title, subtitle, description }) => {
  return (
    <div className='section-heading'>
      {subtitle && <p className='subtitle'>{subtitle}</p>}
      <h2>{title}</h2>
      {description && <p className='description'>{description}</p>}
    </div>
  );
};

export default SubHeadingComponent;
