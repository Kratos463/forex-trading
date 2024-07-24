import SubHeadingComponent from '@/components/common/Heading';
import React from 'react';


const Testimonial = ({ children }: { children: React.ReactNode }) => {
    return <div className="testimonial">{children}</div>;
};

const TestimonialContent = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="testimonial-content">
            {children}
        </div>
    );
};

const TestimonialHeading = ({ children }: { children: React.ReactNode }) => {
    return (
        <h3 className="testimonial-heading">
            {children}
        </h3>
    );
};

const TestimonialText = ({ children }: { children: React.ReactNode }) => {
    return (
        <p className="testimonial-text">
            {children}
        </p>
    );
};

const TestimonialAvatar = ({ src, name, title }: { src: string, name: string, title: string }) => {
    return (
        <div className="testimonial-avatar">
            <img src={src} alt={name} className="avatar-img" />
            <div className="avatar-info">
                <span className="avatar-name">{name}</span>
                <span className="avatar-title">{title}</span>
            </div>
        </div>
    );
};

const WithSpeechBubblesTestimonial = () => {
    return (
        <div className="testimonial-section">
            <div className="page-content">
                <SubHeadingComponent title='Our Clients Speak' subtitle='We have been working with clients around the world' />
                <div className="testimonial-content-container">
                    <Testimonial>
                        <TestimonialContent>
                            <TestimonialHeading>Efficient Collaborating</TestimonialHeading>
                            <TestimonialText>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor neque sed
                                imperdiet nibh lectus feugiat nunc sem.
                            </TestimonialText>
                        </TestimonialContent>
                        <TestimonialAvatar
                            src='https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
                            name='Jane Cooper'
                            title='CEO at ABC Corporation'
                        />
                    </Testimonial>
                    <Testimonial>
                        <TestimonialContent>
                            <TestimonialHeading>Intuitive Design</TestimonialHeading>
                            <TestimonialText>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor neque sed
                                imperdiet nibh lectus feugiat nunc sem.
                            </TestimonialText>
                        </TestimonialContent>
                        <TestimonialAvatar
                            src='https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
                            name='Jane Cooper'
                            title='CEO at ABC Corporation'
                        />
                    </Testimonial>
                    <Testimonial>
                        <TestimonialContent>
                            <TestimonialHeading>Mindblowing Service</TestimonialHeading>
                            <TestimonialText>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor neque sed
                                imperdiet nibh lectus feugiat nunc sem.
                            </TestimonialText>
                        </TestimonialContent>
                        <TestimonialAvatar
                            src='https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'
                            name='Jane Cooper'
                            title='CEO at ABC Corporation'
                        />
                    </Testimonial>
                </div>
            </div>
        </div>
    );
};

export default WithSpeechBubblesTestimonial;
