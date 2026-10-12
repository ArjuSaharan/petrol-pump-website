import recipentModel from "../models/RecipentModel.js";
import customerModel from "../models/Customermodel.js";


export const getDashboard= async (req,res)=>{
    try{

        const totalCustomers = await customerModel.countDocuments({
            userId: req.userId
        });

        const pendingReceipts = await recipentModel.find({
            userId: req.userId,
            paymentStatus: "Pending"
        });

        const totalPending = pendingReceipts.reduce(
            (total, receipt) => total + Number(receipt.amount || 0),
            0
        );

        return res.json({
            success: true,
            data: {
                totalCustomers,
                totalPending
            }
        });

    }
    catch(error){
        console.error("DASHBOARD SUMMARY ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard data"
        });
    }

}