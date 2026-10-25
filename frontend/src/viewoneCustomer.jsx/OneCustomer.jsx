
import React, { useContext, useEffect, useState } from "react";
import { FaArrowAltCircleLeft, FaSearch, FaUser } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import GenerateBill from "./GenerateBill";

const OneCustomer = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [receipts, setrecipts] = useState([]);
    const [receiptsLoading, setreceiptsLoading] = useState(true);
    const [searchDate, setSearchDate] = useState("");
    const [activeTab, setActiveTab] = useState("receipt");
    const [payments, setPayments] = useState([]);
    const [payloading, setpayLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { backendURL } = useContext(AppContext);
    const [showBill, setShowBill] = useState(false);
    const[pendingAmount,setPendingAmount]=useState(0);


    const getCustomerPending=async()=>{
        try{
            const {data}=await axios.get(`${backendURL}/amount/pending/${id}`,{
                withCredentials: true
            })
            if(data.success){
                setPendingAmount(data.pendingAmount);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    // Get one customer
    const getPayment = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendURL}/amount/pay/${id}`, {
                withCredentials: true,
            })
            if (data.success) {
                setPayments(data.payments || []);
            }
        }
        catch (error) {
            console.log(error);
        }
        finally {
            setpayLoading(false);
        }
    }
    const getCustomer = async () => {

        try {
            const { data } = await axios.get(
                `${backendURL}/customer/${id}`,
                {
                    withCredentials: true
                }
            );
            if (data.success) {
                setCustomer(data.customer);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || error.message
            );
        } finally {
            setLoading(false);
        }
    };


    const getCustomerReceipts = async () => {
        try {
            setreceiptsLoading(true);

            const { data } = await axios.get(`${backendURL}/detail/recipients/${id}`, {
                withCredentials: true,
            })
            if (data.success) {
                setrecipts(data.data || []);
            } else {
                toast.error(data.message);
                setrecipts([]);

            }
        }
        catch (error) {
            toast.error(
                error.response?.data?.message ||
                error.message
            );
            setrecipts([]);
        }
        finally {
            setreceiptsLoading(false);
        }
    }

    useEffect(() => {
        if (id) {
            getCustomer();
            getCustomerReceipts();
            getPayment();
            getCustomerPending();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="p-10">
                <h1 className="text-xl font-bold">
                    Loading customer...
                </h1>

            </div>
        );

    }

    if (!customer) {
        return (
            <div className="p-10">
                <button
                    onClick={() => navigate("/user")}
                    className="flex items-center gap-2 border px-3 py-2 rounded-full"
                >
                    <FaArrowAltCircleLeft />
                    Back to home
                </button>
                <h1 className="text-xl font-bold text-red-600 mt-10">
                    Customer not found
                </h1>
            </div>
        );

    }

    const filterRecipets = receipts.filter((receipt) => {
        if (!searchDate) {
            return true;
        }
        const receiptDate = new Date(receipt.createdAt).toLocaleDateString("en-CA");
        return receiptDate === searchDate;
    })
    const filterPayment = payments.filter((receipt) => {
        if (!searchDate) {
            return true;
        }
        const paymentDate = new Date(receipt.createdAt).toLocaleDateString("en-CA");
        return paymentDate === searchDate;
    })
    return (

        <div className="min-h-screen p-5 pt-8">
            <h1 className="py-5 px-5 text-3xl font-bold text-black text-center">
                Account Details of {customer.name}
            </h1>
            <div className="flex gap-10 py-8 px-5 justify-center ">
                {/* CUSTOMER DETAILS */}
                <div className="shadow-lg rounded-lg py-5 px-9">
                    <h1 className="font-bold text-lg text-black uppercase flex gap-2">
                        <FaUser className="h-6" />
                        {customer.name}
                    </h1>
                    <h4 className="font-semibold mt-3">
                        Phone: {customer.phone}
                    </h4>
                    <h4 className="font-semibold mt-2">
                        Address: {customer.address}
                    </h4>
                </div>
                {/* PAYMENT */}
                <div className="shadow text-center py-2 px-4 rounded-2xl">
                    <h1 className="font-bold text-lg mb-5 ">
                        Total Pending Payment: ₹{pendingAmount}
                    </h1>
                    <Link to={`/user/addrecipent/${id}`}
                        className="mt-3 border px-4 py-2 rounded-lg bg-blue-600 font-bold text-white"
                    >
                        Add New Receipt
                    </Link>
                </div>
                <div className="shadow text-center py-2 px-4 rounded-2xl">
                    <h1 className="font-bold text-lg mb-5 ">
                        Adjust Pending Payment
                    </h1>
                    <Link to={`/user/payment/${id}`}
                        className="mt-3 border px-4 py-2 rounded-lg bg-blue-600 font-bold text-white"
                    >
                        Add Payment
                    </Link>
                </div>
            </div>

            <div className="">

                <div className="flex gap-3">
                    <h2 className="text-lg font-semibold mt-6 px-5 ">List of All Receipt</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex py-4 px-6  gap-2">
                            <input type="date"
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                                className="outline-none w-full focus:bg-gray-100 rounded"
                            />
                            <button onClick={() => setSearchDate("")}
                                className=" rounded-full font-bold bg-gradient-to-r from-blue-400 to-blue-700 py-1 px-4 text-white ">Serach</button>
                        </div>
                        <div>
                            <button
                                type="button"
                                onClick={() => setShowBill(true)}
                                className="rounded-full bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                            >
                                Generate Bill
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3 mb-4">
                    <button
                        onClick={() => setActiveTab("receipt")}
                        className={`py-2 px-5 text-sm font-semibold transition ${activeTab === "receipt"
                            ? "border-b-2"
                            : " text-gray-700"
                            }`}
                    >
                        Receipt History
                    </button>

                    <button
                        onClick={() => setActiveTab("payment")}
                        className={`py-2 px-5 font-semibold  text-sm transition ${activeTab === "payment"
                            ? "border-b-2"
                            : " text-gray-700"
                            }`}
                    >
                        Payment History
                    </button>
                </div>
                <div className='mt-3'>
                    {
                        activeTab === "receipt" ? (
                            <table className='min-w-full text-gray-600 mb-4'>
                                <thead className='bg-gray-800 text-white'>
                                    <tr>
                                        <th className='py-2 px-4'>Date</th>
                                        <th className='py-2 px-4'>Fuel Type</th>
                                        <th className='py-2 px-4'>Customer Name</th>
                                        <th className='py-2 px-4'>vehicle number</th>
                                        <th className='py-2 px-4'>Amount</th>
                                        <th className='py-2 px-4'>Payment Status</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        receiptsLoading ? (
                                            <tr>

                                                <td
                                                    colSpan="6"
                                                    className="text-center py-6"
                                                >
                                                    Loading receipts...
                                                </td>
                                            </tr>
                                        ) : (
                                            filterRecipets.length === 0 ? (
                                                <tr>

                                                    <td
                                                        colSpan="6"
                                                        className="text-center py-6 text-gray-500"
                                                    >
                                                        No receipts found for this customer.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filterRecipets.map((receipt) => {
                                                    return (<tr key={receipt._id} className="border-b hover:bg-gray-200 text-gray-700">
                                                        <td className="py-3 px-4 text-center">
                                                            {new Date(receipt.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-3 py-4 text-center">
                                                            {receipt.fuelType}
                                                        </td>
                                                        <td className="px-3 py-4 text-center">
                                                            {receipt.customerName}
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            {receipt.vehicleNumber}
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            ₹{receipt.amount}
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <span
                                                                className={
                                                                    receipt.paymentStatus === "Paid"
                                                                        ? "text-green-600 font-bold"
                                                                        : "text-red-600 font-bold"
                                                                }
                                                            >
                                                                {receipt.paymentStatus}
                                                            </span>

                                                        </td>
                                                    </tr>
                                                    )
                                                })
                                            )
                                        )
                                    }
                                </tbody>

                            </table>
                        ) :
                            (
                                <table className='min-w-full text-gray-600 mb-4'>
                                    <thead className='bg-gray-800 text-white'>
                                        <tr>
                                            <th className='py-2 px-4'>Sr.no</th>
                                            <th className='py-2 px-4'>Date</th>
                                            <th className='py-2 px-4'>Type of Payment</th>
                                            <th className='py-2 px-4'>Payment </th>
                                        </tr>
                                    </thead>
                                    {
                                        payloading ?
                                            (
                                                <div className="p-8 text-center text-gray-500">
                                                    Loading payment history...
                                                </div>
                                            ) : filterPayment.length === 0 ? (
                                                <tr>

                                                    <td
                                                        colSpan="6"
                                                        className="text-center py-6 text-gray-500"
                                                    >
                                                        No receipts found for this customer.
                                                    </td>
                                                </tr>

                                            ) : (

                                                filterPayment.map((payment, index) => {

                                                    const date = new Date(
                                                        payment.createdAt
                                                    );

                                                    return (
                                                        <tr
                                                            key={payment._id}
                                                            className="border-b hover:bg-gray-50"
                                                        >

                                                            <td className="px-6 py-4 text-center">
                                                                {index + 1}
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                {date.toLocaleDateString(
                                                                    "en-IN"
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 text-center">

                                                                <span
                                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${payment.paymentType ===
                                                                        "cash"
                                                                        ? "bg-green-100 text-green-700"
                                                                        : "bg-blue-100 text-blue-700"
                                                                        }`}
                                                                >
                                                                    {payment.paymentType
                                                                        ?.charAt(0)
                                                                        .toUpperCase() +
                                                                        payment.paymentType?.slice(
                                                                            1
                                                                        )}
                                                                </span>

                                                            </td>
                                                            <td className="px-6 py-4 font-semibold text-center">
                                                                ₹{Number(payment.amount).toLocaleString("en-IN")}
                                                            </td>

                                                        </tr>
                                                    );
                                                })
                                            )
                                    }

                                </table>
                            )
                    }
                </div>
            </div>
            {showBill && (
                <GenerateBill
                    customer={customer}
                    receipts={receipts}
                    payments={payments}
                    onClose={() => setShowBill(false)}
                />
            )}
        </div>
    );
};


export default OneCustomer;
