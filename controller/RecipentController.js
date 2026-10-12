import recipentModel from "../models/RecipentModel.js";
import customerModel from "../models/Customermodel.js";
import { sendSMS } from "../service/twilioService.js";
export const addRecipent = async (req, res) => {
  try {
    const {
      customerId,
      customerName,
      amount,
      vehicleNumber,
      fuelType,
      paymentStatus,
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
    const customer = await customerModel.findOne({
      _id: customerId,
      userId: userId
    })
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    console.log("CUSTOMER FOUND:", customer);
    console.log("CUSTOMER PHONE:", customer.phone);


    const receipt = await recipentModel.create({
      userId,
      customerId,
      customerName,
      amount: Number(amount),
      vehicleNumber,
      fuelType,
      paymentStatus: paymentStatus || "Pending",
    });

    const smsMessage = `Hello ${customer.name},
A new fuel receipt has been added to your account.
Fuel Type: ${fuelType}
Amount: ₹${Number(amount)}
Vehicle Number: ${vehicleNumber}
Payment Status: ${paymentStatus || "Pending"}

Thank you.`
      
     const smsResult=await sendSMS(
      customer.phone,
      smsMessage
     )
     console.log("sms :" ,smsResult);

    res.status(201).json({
      success: true,
      message: "Receipt added successfully",
      data: receipt,
      sms:smsResult
    });

  } catch (error) {
    console.error("ADD RECEIPT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add receipt",
    });
  }
};


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