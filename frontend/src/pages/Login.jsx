import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import { Form } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { FaRegEyeSlash } from "react-icons/fa6";
import { IoEyeOutline } from "react-icons/io5";
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode'; // Install this: npm install jwt-decode

const Login = () => {
  const { navigate, token, setToken, backendUrl } = useContext(ShopContext)
  const [currentState, setCurrentState] = useState('Login')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Function to fetch user data after login/register
  const fetchUserData = async (token) => {
    try {
      // First, decode the token to get user ID
      const decoded = jwtDecode(token);
      
      // Fetch user data from backend
      const response = await axios.get(`${backendUrl}/api/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        const userData = {
          _id: decoded.id || response.data.user._id,
          email: response.data.user.email,
          name: response.data.user.name,
          token: token
        };
        
        // Save user data to localStorage for chat system
        localStorage.setItem('userData', JSON.stringify(userData));
        return userData;
      }
    } catch (error) {
      console.log("Error fetching user data:", error);
      // If API fails, try to extract from token
      try {
        const decoded = jwtDecode(token);
        const userData = {
          _id: decoded.id,
          email: email, // Use the email from form
          name: name || 'User',
          token: token
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        return userData;
      } catch (decodeError) {
        console.log("Could not decode token");
      }
    }
    return null;
  };

  // Alternative: Create endpoint to get user by ID if /me doesn't exist
  const getUserById = async (userId, token) => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.log("Error fetching user by ID:", error);
      return null;
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {
      if (currentState === 'Sign Up') {
        const res = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (res.data.success) {
          setToken(res.data.token)
          localStorage.setItem("token", res.data.token)
          
          // Fetch and store user data for chat
          const userData = await fetchUserData(res.data.token);
          
          // If fetchUserData fails, create basic user data
          if (!userData) {
            const basicUserData = {
              _id: res.data.userId || 'unknown',
              email: email,
              name: name,
              token: res.data.token
            };
            localStorage.setItem('userData', JSON.stringify(basicUserData));
          }
          
          toast.success("Successfully Registered")
          navigate('/');
        } else {
          toast.error(res.data.message)
        }
      } else {
        // Login
        const res = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (res.data.success) {
          setToken(res.data.token)
          localStorage.setItem("token", res.data.token)
          
          // Fetch and store user data for chat
          const userData = await fetchUserData(res.data.token);
          
          // If API fails, create basic user data from form
          if (!userData) {
            const decoded = jwtDecode(res.data.token);
            const basicUserData = {
              _id: decoded.id || 'unknown',
              email: email,
              name: name || 'User', // Name might be empty for login
              token: res.data.token
            };
            
            // Try to get name from database if not in form
            if (!name) {
              const userInfo = await getUserById(decoded.id, res.data.token);
              if (userInfo) {
                basicUserData.name = userInfo.name || email.split('@')[0];
                basicUserData.email = userInfo.email || email;
              }
            }
            
            localStorage.setItem('userData', JSON.stringify(basicUserData));
          }
          
          toast.success("Login successful")
          navigate('/');
        } else {
          toast.error(res.data.message)
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong")
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])
  
  return (
    <form onSubmit={onSubmitHandler}>
      <div className='flex flex-col w-[90%] sm:max-w-96 m-auto items-center h-[80vh]'>

        <div className='inline-flex items-center gap-2 mt-18 mb-4'>
          <p className='text-3xl prata-regular'>{currentState}</p>
          <p className='h-[1.5px] w-8 bg-gray-700 '></p>
        </div>
        {currentState.toLowerCase() === 'Login'.toLowerCase()
          ? '' : <input className='w-full border outline-none p-2 my-3' placeholder='Name' onChange={(e) => setName(e.target.value)} value={name} type="text" required />}
        <input className='w-full border outline-none p-2 mb-3 ' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' type="email" required />
        <div className='w-full relative'>
          <input className='w-full border outline-none p-2 relative pr-10' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' type={showPassword === false ? 'password' : 'text'} required />
          {showPassword === false ? <IoEyeOutline onClick={() => setShowPassword(!showPassword)} className='cursor-pointer absolute right-2 top-1/2 -translate-1/2 text-xl' /> : <FaRegEyeSlash onClick={() => setShowPassword(!showPassword)} className='cursor-pointer absolute right-2 top-1/2 -translate-1/2 text-xl' />}

        </div>


        <div className='flex justify-between  mt-2 w-full'>
          <p onClick={() => navigate('/forget')} className='cursor-pointer hover:scale-105 transition-all duration-200'>Forget Your Password?</p>

          {
            currentState === 'Login' ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer hover:scale-105 transition-all duration-200'>Create Your Account</p> :
              <p onClick={() => setCurrentState('Login')} className='cursor-pointer hover:scale-105 transition-all duration-200'>Login here</p>
          }
        </div>
        <button type='submit' className='mt-10 bg-black border px-10 py-2.5 rounded-sm text-white active:scale-95 transition-all duration-150'>{currentState.toLowerCase() === 'login' ? 'Login' : 'Sign Up'}</button>
      </div>
    </form>

  )
}

export default Login