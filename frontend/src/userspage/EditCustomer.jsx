import React, { useState } from 'react'
import { FaLocationArrow, FaPhoneAlt, FaUser } from 'react-icons/fa'
import axios from 'axios';
import {toast} from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useEffect } from 'react';
const AddAccount = () => {
  const[formdata,setformdata]=useState({
    name:"",
    phone:"",
    address:"",
  });
  const[loading,setloading]=useState(false);
  const {
      backendURL,
      isLoggedin,
      setisLoggedin,
      userData,
      setuserData
    } = useContext(AppContext);
  
    const {id}=useParams();
    const navigate = useNavigate();

const getCustomer=async ()=>{
    try{
        const {data}=await axios.get(backendURL + `/customer/${id}`,{
            withCredentials:true,
        })
        if(data.success){
            setformdata({
                name:data.customer.name,
                phone:data.customer.phone,
                address:data.customer.address
            })
        }else{
            toast.error(data.message);
        }

    }catch(error){
        toast.error(error.message)
    }

}

useEffect(()=>{
    getCustomer();
},[id]);
const handleChange=(e)=>{
    setformdata({
        ...formdata,
        [e.target.name]:e.target.value
    })
}


  const editCustomer=async (e)=>{
    e.preventDefault();
    try{
        const {data} =await axios.put(backendURL + `/customer/edit/${id}`,formdata,{
            withCredentials: true
        })
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
  if(loading){
    return <div className='text-center text-gray-700 text-lg'>Loading....</div>
  }
 
  return (
    <div className='flex justify-center items-center py-10 '>
      <div className='shadow p-5'>
        <h1 className='font-bold text-3xl text-center'>Edit Account details</h1>
        <p className='text-sm tracking-tighter text-center text-gray-600'>enter the required details to edit customer</p>
        <form onSubmit={editCustomer}>
          <div className='mt-6'>
          <div className='border flex gap-2 py-2 px-3 rounded-full mt-3'>
            <FaUser className='h-6' />
            <input type="name"
            value={formdata.name}
            name="name"
            onChange={handleChange}
            placeholder='name'
            className='outline-none w-full'/>
          </div>
           <div className='border flex gap-2 py-2 mt-3 px-3 rounded-full'>
            <FaPhoneAlt className='h-6' />
            <input type="tel"
            value={formdata.phone}
            name="phone"
            onChange={handleChange}
            placeholder='enter the phone number'
            className='outline-none w-full'/>
          </div>
           <div className='border flex gap-2 py-2 mt-3 px-3 rounded-full'>
            <FaLocationArrow className='h-6' />
            <input type="text"
            value={formdata.address}
            name="address"
            onChange={handleChange}
            placeholder='enter the address'
            className='outline-none w-full'/>
          </div>
          <button type="submit" className='font-bold border mt-4 text-center w-full py-2 px-3 rounded-full bg-gradient-to-r from-green-500 to-green-800 text-white '>Update Detail</button>
        </div>
        </form>
      </div>
    </div>
  )
}

export default AddAccount