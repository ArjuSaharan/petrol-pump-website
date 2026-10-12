import React, { useState } from 'react'
import { FaLocationArrow, FaPhoneAlt, FaUser } from 'react-icons/fa'
import axios from 'axios';
import {toast} from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
const AddAccount = () => {
  const[name,setname]=useState("");
  const[phone,setphone]=useState("");
  const[address,setaddress]=useState("");
  const {
      backendURL,
      isLoggedin,
      setisLoggedin,
      userData,
      setuserData
    } = useContext(AppContext);
  
    const navigate = useNavigate();
  
  const submithandler=async(e)=>{
    e.preventDefault();
    console.log(name,phone,address);
    try{
      axios.defaults.withCredentials=true;
      const {data}=await axios.post(backendURL +'/customer/add',{name,phone,address});

      console.log("customer: ",data);
      if(data.success){
        toast.success(data.message);
        navigate('/user');
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
    <div className='flex justify-center items-center py-10 '>
      <div className='shadow p-5'>
        <h1 className='font-bold text-3xl text-center'>Add Account details</h1>
        <p className='text-sm tracking-tighter text-center text-gray-600'>enter the required details to add customer</p>
        <form onSubmit={submithandler}>
          <div className='mt-6'>
          <div className='border flex gap-2 py-2 px-3 rounded-full mt-3'>
            <FaUser className='h-6' />
            <input type="name"
            value={name}
            onChange={(e)=>setname(e.target.value)}
            placeholder='name'
            className='outline-none w-full'/>
          </div>
           <div className='border flex gap-2 py-2 mt-3 px-3 rounded-full'>
            <FaPhoneAlt className='h-6' />
            <input type="tel"
            value={phone}
            onChange={(e)=>setphone(e.target.value)}
            placeholder='enter the phone number'
            className='outline-none w-full'/>
          </div>
           <div className='border flex gap-2 py-2 mt-3 px-3 rounded-full'>
            <FaLocationArrow className='h-6' />
            <input type="text"
            value={address}
            onChange={(e)=>setaddress(e.target.value)}
            placeholder='enter the address'
            className='outline-none w-full'/>
          </div>
          <button type="submit" className='font-bold border mt-4 text-center w-full py-2 px-3 rounded-full bg-gradient-to-r from-green-500 to-green-800 text-white '>Add Account</button>
        </div>
        </form>
      </div>
    </div>
  )
}

export default AddAccount