import express from 'express'
import { getuserdata } from '../controller/userdata.js';
import userAuth from '../middleware/userAuth.js';
import { requestLoginOtp, verifyLoginOtp } from '../controller/otpLoginController.js';
const useroute=express.Router();

useroute.get('/userdata',userAuth,getuserdata);
useroute.post('/login/request-otp',requestLoginOtp);
useroute.post('/login/verify-otp',verifyLoginOtp);

export default useroute;