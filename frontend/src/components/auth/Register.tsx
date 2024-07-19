import Link from "next/link";
import { FormEvent, Fragment, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/Redux/Hooks";
import { register } from "@/Redux/Auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import logo from '../../../public/assests/images/aifx_logo_ver.png';

const Register = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { isLoading } = useAppSelector((store) => store.auth);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        referredBy: '',
        phone: '',
        email: '',
        password: '',
        confirmPassword: '',
        country: '',
        terms: false
    });

    const [errors, setErrors] = useState({
        referredBy: '',
        firstName: '',
        email: '',
        password: '',
        confirmPassword: '',
        terms: '',
        country: '',
        phone: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, checked, type } = e.target;
        setFormData({
            ...formData,
            [id]: type === 'checkbox' ? checked : value
        });
    };

    const handleCountryChange = (selectedCountry: any) => {
        setFormData({
            ...formData,
            country: selectedCountry.value
        });
    };

    const validateForm = () => {
        const newErrors: any = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
        if (!formData.referredBy.trim()) newErrors.referredBy = 'Refferal Id required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password.trim()) newErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.terms) newErrors.terms = 'You must agree to the Terms and Conditions';
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        return newErrors;
    };

    const handleRegisterSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const formValidationErrors = validateForm();
        setErrors(formValidationErrors);

        if (Object.keys(formValidationErrors).length > 0) {
            return;
        }

        const response = await dispatch(register(formData)).unwrap();
        if (response.success === true) {
            router.push("/auth/login");
            toast.success(response.message);
        } else {
            toast.error(response.error);
        }
    };

    return (
        <Fragment>
            <div className='page-wrapper'>
                <div className='register'>
                    <div className='form-container'>
                        <Image src={logo} alt="Logo" width={150} height={50} />
                        <p>Create your account to access top-notch tools and resources.</p>
                        <form className='form' onSubmit={handleRegisterSubmit}>
                            <div className={`form-group ${errors.referredBy ? 'error' : ''}`}>
                                <input type="text" id="referredBy" className='form-control' placeholder=" " value={formData.referredBy} onChange={handleInputChange} />
                                <label htmlFor="referredBy">Referral ID</label>
                                {errors.referredBy && <p className="error-message">{errors.referredBy}</p>}
                            </div>
                            <div className={`form-group ${errors.firstName ? 'error' : ''}`}>
                                <input type="text" id="firstName" className='form-control' placeholder=" " value={formData.firstName} onChange={handleInputChange} />
                                <label htmlFor="firstName">First Name</label>
                                {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                            </div>
                            <div className='form-group'>
                                <input type="text" id="lastName" className='form-control' placeholder=" " value={formData.lastName} onChange={handleInputChange} />
                                <label htmlFor="lastName">Last Name</label>
                            </div>
                            <div className={`form-group ${errors.email ? 'error' : ''}`}>
                                <input type="email" id="email" className='form-control' placeholder=" " value={formData.email} onChange={handleInputChange} />
                                <label htmlFor="email">Email</label>
                                {errors.email && <p className="error-message">{errors.email}</p>}
                            </div>
                            <div className={`form-group ${errors.phone ? 'error' : ''}`}>
                                <PhoneInput

                                    country={'us'}
                                    value={formData.phone}
                                    onChange={phone => setFormData({ ...formData, phone })}
                                    inputProps={{
                                        id: 'phone',
                                        name: 'phone',
                                        required: true,
                                        placeholder: 'Phone'
                                    }}
                                    containerClass="react-tel-input"
                                    inputClass="form-control"
                                    buttonClass="flag-dropdown"
                                />
                                {errors.phone && <p className="error-message">{errors.phone}</p>}
                            </div>
                            <div className={`form-group ${errors.country ? 'error' : ''}`}>
                                <Select
                                    options={countryList().getData()}
                                    value={countryList().getData().find(country => country.value === formData.country)}
                                    onChange={handleCountryChange}
                                    placeholder="Select Country"
                                />
                                {errors.country && <p className="error-message">{errors.country}</p>}
                            </div>
                            <div className={`form-group ${errors.password ? 'error' : ''}`}>
                                <input type="password" id="password" className='form-control' placeholder=" " value={formData.password} onChange={handleInputChange} />
                                <label htmlFor="password">Password</label>
                                {errors.password && <p className="error-message">{errors.password}</p>}
                            </div>
                            <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
                                <input type="password" id="confirmPassword" className='form-control' placeholder=" " value={formData.confirmPassword} onChange={handleInputChange} />
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                            </div>
                            <div className={`form-group terms ${errors.terms ? 'error' : ''}`}>
                                <input type="checkbox" id="terms" className='form-control-checkbox' checked={formData.terms} onChange={handleInputChange} />
                                <label htmlFor="terms">I agree to the <Link href="#">Terms and Conditions</Link></label>
                                {errors.terms && <p className="error-message">{errors.terms}</p>}
                            </div>
                            <div className='button-container'>
                                <button type="submit" className='button'>{isLoading ? "Processing" : "Register"}</button>
                            </div>
                        </form>
                        <hr className="divider" />
                        <p style={{ textAlign: "center" }}>Already have an account? <Link href="/auth/login">Login</Link></p>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default Register;
