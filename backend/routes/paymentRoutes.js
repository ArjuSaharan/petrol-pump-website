import express from "express";
import { addPayment, getCustomerPayments, getCustomerPending, getUserTotalPending } from "../controller/paymentController.js";
import userAuth from "../middleware/userAuth.js";
const router=express.Router();


router.post("/pay/:id",userAuth,addPayment);
router.get('/pay/:id',userAuth,getCustomerPayments);
router.get('/pending/:id',userAuth,getCustomerPending);
router.get("/total-pending",userAuth,getUserTotalPending);

export default router;