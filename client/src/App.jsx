import { useState } from 'react'
import './App.css'
import { Route, Routes } from "react-router-dom";
import Hero from './pages/Hero';
import About from './pages/About';
import Contact from './pages/Contact';
import Activities from './pages/Activities';
import Admission from './pages/Admission';
import PaymentCallback from './pages/PaymentCallback';
import FileUploadPage from './pages/FileUploadPage';
import Notice from './pages/Notice';
import Gallery from './pages/Gallery';
import Articles from './pages/Articles';
import Admin from './adminSection/Admin';
import AdminDashboard from './adminSection/AdminDashboard';
import AddActivities from './adminSection/AddActivities';
import ApproveSection from './adminSection/ApproveSection';
import Payment from './adminSection/Payment';
import StudentData from './adminSection/StudentData';
import Messages from './adminSection/Messages';
import CreateAdminUser from './pages/CreateAdminUser';
import TestAuth from './pages/TestAuth';




function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/activities' element={<Activities />} />
        <Route path='/admission-section' element={<Admission />} />
        <Route path='/admission-section/payment-callback' element={<PaymentCallback />} />
        <Route path='/file-upload' element={<FileUploadPage />} />
        <Route path='/notice' element={<Notice />} />
        <Route path='/gallery' element={<Gallery />} />
        <Route path='/articles' element={<Articles />} />
        {/* Admin User Creation */}
        <Route path='/create-admin' element={<CreateAdminUser />} />
        {/* Test Auth */}
        <Route path='/test-auth' element={<TestAuth />} />
        {/* Admin Routes */}
        <Route path='/admin' element={<Admin />}>
          <Route index element={<AdminDashboard />} />
          <Route path='students' element={<StudentData />} />
          <Route path='payments' element={<Payment />} />
          <Route path='approve' element={<ApproveSection />} />
          <Route path='activities' element={<AddActivities />} />
          <Route path='messages' element={<Messages />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
