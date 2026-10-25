import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGasPump } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserNavbar = () => {
  const {
    backendURL,
    isLoggedin,
    setisLoggedin,
    userData,
    setuserData
  } = useContext(AppContext);

  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(
        backendURL + '/auth/logout'
      );

      if (data.success) {
        setisLoggedin(false);
        setuserData(null);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex justify-between items-center p-10 fixed top-0 left-0 right-0 h-[75px] z-50 bg-white shadow-md">
      
      {/* Logo */}
      <div className="flex gap-1">
        <FaGasPump className="w-10 h-8" />

        <h1 className="text-gray-900 font-bold text-2xl">
          Bishnoi Fuel
        </h1>
      </div>

      {/* User */}
      {isLoggedin && userData && (
        <div className="group relative">
          
          <span className="border border-black uppercase text-white bg-black text-lg font-bold rounded-full p-2">
            {userData.name?.[0]}
          </span>

          {/* Logout dropdown */}
          <div className="hidden group-hover:block absolute top-full right-2 shadow-lg bg-gray-200 px-5 py-2">
            
            <h4
              onClick={handleLogout}
              className="rounded py-1 px-2 bg-gray-300 text-black cursor-pointer font-semibold"
            >
              Logout
            </h4>

          </div>
        </div>
      )}
    </div>
  );
};

export default UserNavbar;

