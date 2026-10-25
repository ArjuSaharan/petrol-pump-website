import express from 'express'
import cookieParser from 'cookie-parser';
import authroute from './routes/authroutes.js';
import useroute from './routes/userroute.js';
import cors from 'cors'
import customerRoute from './routes/customerroute.js';
import recipentRoutes from './routes/recieptRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js';
// import notificationRoutes from './routes/notificationRoute.js'
import priceRoutes from './routes/priceRoutes.js'
import pendingPayRoute from './routes/pendingPayRoutes.js';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
dotenv.config();
const app = express();



const allowedorigin = 'https://bishnoi-fuel.onrender.com';

app.use(cors({ origin: allowedorigin, credentials: true }))
app.use(express.json());
app.use(cookieParser());


// app.get("/",(req,res)=>{
//     res.send("welcome to home apge");
// })
app.use('/auth', authroute);
app.use('/data', useroute);
app.use('/customer', customerRoute);
app.use('/fuel', priceRoutes);
app.use('/detail', recipentRoutes);
app.use('/amount', paymentRoutes);
// app.use('/notification', notificationRoutes)
app.use('/dashboard', pendingPayRoute);

const port = 3000;
app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
    connectDB()

})
