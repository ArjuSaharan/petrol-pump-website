import React, { useContext } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { IoIosLogIn } from "react-icons/io";
import { FaGasPump } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
const Navbar = () => {
    const {backendURL, getuserdata,isLoggedin,setisLoggedin,userData,setuserData}=useContext(AppContext);

    const naviagte=useNavigate();

    const handleLogout= async(e)=>{
        e.preventDefault();
        try{
            axios.defaults.withCredentials=true;
            const {data}=await axios.post(backendURL +'/auth/logout')

            if(data.success){
                setisLoggedin(false);
                setuserData(false);
                naviagte('/');
            }
            else{
                toast.error(data.message);
            }
        }
        catch(error){
            toast.error(error.message);
        }

    }
  return (
    <div className=' flex justify-between items-center p-4 fixed top-0 left-0 right-0 h-[75px] z-50 bg-white shadow-md'>
        <div className='flex  gap-1'>
            <FaGasPump className='w-10 h-8'/>
            <h1 className='text-gray-900 font-bold text-2xl'>Bishnoi Fuel</h1>

        </div>
        {
            isLoggedin ? (
               <div className='group relative'>
                <span className='border border-black uppercase text-white bg-black text-lg font-bold rounded-full p-2'>{userData.name[0]}</span>
                <div className='hidden group-hover:block  absolute top-full left-2 shadow-lg bg-gray-200 px-4 py-2'>
                    <h4 onClick={handleLogout}
                     className='rounded py-1 px-2 bg-gray-300 text-black cursor-pointer font-semibold'>logout</h4>
                </div>
               </div>
            ):(
                 <div>
            <Link to="/register" className="border rounded-full py-2 px-3 font-bold text-gray-900 hover:bg-gray-100 
            flex gap-1"><IoIosLogIn className='w-6 h-6 text-gray-900 font-bold'/>Login</Link>
        </div>
            )
        }

    </div>
  )
}

export default Navbar