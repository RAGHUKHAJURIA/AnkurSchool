import { useState } from 'react'
import './App.css'
import { Route, Routes } from "react-router-dom";
import Hero from './pages/Hero';
import About from './pages/About';
import Contact from './pages/Contact';
import Activities from './pages/Activities';
import Admission from './pages/Admission';
import Notice from './pages/Notice';
import Gallery from './pages/Gallery';
import Articles from './pages/Articles';
import Admin from './adminSection/Admin';
import AddActivities from './adminSection/AddActivities';
import ApproveSection from './adminSection/ApproveSection';
import Payment from './adminSection/Payment';
import StudentData from './adminSection/StudentData';




function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/activities' element={<Activities />} />
        <Route path='/admission-section' element={<Admission />} />
        <Route path='/notice' element={<Notice />} />
        <Route path='/gallery' element={<Gallery />} />
        <Route path='/articles' element={<Articles />} />
        // admin Routes
        <Route path='/admin' element={<Admin />} />
        <Route path='/admin/add-activity' element={<AddActivities />} />
        <Route path='/admin/approve-requests' element={<ApproveSection />} />
        <Route path='/admin/payment-section' element={<Payment />} />
        <Route path='/admin/student-details' element={<StudentData />} />
      </Routes>
    </div>
  )
}

export default App
