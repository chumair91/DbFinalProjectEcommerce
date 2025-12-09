import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import SideBar from './components/SideBar'
import { Route, Routes } from 'react-router-dom'

import AddCopy from './pages/AddCopy'
import Orders from './pages/Orders'
import ListCopy from './pages/ListCopy'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import Adminhome from './pages/Adminhome'
import AgentPage from './pages/AgentPage'
export const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const currency = 'Rs';
const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '')


  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])
  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === "" ? <Login setToken={setToken} /> :
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <SideBar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base '>
              <Routes>
                <Route path='/' element={<Adminhome />} />
                <Route path='/add' element={<AddCopy token={token} />} />
                <Route path='/list' element={<ListCopy token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
                <Route path='/agent' element={<AgentPage/>} />
              </Routes>
            </div>
          </div>
        </>
      }


    </div>
  )
}

export default App