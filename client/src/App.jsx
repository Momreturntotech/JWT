import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
   <div>
    <ToastContainer/>
    <Routes>
      <Route path="/" element={<Home/>}/>
       <Route path="/login" element={<Login/>}/>
        <Route path="/emailverify" element={<EmailVerify/>}/>
         <Route path="/resetpassword" element={<ResetPassword/>}/>
          <Route path="/" element={<Home/>}/>
          
     
    </Routes>
   </div>
  )
}

export default App