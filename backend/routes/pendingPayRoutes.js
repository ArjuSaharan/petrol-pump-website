import express from "express";
const router =express.Router();

import userAuth from "../middleware/userAuth.js";
import { getDashboard } from "../controller/PendingPayment.js";

router.get('/summary',userAuth,getDashboard);

export default router;