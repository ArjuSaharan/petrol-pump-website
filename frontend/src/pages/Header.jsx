import React, { useContext, useEffect } from 'react'
import { PiHandWavingBold } from "react-icons/pi";
import { GiVintageRobot } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';
import { GiFlowers } from "react-icons/gi";
import { AppContext } from '../context/AppContext';

const Header = () => {
    const navigate=useNavigate();
    const {getuserdata,userData}=useContext(AppContext);
    useEffect(()=>{
        getuserdata();
    },[]);
  return (
    <div>
         <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-900'>
        {/* image */}
        <GiVintageRobot className='w-36 h-36 rounded-full mb-6'/>
        <h1  className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey,Users <PiHandWavingBold  className='h-6 w-6'/> </h1>
        <h2 className='font-bold text-3xl sm:text-5xl mb-4'>Welocme to aur app</h2>
        <p className='mb-8 max-w-md'>Lets start with a quick to manage your accounts with us!</p>
        <button  onClick={()=>navigate('/register')}
        className='border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all' >Get Startetd</button>
    </div>
    </div>
  )
}

export default Header