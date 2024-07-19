import Link from "next/link";
import { Fragment, FormEvent, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/Redux/Hooks";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { login, fetchUser } from "@/Redux/Auth";
import Cookies from "js-cookie";

const Login = () => {

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading } = useAppSelector((store) => store.auth);

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    identifier: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value
    });
  };


  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.identifier.trim()) newErrors.identifier = 'username and email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleLoginSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const formValidationErrors = validateForm();
    setErrors(formValidationErrors);

    if (Object.keys(formValidationErrors).length > 0) {
      return;
    }

    try {
      const response = await dispatch(login(formData)).unwrap();
      if (response.success === true) {
        Cookies.set("token", response.token);
        router.push("/user/dashboard");
        dispatch(fetchUser());
      } else {
        toast.error(response.error || "Invalid username or password.");
      }
    } catch (error: any) {
      toast.error(error.message || "Invalid username or password.");
    }

  };

  return (
    <Fragment>
      <div className='page-wrapper'>
        <div className='authentication-box'>
          <div className='left-area'>
            {/* Left area content (if any) */}
          </div>
          <div className='right-area'>
            <div className='form-container'>
              <h2>Welcome to AI FXTRADER👋🏻</h2>
              <p>Please sign-in to your account and start the adventure.</p>
              <form className='form' style={{ flexDirection: "column" }} onSubmit={handleLoginSubmit}>
                <div className={`form-group ${errors.identifier ? 'error' : ''}`}>
                  <input type="text" id="identifier" className='form-control' placeholder=" " value={formData.identifier} onChange={handleInputChange} />
                  <label htmlFor="identifier">Email or Username</label>
                  {errors.identifier && <p className="error-message">{errors.identifier}</p>}
                </div>
                <div className={`form-group ${errors.password ? 'error' : ''}`}>
                  <input type="password" id="password" className='form-control' placeholder=" " value={formData.password} onChange={handleInputChange} />
                  <label htmlFor="password">Password</label>
                  {errors.password && <p className="error-message">{errors.password}</p>}
                </div>
                <Link href="#" className='forgot-password'>Forgot Password?</Link>
                <div className='button-container'>
                  <button type="submit" className='button'>{isLoading ? "Processing" : "Login"}</button>
                </div>
              </form>
              <hr className="divider" />
              <p style={{ textAlign: "center" }}>New on our platform? <Link href="/auth/register">Create an account</Link></p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Login;
