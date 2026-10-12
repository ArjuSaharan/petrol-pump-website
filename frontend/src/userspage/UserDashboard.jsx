import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {AppContext} from '../context/AppContext'
import axios from "axios";
import {
  FaTimes,
  FaHome,
  FaUsers,
  FaCar,
  FaPlus,
  FaMoneyBillWave,
  FaReceipt,
  FaChartBar,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";

const UserDashboard = () => {
  const [petrol, setpetrol] = useState(0);
  const [disel, setdisel] = useState(0);

  const [showpetrolpopup, setshowpetrolpopup] = useState(false);
  const [showdiselpopup, setshowdiselpopup] = useState(false);
  const [petrolinput, setpetrolinput] = useState("");
  const [diselinput, setdiselinput] = useState("");
  const {backendURL} =useContext(AppContext);
  const [totalPending, setTotalPending] = useState(0);
const [totalAccounts, setTotalAccounts] = useState(0);
  const navigate=useNavigate();


  const getDashboardSummary = async () => {
    try {
        const response = await axios.get(
            `${backendURL}/dashboard/summary`,
            {
                withCredentials: true
            }
        );

        console.log("Dashboard summary:", response.data);

        if (response.data.success) {
            setTotalAccounts(
                response.data.data.totalCustomers
            );
        }
    } catch (error) {
        console.error(
            "DASHBOARD SUMMARY ERROR:",
            error
        );
    }
};

const getTotalPending=async()=>{
  try{
    const {data}=await axios.get(`${backendURL}/amount/total-pending`,{
      withCredentials: true
    })
    if(data.success){
      setTotalPending(data.totalPending);
    }
  }
  catch(error){
     console.log(
      "TOTAL PENDING ERROR:",
      error
    );
  }
}
  const getFuelPrice = async () => {
  try {
    const response = await axios.get(
      `${backendURL}/fuel`,{
        withCredentials:true,
      }
    );

    console.log("Fuel data from DB:", response.data);

    if (response.data.success) {
      setpetrol(response.data.data.petrol);
      setdisel(response.data.data.diesel);
    }

  } catch (error) {
    console.error("GET FUEL ERROR:", error);
    console.error("SERVER RESPONSE:", error.response?.data);
  }
};
  useEffect(()=>{
    getFuelPrice();
    getDashboardSummary();
    getTotalPending();
  },[]);
  const openPetrolPop = () => {
    setpetrolinput(petrol);
    setshowpetrolpopup(true);
  }

  const openDiselPop = () => {
    setdiselinput(disel);
    setshowdiselpopup(true);
  }

  const savePetrol = async () => {
  if (petrolinput === "" || Number(petrolinput) < 0) {
    alert("Please enter a valid input");
    return;
  }

  try {
    const response = await axios.put(
      backendURL + "/fuel",
      {
        petrol: Number(petrolinput)
      },{
        withCredentials:  true
      }
    );

    console.log("Petrol update response:", response.data);

    if (response.data.success) {
      setpetrol(response.data.data.petrol);
      setshowpetrolpopup(false);
      navigate('/user');
      
    }

  } catch (error) {
    console.error("PETROL UPDATE ERROR:", error);
    console.error("SERVER RESPONSE:", error.response?.data);

    alert(
      error.response?.data?.message ||
      "Failed to update petrol price"
    );
  }
};
  const saveDiesel = async () => {
  if (diselinput === "" || Number(diselinput) < 0) {
    alert("Please enter a valid input");
    return;
  }

  try {
    const response = await axios.put(
      backendURL + "/fuel",
      {
        diesel: Number(diselinput)
      },{
        withCredentials: true,
      }
    );

    console.log("Diesel update response:", response.data);

    if (response.data.success) {
      setdisel(response.data.data.diesel);
      setshowdiselpopup(false);
      navigate('/user');

    }

  } catch (error) {
    console.error("DIESEL UPDATE ERROR:", error);
    console.error("SERVER RESPONSE:", error.response?.data);

    alert(
      error.response?.data?.message ||
      "Failed to update diesel price"
    );
  }
};

  return (
    <>
      <aside className="fixed left-0 top-[75px] w-64 h-[calc(100vh-75px)] bg-slate-900 text-white z-40">

        <div className="p-5">

          <nav className="space-y-2">

            {/* Dashboard */}

            <NavLink
              to="/user"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive
                  ? "bg-blue-600"
                  : "hover:bg-slate-800"
                }`
              }
            >
              <FaHome />
              <span>Dashboard</span>
            </NavLink>


            {/* Customers */}

            <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-800">
              <div className="flex items-center gap-3">
                <FaCar />
                <span>Petrol: {petrol}</span>
              </div>
              <button onClick={openPetrolPop} className="w-6 h-6 flex items-center 
                justify-center rounded-full bg-blue-600 hover:bg-blue-700" >
                <FaPlus size={11} /> </button>
            </div>

            <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-800">
              <div className="flex items-center gap-3">
                <FaCar />
                <span>Diesel: {disel}</span>
              </div>
              <button onClick={openDiselPop} className="w-6 h-6 flex items-center
                  justify-center rounded-full bg-blue-600 hover:bg-blue-700" >
                <FaPlus size={11} /> </button> </div>

            {/* Payments */}

           <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-800">
              <div className="flex items-center gap-3">
                <FaMoneyBillWave />
                <span>Pending Payment: <p className="text-center font-semibold">₹{totalPending}</p> </span>
              </div>
               </div>

               <div className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-800">
              <div className="flex items-center gap-3">
                <FaMoneyBillWave />
                <span>Total Account : {totalAccounts}</span>
              </div>
               </div>
          </nav>
        </div>

      </aside>
      {showpetrolpopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white text-black w-80 rounded-xl p-6 shadow-xl">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-semibold">
                Update Petrol
              </h2>

              <button
                onClick={() => setshowpetrolpopup(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <FaTimes />
              </button>

            </div>

            {/* Input */}
            <label className="block text-sm font-medium mb-2">
              Petrol Price
            </label>

            <input
              type="number"
              value={petrolinput}
              onChange={(e) => setpetrolinput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter petrol price"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={() => setshowpetrolpopup(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={savePetrol}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>

            </div>

          </div>

        </div>
      )}
      {showdiselpopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

          <div className="bg-white text-black w-80 rounded-xl p-6 shadow-xl">

            {/* Header */}
            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-semibold">
                Update Diesel
              </h2>

              <button
                onClick={() => setshowdiselpopup(false)}
                className="text-gray-500 hover:text-red-500"
              >
                <FaTimes />
              </button>

            </div>

            {/* Input */}
            <label className="block text-sm font-medium mb-2">
              Diesel Price
            </label>

            <input
              type="number"
              value={diselinput}
              onChange={(e) => setdiselinput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter diesel price"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-5">

              <button
                onClick={() => setshowdiselpopup(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={saveDiesel}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UserDashboard;