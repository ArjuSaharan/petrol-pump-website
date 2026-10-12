import paymentModel from "../models/paymentModel.js";
import customerModel from "../models/Customermodel.js";
import recipentModel from "../models/RecipentModel.js";

export const addPayment = async (req, res) => {
    try {
        const customerId = req.params.id;
        const { amount, paymentType } = req.body;
        const userId = req.userId;
        
        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid amount"
            });
        }
        if (!paymentType) {
            return res.status(400).json({
                success: false,
                message: "Payment type is required"
            });
        }

        if (!["cash", "online"].includes(paymentType)) {
            return res.status(400).json({
                success: false,
                message: "Payment type must be cash or online"
            });
        }

        // RECEIPTS
        const receipts = await recipentModel.find({
            customerId: customerId,
            userId: userId
        });
        if (!receipts || receipts.length === 0) {
            return res.json({
                success: false,
                message: "No receipts found for this customer"
            });
        }

        const totalReceiptAmount = receipts.reduce(
            (total, receipt) => {
                return total + Number(receipt.amount);
            },
            0
        );

        console.log(
            "TOTAL RECEIPT AMOUNT:",
            totalReceiptAmount
        );

        
        const payments = await paymentModel.find({
            customerId: customerId,
            userId: userId
        });

        
        const totalPaidAmount = payments.reduce(
            (total, payment) => {
                return total + Number(payment.amount);
            },
            0
        );

        
        const currentPending =
            totalReceiptAmount - totalPaidAmount;

        if (Number(amount) > currentPending) {
            return res.json({
                success: false,
                message:
                    `Payment cannot be greater than pending amount ₹${currentPending}`
            });
        }

        // SAVE PAYMENT
        const newPayment = await paymentModel.create({
            userId: userId,
            customerId: customerId,
            amount: Number(amount),
            paymentType: paymentType
        });

        const newPending =
            currentPending - Number(amount);

        
        if (newPending === 0) {
            await recipentModel.updateMany(
                {
                    customerId: customerId,
                    userId: userId
                },
                {
                    $set: {
                        paymentStatus: "Paid"
                    }
                }
            );        }

        return res.json({
            success: true,
            message: "Payment added successfully",
            payment: newPayment,
            totalReceiptAmount: totalReceiptAmount,
            totalPaidAmount:
                totalPaidAmount + Number(amount),
            pendingAmount: newPending
        });

    } catch (error) {

        console.error(
            "ADD PAYMENT ERROR:",
            error
        );
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};

export const getCustomerPending = async (req, res) => {
    try {
        const customerId = req.params.id;
        const userId = req.userId;
        const receipts = await recipentModel.find({
            customerId, userId
        })
        const payments = await paymentModel
            .find({ customerId, userId })
            .sort({ createdAt: -1 });

        const totalReceiptAmount = receipts.reduce(
            (total, receipt) =>
                total + Number(receipt.amount),
            0
        );

        const totalPaidAmount = payments.reduce(
            (total, payment) =>
                total + Number(payment.amount),
            0
        );

        const pendingAmount =
            totalReceiptAmount - totalPaidAmount;

        res.json({
            success: true,
            totalReceiptAmount,
            totalPaidAmount,
            pendingAmount
        });
    } catch (error) {
        console.error("Get customer payments error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
};


export const getCustomerPayments = async (req, res) => {
    try {

        const customerId = req.params.id;
        const payments = await paymentModel.find({
            customerId,
            userId: req.userId
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            payments
        });

    } catch (error) {

        console.log(error);

        res.json({
            success: false,
            message: error.message
        });
    }
};



export const getUserTotalPending = async (req, res) => {
    try {

        const userId = req.userId;
        const receipts = await recipentModel.find({
            userId
        });
        const payments = await paymentModel.find({
            userId
        });
        const totalReceiptAmount = receipts.reduce(
            (total, receipt) =>
                total + Number(receipt.amount),
            0
        );
        const totalPaidAmount = payments.reduce(
            (total, payment) =>
                total + Number(payment.amount),
            0
        );
        const totalPending =
            totalReceiptAmount - totalPaidAmount;

        res.json({
            success: true,
            totalReceiptAmount,
            totalPaidAmount,
            totalPending
        });

    } catch (error) {

        console.log("TOTAL PENDING ERROR:", error);

        res.json({
            success: false,
            message: error.message
        });
    }
};