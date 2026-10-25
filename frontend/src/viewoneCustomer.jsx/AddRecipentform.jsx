import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser, FaMoneyBill, FaTruck, FaBox, FaCheckCircle } from "react-icons/fa";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const AddRecipentform = () => {
  const navigate = useNavigate();
  const { backendURL } = useContext(AppContext);
  const { id } = useParams();
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [fuelType, setfueltype] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [submitting, setsubmitting] = useState(false);


  const addReceipt = async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (submitting) return;

    if (
      !customerName.trim() ||
      amount === "" ||
      !vehicleNumber.trim() ||
      !fuelType
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const receiptAmount = Number(amount);

    if (!Number.isFinite(receiptAmount) || receiptAmount <= 0) {
      toast.error("Please enter a valid amount greater than zero");
      return;
    }

    try {
      setsubmitting(true);

      const { data } = await axios.post(
        `${backendURL}/detail/recipients/${id}`,
        {
          customerId: id,
          customerName: customerName.trim(),
          amount: receiptAmount,
          fuelType,
          vehicleNumber: vehicleNumber.trim().toUpperCase(),
          paymentStatus,
        },
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success("Receipt added successfully");
        navigate(`/user/view/${id}`);
      } else {
        toast.error(data.message || "Failed to add receipt");
      }
    } catch (error) {
      console.error("ADD RECEIPT ERROR:", error);
      toast.error(
        error.response?.data?.message || "Failed to add receipt"
      );
    } finally {
      setsubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-200 p-6 text-black">
          <h2 className="text-3xl font-bold">
            Add Customer Receipt
          </h2>
          <p className="mt-2 text-gray-600">
            Add transaction details for customer
          </p>
        </div>
        <form
          onSubmit={addReceipt}
          className="p-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <FaUser />
                Customer Name
              </label>


              <input
                type="text"
                name="name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>
            {/* Amount */}
            <div>
              <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <FaMoneyBill />
                Amount
              </label>
              <input
                type="number"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Quantity */}
            <div>
              <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <FaBox />
                Fuel Type
              </label>
              <select
                type="number"
                name="fuelType"
                value={fuelType}
                onChange={(e) => setfueltype(e.target.value)}
                placeholder="Enter quantity"
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select fuel type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>

              </select>
            </div>
            {/*Vehicle Number */}
            <div>
              <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
                <FaTruck />
                Vehicle Number
              </label>
              <input
                type="text"
                name="vehicleNumber"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="Enter vehicle number"
                className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          {/* Status */}
          <div className="mt-6">
            <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
              <FaCheckCircle />
              Payment Status
            </label>
            <select
              name="status"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full border rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pending">
                Pending
              </option>
              <option value="Paid">
                Paid
              </option>
            </select>
          </div>
          {/* Button */}

          <button
            type="submit"
            disabled={submitting}
            className={`mt-8 w-full py-3 rounded-xl font-bold text-lg text-white transition duration-300 ${submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-200 to-blue-700 hover:scale-[1.02]"
              }`}
          >
            {submitting ? "Adding Receipt..." : "Add Customer Receipt"}
          </button>

        </form>
      </div>
    </div>

  );

};


export default AddRecipentform;