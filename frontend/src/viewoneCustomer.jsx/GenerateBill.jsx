import React, { useState } from "react";
import { FaTimes, FaPrint } from "react-icons/fa";

const GenerateBill = ({
  customer,
  receipts = [],
  payments = [],
  onClose,
}) => {
  const [billType, setBillType] = useState("receipt");
  const [billPeriod, setBillPeriod] = useState("1week");
  const [generatedBill, setGeneratedBill] = useState(null);

  const handleGenerateBill = () => {
    const today = new Date();
    const fromDate = new Date();

    switch (billPeriod) {
      case "1week":
        fromDate.setDate(today.getDate() - 7);
        break;

      case "2week":
        fromDate.setDate(today.getDate() - 14);
        break;

      case "1month":
        fromDate.setMonth(today.getMonth() - 1);
        break;

      case "2month":
        fromDate.setMonth(today.getMonth() - 2);
        break;

      default:
        fromDate.setDate(today.getDate() - 7);
    }

    const sourceData =
      billType === "receipt" ? receipts : payments;

    const filteredData = sourceData.filter((item) => {
      const itemDate = new Date(item.createdAt);

      return itemDate >= fromDate && itemDate <= today;
    });

    const totalAmount = filteredData.reduce(
      (total, item) => total + Number(item.amount || 0),
      0
    );

    setGeneratedBill({
      billType,
      billPeriod,
      fromDate,
      toDate: today,
      data: filteredData,
      totalAmount,
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

      {/* BILL SELECTION MODAL */}
      {!generatedBill && (
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Generate Bill
            </h2>

            <button
              type="button"
              onClick={onClose}
              className="text-xl text-gray-500 hover:text-red-600"
            >
              <FaTimes />
            </button>
          </div>

          {/* CUSTOMER DETAILS */}
          <div className="mb-6 rounded-xl bg-gray-100 p-4">
            <h3 className="text-lg font-bold text-gray-800">
              {customer?.name}
            </h3>

            <p className="text-sm text-gray-600">
              Phone: {customer?.phone}
            </p>

            <p className="text-sm text-gray-600">
              Address: {customer?.address}
            </p>
          </div>

          {/* BILL TYPE */}
          <div className="mb-5">
            <label className="mb-2 block font-semibold text-gray-700">
              Select Bill Type
            </label>

            <select
              value={billType}
              onChange={(e) => setBillType(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="receipt">
                Receipt History
              </option>

              <option value="payment">
                Payment History
              </option>
            </select>
          </div>

          {/* PERIOD */}
          <div className="mb-6">
            <label className="mb-2 block font-semibold text-gray-700">
              Select Period
            </label>

            <select
              value={billPeriod}
              onChange={(e) => setBillPeriod(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            >
              <option value="1week">
                Previous 1 Week
              </option>

              <option value="2week">
                Previous 2 Weeks
              </option>

              <option value="1month">
                Previous 1 Month
              </option>

              <option value="2month">
                Previous 2 Months
              </option>
            </select>
          </div>

          {/* GENERATE */}
          <button
            type="button"
            onClick={handleGenerateBill}
            className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-700"
          >
            Generate Bill
          </button>
        </div>
      )}

      {/* GENERATED BILL */}
      {generatedBill && (
        <div
          id="print-bill"
          className="max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-white p-8 shadow-2xl"
        >

          {/* HEADER */}
          <div className="mb-6 border-b-2 border-gray-800 pb-4 text-center">

            <h1 className="text-3xl font-bold uppercase">
              Bishnoi Fuel Station
             
            </h1>

            <p className="text-sm text-gray-600">
               <span>Fatehabad Road Aherwan (Fatehabad)</span>
            </p>
            

          </div>
          
          {/* CUSTOMER DETAILS */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            
            <div>
              <p className="text-gray-600 flex">
                Customer Name : <p className="text-black">{customer?.name}</p>
              </p>
              
            </div>

            <div>
              <p className="text-gray-600 flex">
                Phone : <p className="text-black">{customer?.phone}</p>
              </p>
            </div>

            <div>
              <p className="text-gray-600 flex">
                Address : <p className="text-black"> {customer?.address}</p>
              </p>
            </div>

            <div>
              <p className="text-gray-600 flex">
                 Date : <p className="text-black">{formatDate(new Date())}</p>
              </p>
            </div>

          </div>

          {/* BILL INFORMATION */}
          <div className="mb-6 rounded-lg p-4">

            <div className="flex gap-4 ">

              <div>
                <p className="text-gray-600 text-sm">
                  {generatedBill.billType === "receipt"
                    ? "Receipt History"
                    : "Payment History"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 flex">
                  From : <p className="font-bold">
                  {formatDate(generatedBill.fromDate)}
                </p>
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 flex">
                  To: <p className="font-bold">
                  {formatDate(generatedBill.toDate)}
                </p>
                </p>
              </div>

            </div>

          </div>

          {/* RECEIPT TABLE */}
          {generatedBill.billType === "receipt" && (
            <table className="mb-6 w-full border-collapse border border-gray-300">

              <thead>
                <tr className="bg-gray-200">

                  <th className="border p-3">
                    #
                  </th>

                  <th className="border p-3">
                    Date
                  </th>

                  <th className="border p-3">
                    Fuel Type
                  </th>

                  <th className="border p-3">
                    Vehicle No.
                  </th>
                  <th className="border p-3">
                    Amount
                  </th>

                </tr>
              </thead>

              <tbody>

                {generatedBill.data.length === 0 ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="border p-5 text-center"
                    >
                      No receipt history found
                    </td>
                  </tr>

                ) : (

                  generatedBill.data.map((receipt, index) => (

                    <tr key={receipt._id}>

                      <td className="border p-3 text-center">
                        {index + 1}
                      </td>

                      <td className="border p-3">
                        {formatDate(receipt.createdAt)}
                      </td>

                      <td className="border p-3 uppercase">
                        {receipt.fuelType}
                      </td>

                      <td className="border p-3">
                        {receipt.vehicleNumber}
                      </td>
                      <td className="border p-3 text-right">
                        ₹{Number(receipt.amount || 0).toFixed(2)}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>
          )}

          {/* PAYMENT TABLE */}
          {generatedBill.billType === "payment" && (
            <table className="mb-6 w-full border-collapse border border-gray-300">

              <thead>
                <tr className="bg-gray-200">

                  <th className="border p-3">
                    #
                  </th>

                  <th className="border p-3">
                    Date
                  </th>

                  <th className="border p-3">
                    Payment Type
                  </th>

                  <th className="border p-3">
                    Amount
                  </th>

                </tr>
              </thead>

              <tbody>

                {generatedBill.data.length === 0 ? (

                  <tr>
                    <td
                      colSpan="4"
                      className="border p-5 text-center"
                    >
                      No payment history found
                    </td>
                  </tr>

                ) : (

                  generatedBill.data.map((payment, index) => (

                    <tr key={payment._id}>

                      <td className="border p-3 text-center">
                        {index + 1}
                      </td>

                      <td className="border p-3">
                        {formatDate(payment.createdAt)}
                      </td>

                      <td className="border p-3">
                        {payment.paymentType}
                      </td>

                      <td className="border p-3 text-right">
                        ₹{Number(payment.amount || 0).toFixed(2)}
                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>
          )}

          {/* TOTAL */}
          <div className="flex justify-end border-t-2 border-gray-800 pt-4">

            <div className="text-right">

              <p className="text-lg font-semibold">
                Total Amount
              </p>

              <p className="text-2xl font-bold">
                ₹{generatedBill.totalAmount.toFixed(2)}
              </p>

            </div>

          </div>

          {/* BUTTONS */}
          <div className="mt-8 flex justify-end gap-3 print:hidden">

            <button
              type="button"
              onClick={() => setGeneratedBill(null)}
              className="rounded-lg bg-gray-500 px-5 py-3 font-semibold text-white hover:bg-gray-600"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
            >
              <FaPrint />
              Print Bill
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
            >
              Close
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default GenerateBill;