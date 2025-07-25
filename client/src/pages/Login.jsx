import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin ,getUserData} = useContext(AppContent);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleForgotPassword = () => {
    navigate('/resetpassword');
  };

  const handleSubmit = async (e) => {
     console.log("This is inside with in handle Submit")
    e.preventDefault();
    axios.defaults.withCredentials = true;
    console.log("This is inside with in handle Submit222222")
    try {
      if (state === 'Sign Up') {
        console.log("This is inside Sign up")
        console.log(" is backendurl",backendUrl)
        console.log(name,email,password)

        const { data } = await axios.post(backendUrl + '/api/auth/register', {name,email,password});
        console.log("The data is ",data)

        if (data.success) {
          setIsLoggedin(true);
          getUserData()
          navigate('/');
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', {email,password});
        console.log("The login data is ",data)
        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Login/Register error:", error);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      {/* Logo */}
      <img src={assets.logo} alt="Logo" onClick={handleLogoClick} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>

      {/* Card Container */}
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </h2>
        <p className='text-center mb-6'>
          {state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {state === 'Sign Up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt="person icon" />
              <input
                className='bg-transparent outline-none text-white w-full'
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="mail icon" />
            <input
              className='bg-transparent outline-none text-white w-full'
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="lock icon" />
            <input
              className='bg-transparent outline-none text-white w-full'
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <p
            className='mb-4 text-indigo-500 cursor-pointer text-right'
            onClick={handleForgotPassword}
          >
            Forgot Password?
          </p>

          <button
            type="submit"
            className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'
          >
            {state}
          </button>

          <p className='mt-4 text-center'>
            {state === 'Sign Up' ? (
              <>
                Already have an account?{' '}
                <span
                  className='text-indigo-400 cursor-pointer'
                  onClick={() => setState('Login')}
                >
                  Login Here
                </span>
              </>
            ) : (
              <>
                Don’t have an account?{' '}
                <span
                  className='text-indigo-400 cursor-pointer'
                  onClick={() => setState('Sign Up')}
                >
                  Register Here
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
