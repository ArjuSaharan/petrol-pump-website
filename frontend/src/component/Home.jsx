import React from 'react'
import Navbar from '../pages/Navbar'
import Header from '../pages/Header'

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[url('https://i.pinimg.com/736x/27/b7/0d/27b70d7146353bd8002a7282a644057e.jpg')] bg-cover bg-center">
        <Navbar/>
        <Header/>
    </div>
  )
}

export default Home