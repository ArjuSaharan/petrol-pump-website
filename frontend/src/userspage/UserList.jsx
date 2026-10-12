import React, { useState } from 'react'
import { useContext } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const UserList = () => {
    const[search,setsearch]=useState("");
    const[customers,setcustomers]=useState([]);
    const {
        backendURL,
        isLoggedin,
        setisLoggedin,
        userData,
        setuserData
      } = useContext(AppContext);
    const datauser=[
        {
            name:"aarju",
            phone:"23749324",
            address:"fatehabd"
        }
    ]
    const getCustomers=async ()=>{
        try{
            const{data}=await axios.get(backendURL + '/customer/all',{
                withCredentials:true
            })
            console.log("backend ",data);
            console.log(data.customers);
            setcustomers(data.customers);
        }
        catch(error){
            toast.error(error.message);
        }
    }
    useEffect(()=>{
        getCustomers();
    },[]);
    useEffect(() => { console.log("CUSTOMERS STATE:", customers); }, [customers]);

    const handleDelete=async (customerId)=>{
        // e.preventDefault();
        try{
            const response =await axios.post(backendURL + `/customer/delete/${customerId}`,{},{
            withCredentials:true,
        })
        if(response.data.success){
            toast.success(response.data.message);

           setcustomers((prev) => {
               return prev.filter((customer) => customer._id !== customerId);
});
        }
        else{
            toast.error(response.data.message);
        }
        }
        catch(error){
            toast.error(error.message);
        }

    }
   const searchFilter = customers.filter((customer) => {
    return customer.name.toLowerCase().includes(search.toLowerCase());
});
  return (
    <div className='w-full overflow-x-auto'>
        <div className='w-full flex p-5 mb-6 items-center'>
            <div className='border px-4 py-2 gap-1 rounded-full w-[600px] flex'>
                <FaSearch className='w-6 h-6 '/>
                <input type="text"
                value={search}
                onChange={(e)=>setsearch(e.target.value)}
                placeholder='serach by name'
                className='outline-none  w-full'
                />
            </div>
            <button className='font-semibold text-lg border py-2 px-3 rounded-full hover:bg-gray-200 ml-2'>search</button>
            
            <div className='flex  border px-3 py-2 rounded-full ml-20'>
                <Link to="addaccount" className='flex'><FaPlus className='h-5 w-4 text-center'/> <span className='font-bold text-lg '>Add Account</span></Link>
            </div>

        </div>
        <div>
            <div>
                <h2 className='font-bold text-black'>List of All Accounts</h2>
            </div>
            <div className='mt-3'>
                 <table className='w-full text-gray-600 mb-4'>
                        <thead className='bg-gray-800 text-white'>
                            <tr>
                                <th className='py-2 px-4'>Sr.no</th>
                                <th className='py-2 px-4'>Name</th>
                                <th className='py-2 px-4'>phone Number</th>
                                <th className='py-2 px-4'>Address</th>
                                <th className='py-2 px-4'>Action</th>
                            </tr>
                        </thead>
                         <tbody>
                            {
                                searchFilter.map((user,index)=>(
                                    <tr key={index} className='border-b text-center text-gray-800 hover:bg-gray-100 cursor-pointer'>
                                        <td className='py-2 px-4'>{index+1}</td>
                                        <td className='py-2 px-4'>{user.name}</td>
                                        <td className='py-2 px-4'>{user.phone}</td>
                                        <td className='py-2 px-4'>{user.address}</td>
                                        <td  className='py-2 px-4'>
                                            <Link  to={`view/${user._id}`}
                                             onClick={() => console.log("CLICKED CUSTOMER:", user)}
                                            className='border py-1 px-3 rounded-full font-bold bg-blue-600 text-white cursor-pointer hover:bg-blue-500'>view</Link>
                                            <Link to={`editcustomer/${user._id}`}
                                            className='border py-1 px-3 rounded-full font-bold bg-green-600 text-white ml-2 cursor-pointer hover:bg-green-500'>Edit</Link>
                                            <button  onClick={()=>handleDelete(user._id)}
                                            className='border py-1 px-3 rounded-full font-bold bg-red-600 text-white ml-2 cursor-pointer hover:bg-red-500 '>Delete</button>
                                        </td>
                                        
                                    </tr>
                                ))
                            }
                        </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default UserList