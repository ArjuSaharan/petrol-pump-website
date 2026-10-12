import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from './component/Register'
import Main from './component/Main'
import Home from './component/Home'
import { ToastContainer } from 'react-toastify'
import { AppContextProvider } from './context/AppContext'
import AddAccount from './userspage/AddAccount'
import EditCustomer from './userspage/EditCustomer'
import AddRecipentform from './viewoneCustomer.jsx/AddRecipentform'
import UserList from './userspage/UserList'
import OneCustomer from './viewoneCustomer.jsx/OneCustomer'
import PaymentDetail from './viewoneCustomer.jsx/PaymentDetail'
import GenerateBill from './viewoneCustomer.jsx/GenerateBill'
import ProtectRoute from './component/ProtectRoute'
import PublicRoute from './component/PublicRoute'
const App = () => {
  return (
    <AppContextProvider>
      <div>
        <ToastContainer />
        <Routes>
          <Route element={<PublicRoute/>}>
            <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<ProtectRoute/>}>
            <Route path="/user" element={<Main />}>
            <Route index element={<UserList />} />
            <Route path="addaccount" element={<AddAccount />} />
            <Route path="editcustomer/:id" element={<EditCustomer />} />
            <Route path="view/:id" element={<OneCustomer />} />
            <Route path="addrecipent/:id" element={<AddRecipentform />} />
            <Route path="payment/:id" element={<PaymentDetail />} />

          </Route>
          </Route>
        </Routes>
      </div>
    </AppContextProvider>
  )
}

export default App