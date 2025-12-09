import React, { useState, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ContactCopy from './pages/ContactCopy'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify';
import ForgetPassword from './pages/ForgetPassword'
import { FaRocketchat } from "react-icons/fa";
import ChatPopup from './components/ChatPopup'; // Import the chat component

const App = () => {
  const [showChat, setShowChat] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is logged in (from localStorage)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // You might want to verify token with backend
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      setUser(userData);
    }
  }, []);

  return (
    <div className='px-4 sm:px-[5vw] md:px-[5vw] lg:px-[5vw]'>
      <ToastContainer />

      <Navbar />
      <SearchBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/product/:productId' element={<Product />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/login' element={<Login setUser={setUser} />} />
        <Route path='/place-order' element={<PlaceOrder />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/forget' element={<ForgetPassword />} />
      </Routes>
      
      {/* Chat Icon */}
      <FaRocketchat
        onClick={() => setShowChat(true)}
        className="fixed bottom-5 right-8 text-6xl hover:scale-110 cursor-pointer text-green-600 bg-white rounded-full p-2 shadow-lg"
      />

      {/* Chat Popup */}
      <ChatPopup 
        isOpen={showChat} 
        onClose={() => setShowChat(false)}
        user={user}
      />

      <Footer />
    </div>
  )
}

export default App