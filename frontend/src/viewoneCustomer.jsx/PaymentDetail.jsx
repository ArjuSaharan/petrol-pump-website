import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
const PaymentDetail = () => {
  const [paymentType, setPaymentType] = useState("");
  const [amount, setAmount] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendURL } = useContext(AppContext);
  const [isSubmitting, setisSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!paymentType) {
      alert("Please select Cash or Online");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    setisSubmitting(true);
    try {
      const { data } = await axios.post(`${backendURL}/amount/pay/${id}`, {
        paymentType, amount: Number(amount)
      }, {
        withCredentials: true,
      })
      if (data.success) {
        toast.success(
          `Payment successful. Remaining pending amount: ₹${data.pendingAmount.toFixed(2)}`
        );

        setPaymentType("");
        setAmount("");

        // Go back to customer page
        navigate(`/user/view/${id}`);
      }
    }
    catch (error) {
      console.log(error);
      console.log("FULL ERROR:", error);
      console.log("STATUS:", error.response?.status);
      console.log("BACKEND MESSAGE:", error.response?.data);

    }
    finally {
      setisSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-96 p-6 rounded-xl shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center bg-gray-100 rounded-full py-3">
          Update Balance
        </h2>

        {/* Payment Type */}
        <div className="mb-5">
          <label className="block font-bold mb-2 ">
            Payment Type
          </label>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={paymentType === "cash"}
                onChange={() =>
                  setPaymentType(
                    paymentType === "cash" ? "" : "cash"
                  )
                }
                className="w-4 h-4"
              />
              Cash
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={paymentType === "online"}
                onChange={() =>
                  setPaymentType(
                    paymentType === "online" ? "" : "online"
                  )
                }
                className="w-4 h-4"
              />
              Online
            </label>
          </div>
        </div>

        {/* Amount */}
        <div className="mb-5">
          <label className="block font-bold mb-2">
            Amount
          </label>

          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="1"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Button */}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2.5 rounded-lg text-white font-bold transition
    ${isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-200 to-blue-700 hover:opacity-90"
            }`}
        >
          {isSubmitting ? "Processing Payment..." : "Update Balance"}
        </button>

      </form>
    </div>
  );
};

export default PaymentDetail;