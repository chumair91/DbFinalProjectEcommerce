import React, { useContext, useState } from 'react'
import { assets } from '../assets/frontend_assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { FaSearch } from "react-icons/fa";
import { MdOutlinePermContactCalendar } from "react-icons/md";
import { LuContact } from "react-icons/lu";
import { GoSearch } from "react-icons/go";
import { ShopContext } from '../context/ShopContext';
import { CgProfile } from "react-icons/cg";
const Navbar = () => {
    const [visible, setVisible] = useState(false)
    const { setShowSearch, cartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);
    const logout = () => {
        navigate('/login')
        localStorage.removeItem("token")
        setToken("")
        setCartItems({})

    }
    return (
        <div className='flex items-center justify-between py-2 font-medium '>
            <Link to='/' > <img src={assets.glogo} className='w-25' alt="#" /></Link>

            <ul className='hidden sm:flex gap-5 text-sm text-gray-700 p-2'>
                <NavLink to="/" className=' flex flex-col items-center gap-1 '>
                    <p className='sm:text-[16px]'>HOME</p>
                    <hr className=' hidden w-2/4 border-none h-[1.5px] bg-gray-700 ' />
                </NavLink>
                <NavLink to="/collection" className='flex flex-col items-center gap-1'>
                    <p className='sm:text-[16px]'>COLLECTION</p>
                    <hr className='hidden w-2/4 border-none h-[1.5px] bg-gray-700 ' />
                </NavLink>
                <NavLink to="/about" className='flex flex-col items-center gap-1'>
                    <p className='sm:text-[16px]'>ABOUT</p>
                    <hr className='hidden w-2/4 border-none h-[1.5px] bg-gray-700 ' />
                </NavLink>
                <NavLink to="/contact" className='flex flex-col items-center gap-1'>
                    <p className='sm:text-[16px]'>CONTACT</p>
                    <hr className='hidden w-2/4 border-none h-[1.5px] bg-gray-700 ' />
                </NavLink>

            </ul>
            <div className='flex items-center gap-6 bg-white/80 backdrop:blur-lg'>
                <Link to='/collection'> <GoSearch onClick={() => setShowSearch(true)} className='text-2xl cursor-pointer' style={{ strokeWidth: 1 }} /></Link>

                <div className='group relative'>
                    {/* <LuContact onClick={() => token ? null : navigate('/login')} className='text-2xl cursor-pointer' /> */}
                    <CgProfile onClick={() => token ? null : navigate('/login')} className='text-[26px] cursor-pointer' />
                    {token &&
                        <div className='group-hover:block hidden absolute dropdown-menu -right-8 pt-4 z-40  rounded-t-xl '>
                            <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-white/80 backdrop:backdrop-blur-md border border-white/20 text-gray-500
                         rounded z-1000 '>
                                <p className='cursor-pointer hover:text-black hover:scale-110 transition-all duration-200 '>My Profiles</p>
                                <p onClick={()=>navigate('/orders')} className='cursor-pointer hover:text-black hover:scale-110 transition-all duration-200'>Orders</p>
                                <p onClick={logout} className='cursor-pointer hover:text-black hover:scale-110 transition-all duration-200'>Logout</p>
                            </div>
                        </div>
                    }
                    {/* Tooltip / label when logged out */}
                    {!token && (
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                            Login
                        </span>
                    )}



                </div>
                <Link to='/cart' className='relative'>
                    <img src={assets.cart_icon} className="w-5 min-w-5" alt="" />
                    <p className='absolute right-[-3px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[12px]'>{cartCount}</p>
                </Link>
                <img src={assets.menu_icon} onClick={() => {
                    setVisible(true)
                }} className='w-7 cursor-pointer sm:hidden' alt="" />


            </div>
            <div className={`z-50 absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all duration-200 ${visible ? 'w-full' : 'w-0'}`}>
                <div className='flex flex-col text-gray-600'>
                    <div onClick={() => setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer '>
                        <img src={assets.dropdown_icon} className='h-4 rotate-180' alt="" />
                        <p>Back</p>
                    </div>
                    <NavLink onClick={() => setVisible(false)} className={({ isActive }) => `py-2 pl-6 border transition-all duration-200 ${isActive ? 'bg-black text-white' : ''}`} to='/'>Home</NavLink>
                    <NavLink onClick={() => setVisible(false)} className={({ isActive }) => `py-2 pl-6 border transition-all duration-200 ${isActive ? 'bg-black text-white' : ''}`} to='/collection'>Collection</NavLink>
                    <NavLink onClick={() => setVisible(false)} className={({ isActive }) => `py-2 pl-6 border transition-all duration-200 ${isActive ? 'bg-black text-white' : ''}`} to='/about'>About</NavLink>
                    <NavLink onClick={() => setVisible(false)} className={({ isActive }) => `py-2 pl-6 border transition-all duration-200 ${isActive ? 'bg-black text-white' : ''}`} to='/contact'>Contact</NavLink>
                </div>
            </div>
        </div>
    )
}

export default Navbar