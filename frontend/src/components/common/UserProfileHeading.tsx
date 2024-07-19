import React from 'react';
import { useAppSelector } from '@/Redux/Hooks';

interface SubHeadingProps {
  title: string;
}

const UserProfileHeading: React.FC<SubHeadingProps> = ({ title }) => {

  const { user } = useAppSelector((store) => store.auth)

  return (
    <div className='user-heading'>
      <h2>{title}</h2>
     <p>{user?.username}</p>
    </div>
  );
};

export default UserProfileHeading;
