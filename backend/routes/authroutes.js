import express from 'express'
import { login, logout, userRegsiter } from '../controller/userController.js';

const authroute=express.Router();

authroute.post('/register',userRegsiter);
authroute.post('/login',login);
authroute.post('/logout',logout);

export default authroute;