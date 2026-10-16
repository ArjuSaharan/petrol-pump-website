import mongoose from "mongoose";
import customerModel from "../models/Customermodel.js";


export const customerAdd = async (req, res) => {
    const { name, phone, address } = req.body;

    if (!name || !phone || !address) {
        return res.json({ success: false, message: "enter the complete details" });
    }
    try {
        const user = new customerModel({
            userId: req.userId,
            name, phone, address
        });
        await user.save();

        return res.status(201).json({
            success: true,
            message: "Customer added successfully",
            user,
        });
    }
    catch (error) {
        return res.json({ success: false, message: error.message });
    }


}

export const deleteCustomer = async (req, res) => {
    try {
        const user = await customerModel.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });
        if (!user) {
            return res.json({ success: false, messgae: "customer not found" });
        }
        // await user.save();
        return res.json({ success: true, message: "account delted successfully" });

    }
    catch (error) {
        return res.json({ success: false, message: error.message });
    }
}


export const editcustomer = async (req, res) => {

    try {
        const user = await customerModel.findByIdAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId,
            },
            {
                name: req.body.name,
                phone: req.body.phone,
                address: req.body.address
            },
            { new: true });
        if (!user) {
            return res.json({ success: false, message: "customer not found" });
        }
        return res.json({
            success: true, message: "customer updated successfully",
            customer: user
        });
    }
    catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export const getcustomer = async (req, res) => {
    try {
        const customer = await customerModel.findOne(
            {
                _id: req.params.id,
                userId: req.userId,

            });
        if (!customer) {
            return res.json({ success: false, message: "account not found" });
        }
        return res.json({ success: true, customer })
    }
    catch (error) {
        return res.json({ success: false, message: error.message });
    }
}