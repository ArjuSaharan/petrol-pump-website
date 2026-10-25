
import React, { useState } from "react";
import { FaTimes, FaPrint } from "react-icons/fa";

const GenerateBill = ({
  customer,
  receipts = [],
  payments = [],
  onClose,
}) => {
  const [billType, setBillType] = useState("ledger");
  const [billPeriod, setBillPeriod] = useState("1month");
  const [generatedBill, setGeneratedBill] = useState(null);

  const money = (amount) =>
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const getDateRange = () => {
    const toDate = new Date();
    toDate.setHours(23, 59, 59, 999);

    const fromDate = new Date();
    fromDate.setHours(0, 0, 0, 0);

    switch (billPeriod) {
      case "1week":
        fromDate.setDate(fromDate.getDate() - 7);
        break;
      case "2week":
        fromDate.setDate(fromDate.getDate() - 14);
        break;
      case "1month":
        fromDate.setMonth(fromDate.getMonth() - 1);
        break;
      case "2month":
        fromDate.setMonth(fromDate.getMonth() - 2);
        break;
      default:
        fromDate.setDate(fromDate.getDate() - 7);
    }

    return { fromDate, toDate };
  };

  const handleGenerateBill = () => {
    const { fromDate, toDate } = getDateRange();

    const validReceipts = receipts.filter(
      (item) =>
        item.createdAt &&
        !Number.isNaN(new Date(item.createdAt).getTime())
    );

    const validPayments = payments.filter(
      (item) =>
        item.createdAt &&
        !Number.isNaN(new Date(item.createdAt).getTime())
    );

    // Keep the existing individual history reports.
    if (billType !== "ledger") {
      const sourceData =
        billType === "receipt" ? validReceipts : validPayments;

      const filteredData = sourceData
        .filter((item) => {
          const date = new Date(item.createdAt);
          return date >= fromDate && date <= toDate;
        })
        .sort(
          (a, b) =>
            new Date(a.createdAt) - new Date(b.createdAt)
        );

      const totalAmount = filteredData.reduce(
        (total, item) => total + Number(item.amount || 0),
        0
      );

      setGeneratedBill({
        billType,
        fromDate,
        toDate,
        data: filteredData,
        totalAmount,
      });

      return;
    }

    // Opening balance = transactions before the selected period.
    const previousReceipts = validReceipts
      .filter((item) => new Date(item.createdAt) < fromDate)
      .reduce(
        (total, item) => total + Number(item.amount || 0),
        0
      );

    const previousPayments = validPayments
      .filter((item) => new Date(item.createdAt) < fromDate)
      .reduce(
        (total, item) => total + Number(item.amount || 0),
        0
      );

    const openingBalance = previousReceipts - previousPayments;

    // Combine receipts and payments into one ledger.
    const receiptTransactions = validReceipts
      .filter((item) => {
        const date = new Date(item.createdAt);
        return date >= fromDate && date <= toDate;
      })
      .map((item) => ({
        _id: `receipt-${item._id}`,
        date: new Date(item.createdAt),
        particulars: [
          item.vehicleNumber || "Vehicle",
          item.fuelType || "Fuel",
          item.customerName || customer?.name || "",
        ]
          .filter(Boolean)
          .join(" - "),
        debit: Number(item.amount || 0),
        credit: 0,
        transactionType: "receipt",
      }));

    const paymentTransactions = validPayments
      .filter((item) => {
        const date = new Date(item.createdAt);
        return date >= fromDate && date <= toDate;
      })
      .map((item) => ({
        _id: `payment-${item._id}`,
        date: new Date(item.createdAt),
        particulars: `Payment Received (${item.paymentType || "Payment"})`,
        debit: 0,
        credit: Number(item.amount || 0),
        transactionType: "payment",
      }));

    const transactions = [
      ...receiptTransactions,
      ...paymentTransactions,
    ].sort((a, b) => a.date - b.date);

    let runningBalance = openingBalance;

    const ledgerRows = transactions.map((item) => {
      runningBalance += item.debit - item.credit;

      return {
        ...item,
        balance: runningBalance,
      };
    });

    const debitTotal = transactions.reduce(
      (total, item) => total + item.debit,
      0
    );

    const creditTotal = transactions.reduce(
      (total, item) => total + item.credit,
      0
    );

    setGeneratedBill({
      billType: "ledger",
      fromDate,
      toDate,
      ledgerRows,
      openingBalance,
      debitTotal,
      creditTotal,
      closingBalance: runningBalance,
    });
  };

  const balanceLabel = (balance) => {
    if (balance < 0) return `${money(Math.abs(balance))} Cr`;
    return `${money(balance)} Dr`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 print:static print:block print:bg-white print:p-0">
      {!generatedBill && (
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl print:hidden">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">
              Generate Bill
            </h2>

            <button type="button" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <div className="mb-6 rounded-xl bg-gray-100 p-4">
            <h3 className="text-lg font-bold">{customer?.name}</h3>
            <p className="text-sm text-gray-600">
              Phone: {customer?.phone}
            </p>
            <p className="text-sm text-gray-600">
              Address: {customer?.address}
            </p>
          </div>

          <label className="mb-2 block font-semibold">
            Select Bill Type
          </label>

          <select
            value={billType}
            onChange={(e) => setBillType(e.target.value)}
            className="mb-5 w-full rounded-lg border p-3"
          >
            <option value="ledger">Customer Ledger</option>
            <option value="receipt">Receipt History</option>
            <option value="payment">Payment History</option>
          </select>

          <label className="mb-2 block font-semibold">
            Select Period
          </label>

          <select
            value={billPeriod}
            onChange={(e) => setBillPeriod(e.target.value)}
            className="mb-6 w-full rounded-lg border p-3"
          >
            <option value="1week">Previous 1 Week</option>
            <option value="2week">Previous 2 Weeks</option>
            <option value="1month">Previous 1 Month</option>
            <option value="2month">Previous 2 Months</option>
          </select>

          <button
            type="button"
            onClick={handleGenerateBill}
            className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white"
          >
            Generate Bill
          </button>
        </div>
      )}

      {generatedBill && (
        <div
          id="print-bill"
          className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-xl bg-white p-8 shadow-2xl print:max-h-none print:w-full print:max-w-none print:overflow-visible print:rounded-none print:p-4 print:shadow-none"
        >
          <div className="mb-5 border-b-2 border-gray-800 pb-4 text-center">
            <h1 className="text-3xl font-bold uppercase">
              Bishnoi Fuel Station
            </h1>
            <p className="text-sm text-gray-600">
              Fatehabad Road Aherwan (Fatehabad)
            </p>
            <h2 className="mt-3 text-xl font-bold">
              {generatedBill.billType === "ledger"
                ? "CUSTOMER LEDGER STATEMENT"
                : generatedBill.billType === "receipt"
                ? "RECEIPT HISTORY"
                : "PAYMENT HISTORY"}
            </h2>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-3 text-sm">
            <p>
              Customer Name:{" "}
              <strong>{customer?.name || "-"}</strong>
            </p>
            <p>
              Phone: <strong>{customer?.phone || "-"}</strong>
            </p>
            <p>
              Address: <strong>{customer?.address || "-"}</strong>
            </p>
            <p>
              Statement Date: <strong>{formatDate(new Date())}</strong>
            </p>
            <p>
              Period:{" "}
              <strong>
                {formatDate(generatedBill.fromDate)} to{" "}
                {formatDate(generatedBill.toDate)}
              </strong>
            </p>
          </div>

          {generatedBill.billType === "ledger" && (
            <>
              {/* <div className="mb-3 flex justify-between border-y border-gray-400 py-3 text-sm font-semibold">
                <span>Opening Balance</span>
                <span>
                  ₹{balanceLabel(generatedBill.openingBalance)}
                </span>
              </div> */}

              <table className="mb-5 w-full border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-400 p-2">Date</th>
                    <th className="border border-gray-400 p-2 text-left">
                      Particulars
                    </th>
                    <th className="border border-gray-400 p-2 text-right">
                      Debit (₹)
                    </th>
                    <th className="border border-gray-400 p-2 text-right">
                      Credit (₹)
                    </th>
                    <th className="border border-gray-400 p-2 text-right">
                      Balance (₹)
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {generatedBill.ledgerRows.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="border p-5 text-center">
                        No transactions found for this period.
                      </td>
                    </tr>
                  ) : (
                    generatedBill.ledgerRows.map((row) => (
                      <tr key={row._id}>
                        <td className="border border-gray-400 p-2 whitespace-nowrap">
                          {formatDate(row.date)}
                        </td>
                        <td className="border border-gray-400 p-2">
                          {row.particulars}
                        </td>
                        <td className="border border-gray-400 p-2 text-right">
                          {row.debit ? money(row.debit) : "-"}
                        </td>
                        <td className="border border-gray-400 p-2 text-right">
                          {row.credit ? money(row.credit) : "-"}
                        </td>
                        <td className="border border-gray-400 p-2 text-right whitespace-nowrap">
                          {balanceLabel(row.balance)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>

                <tfoot>
                  <tr className="bg-gray-100 font-bold">
                    <td
                      colSpan={2}
                      className="border border-gray-400 p-2 text-right"
                    >
                      Period Total
                    </td>
                    <td className="border border-gray-400 p-2 text-right">
                      {money(generatedBill.debitTotal)}
                    </td>
                    <td className="border border-gray-400 p-2 text-right">
                      {money(generatedBill.creditTotal)}
                    </td>
                    <td className="border border-gray-400 p-2" />
                  </tr>
                </tfoot>
              </table>

              <div className="ml-auto max-w-sm space-y-2 border-t-2 border-gray-800 pt-4">
                {/* <div className="flex justify-between">
                  <span>Opening Balance</span>
                  <span>₹{balanceLabel(generatedBill.openingBalance)}</span>
                </div> */}
                <div className="flex justify-between">
                  <span>Total Debit</span>
                  <span>₹{money(generatedBill.debitTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Credit</span>
                  <span>₹{money(generatedBill.creditTotal)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-400 pt-2 text-lg font-bold">
                  <span>Closing Balance</span>
                  <span>
                    ₹{balanceLabel(generatedBill.closingBalance)}
                  </span>
                </div>
              </div>
            </>
          )}

          {generatedBill.billType === "receipt" && (
            <HistoryTable
              data={generatedBill.data}
              type="receipt"
              formatDate={formatDate}
              money={money}
            />
          )}

          {generatedBill.billType === "payment" && (
            <HistoryTable
              data={generatedBill.data}
              type="payment"
              formatDate={formatDate}
              money={money}
            />
          )}

          {generatedBill.billType !== "ledger" && (
            <div className="flex justify-end border-t-2 border-gray-800 pt-4">
              <div className="text-right">
                <p className="font-semibold">Total Amount</p>
                <p className="text-2xl font-bold">
                  ₹{money(generatedBill.totalAmount)}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3 print:hidden">
            <button
              type="button"
              onClick={() => setGeneratedBill(null)}
              className="rounded-lg bg-gray-500 px-5 py-3 font-semibold text-white"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white"
            >
              <FaPrint /> Print Bill
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function HistoryTable({ data, type, formatDate, money }) {
  const isReceipt = type === "receipt";

  return (
    <table className="mb-6 w-full border-collapse text-sm">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-3">#</th>
          <th className="border p-3">Date</th>
          <th className="border p-3">
            {isReceipt ? "Fuel Type" : "Payment Type"}
          </th>
          {isReceipt && <th className="border p-3">Vehicle No.</th>}
          <th className="border p-3 text-right">Amount (₹)</th>
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={isReceipt ? 5 : 4} className="border p-5 text-center">
              No {isReceipt ? "receipt" : "payment"} history found.
            </td>
          </tr>
        ) : (
          data.map((item, index) => (
            <tr key={item._id}>
              <td className="border p-3 text-center">{index + 1}</td>
              <td className="border p-3">{formatDate(item.createdAt)}</td>
              <td className="border p-3">
                {isReceipt ? item.fuelType : item.paymentType}
              </td>
              {isReceipt && (
                <td className="border p-3">{item.vehicleNumber}</td>
              )}
              <td className="border p-3 text-right">
                {money(item.amount)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default GenerateBill;
