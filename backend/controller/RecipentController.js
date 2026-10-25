import recipentModel from "../models/RecipentModel.js";
import customerModel from "../models/Customermodel.js";
import { sendSMS } from "../utils/sendSMS.js";

export const addRecipent = async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      amount,
      vehicleNumber,
      fuelType,
      paymentStatus = "Pending",
    } = req.body;

    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (
      !customerId ||
      !customerName ||
      amount === undefined ||
      !vehicleNumber ||
      !fuelType
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields are required",
      });
    }

    const receiptAmount = Number(amount);

    if (!Number.isFinite(receiptAmount) || receiptAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a valid number greater than zero",
      });
    }

    if (!["Petrol", "Diesel"].includes(fuelType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid fuel type",
      });
    }

    if (!["Pending", "Paid"].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Payment status must be Pending or Paid",
      });
    }

    const customer = await customerModel.findOne({
      _id: customerId,
      userId,
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Create the receipt
    const receipt = await recipentModel.create({
      userId,
      customerId,
      customerName,
      amount: receiptAmount,
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      fuelType,
      paymentStatus,
    });

    // Only Pending receipts increase the outstanding balance
    if (paymentStatus === "Pending") {
      await customerModel.updateOne(
        { _id: customerId, userId },
        { $inc: { totalPending: receiptAmount } }
      );
    }

    const smsMessage =
      `Hello ${customer.name}, fuel receipt added: ${fuelType}, ` +
      `Rs ${receiptAmount}, Vehicle ${vehicleNumber.trim().toUpperCase()}, ` +
      `Payment ${paymentStatus}. Thank you.`;

    let smsResult;

    try {
      smsResult = await sendSMS(customer.phone, smsMessage);
    } catch (smsError) {
      console.error("SMS ERROR:", smsError.message);

      smsResult = {
        success: false,
        error: smsError.message,
      };
    }

    return res.status(201).json({
      success: true,
      message: "Receipt added successfully",
      data: receipt,
      pendingAdded: paymentStatus === "Pending" ? receiptAmount : 0,
      sms: smsResult,
    });
  } catch (error) {
    console.error("ADD RECEIPT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add receipt",
    });
  }
};
// export const addRecipent = async (req, res) => {
//   try {
//     const {
//       customerId,
//       customerName,
//       amount,
//       vehicleNumber,
//       fuelType,
//       paymentStatus,
//     } = req.body;

//     const userId = req.userId;

//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "User not authenticated",
//       });
//     }

//     if (
//       !customerId ||
//       !customerName ||
//       amount === undefined ||
//       !vehicleNumber ||
//       !fuelType
//     ) {
//       return res.status(400).json({
//         success: false,
//         message: "All required fields are required",
//       });
//     }
//     const customer = await customerModel.findOne({
//       _id: customerId,
//       userId: userId
//     })
//     if (!customer) {
//       return res.status(404).json({
//         success: false,
//         message: "Customer not found"
//       });
//     }

//     const receipt = await recipentModel.create({
//       userId,
//       customerId,
//       customerName,
//       amount: Number(amount),
//       vehicleNumber,
//       fuelType,
//       paymentStatus: paymentStatus || "Pending",
//     });

// const smsMessage = `Hello ${customer.name}, fuel receipt added: ${fuelType}, Rs ${Number(amount)}, Vehicle ${vehicleNumber}, Payment ${paymentStatus || "Pending"}. Thank you.`;

// // A failed SMS must not make the whole request fail, because the receipt is already saved

// //FOR QUICK MODE
// let smsResult;
// try {
//   smsResult = await sendSMS(customer.phone, smsMessage);
// } catch (smsError) {
//   console.error("SMS ERROR:", smsError.message);
//   smsResult = { success: false, error: smsError.message };
// }

// // FOR DLT MODE
// // let smsResult;
// // try {
// //   smsResult = await sendSMS(customer.phone, "fuelReceipt", [
// //     customer.name,
// //     fuelType,
// //     Number(amount),
// //     vehicleNumber,
// //     paymentStatus || "Pending",
// //   ]);
// // } catch (smsError) {
// //   console.error("SMS ERROR:", smsError.message);
// //   smsResult = { success: false, error: smsError.message };
// // }

// res.status(201).json({
//   success: true,
//   message: "Receipt added successfully",
//   data: receipt,
//   sms: smsResult,
// });

//   } catch (error) {
//     console.error("ADD RECEIPT ERROR:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to add receipt",
//     });
//   }
// };


export const getUserRecipents = async (req, res) => {
  try {
    const userId = req.userId;
    const { customerId } = req.params;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }
    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }
    const reciepts = await recipentModel.find({
      userId: userId,
      customerId: customerId
    }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: reciepts,
    });

  }
  catch (error) {
    console.error("GET RECEIPTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get receipts"
    });
  }
}