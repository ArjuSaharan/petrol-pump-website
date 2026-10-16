import express from 'express'
import { customerAdd, deleteCustomer, editcustomer, getcustomer } from '../controller/customerController.js';
import { getCustomeData } from '../controller/customerdata.js';
import userAuth from '../middleware/userAuth.js';
const router=express.Router();


router.post('/add',userAuth,customerAdd);
router.post('/delete/:id',userAuth,deleteCustomer);
router.put('/edit/:id',userAuth,editcustomer);
router.get('/all',userAuth,getCustomeData);
router.get('/:id',userAuth,getcustomer);

export default router