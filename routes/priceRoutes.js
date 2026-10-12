import express from 'express';
import { getFuelPrice, updateFuelPrice } from '../controller/fuelPrice.js';
const router=express.Router();
import userAuth from '../middleware/userAuth.js'

router.get('/',userAuth,getFuelPrice);
router.put("/",userAuth,updateFuelPrice);

export default router;