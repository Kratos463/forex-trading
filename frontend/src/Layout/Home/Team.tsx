import React from 'react';
import SubHeadingComponent from '@/components/common/Heading';
import m1 from '../../../public/assests/images/m1.jpg';
import m2 from '../../../public/assests/images/m2.jpg';
import m3 from '../../../public/assests/images/m3.jpg';
import m4 from '../../../public/assests/images/m4.jpg';
import m5 from '../../../public/assests/images/m5.jpg';
import m6 from '../../../public/assests/images/m6.jpg';
import m7 from '../../../public/assests/images/m7.jpg';
import m8 from '../../../public/assests/images/m8.jpg';
import m9 from '../../../public/assests/images/m9.jpg';
import m10 from '../../../public/assests/images/m10.jpg';
import m11 from '../../../public/assests/images/m11.jpg';
import m12 from '../../../public/assests/images/m12.jpg';
import m13 from '../../../public/assests/images/m13.jpg';
import m14 from '../../../public/assests/images/m14.jpg';
import m15 from '../../../public/assests/images/m15.jpg';

const TeamComponent = () => {
    return (
        <section className="team-section">
            <div className="page-content">
                <SubHeadingComponent
                    title="The Leadership Team"
                    subtitle="OUR TEAM"
                    description="The AI FXTRADER Team combines a passion for esports, industry expertise & proven record in finance, development, marketing & licensing."
                />
                <div className='cards'>
                    {teamMembers.map(member => (
                        <div className="team-member" key={member.name}>
                            <div className="avatar-wrapper">
                                <img
                                    className="avatar"
                                    src={member.image.src}
                                    alt={`${member.name} avatar`}
                                />
                            </div>
                            <div>
                                <h3 className="name">{member.name}</h3>
                                <span className="role">{member.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <SubHeadingComponent
                    title="Our IT Team"
                />
                <div className='cards'>
                    {itTeamMembers.map(manager => (
                        <div className="team-member" key={manager.name}>
                            <div className="avatar-wrapper">
                                <img
                                    className="avatar"
                                    src={manager.image.src}
                                    alt={`${manager.name} avatar`}
                                />
                            </div>
                            <div>
                                <h3 className="name">{manager.name}</h3>
                                <span className="role">{manager.role}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const teamMembers = [
    {
        name: 'Ahmed Omer',
        role: 'Founder',
        image: m1
    },
    {
        name: 'Amelia White',
        role: 'Co-founder',
        image: m2
    },
    {
        name: 'Samuel Lewis',
        role: 'CTO',
        image: m3
    },
    {
        name: 'William Jones',
        role: 'CMO',
        image: m4
    },
    {
        name: 'Sophie Robinson',
        role: 'Business Development',
        image: m5
    },
    {
        name: 'Lily Green',
        role: 'Business Development',
        image: m6
    },
    {
        name: 'Benjamin Clark',
        role: 'Trading Data Analyst',
        image: m14
    },
    {
        name: 'Zara Cooper',
        role: 'Trading Data Analyst',
        image: m8
    },
];

const itTeamMembers = [
    {
        name: 'Hannah Baker',
        role: 'Machine Learning Expert',
        image: m7
    },
    {
        name: 'Charlie Adams',
        role: 'Machine Learning Expert',
        image: m12
    },
    {
        name: 'Niamh Kelly',
        role: 'AI Specialist',
        image: m8,
    },
    {
        name: 'Jacob Young',
        role: 'AI Specialist',
        image: m11
    },
    {
        name: 'Lucas Harris',
        role: 'Data Scientist',
        image: m13
    },
    {
        name: 'Alice Palmer',
        role: 'Data Scientist',
        image: m10
    },
];


export default TeamComponent;
