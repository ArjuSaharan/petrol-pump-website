import express from 'express'
import { addRecipent, getUserRecipents } from '../controller/RecipentController.js';
import authMiddle from '../middleware/authMiddle.js';
const router=express.Router();

router.post('/recipients/:customerId',authMiddle,addRecipent);
router.get("/recipients/:customerId",authMiddle,getUserRecipents);

export default router;