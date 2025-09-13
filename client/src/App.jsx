import { useState } from 'react'
import './App.css'
import { Route, Routes } from "react-router-dom";
import Hero from './pages/Hero';
import About from './pages/About';
import Contact from './pages/Contact';
import Activities from './pages/Activities';
import Admission from './pages/Admission';
import Content from './pages/Content';



function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/activities' element={<Activities />} />
        <Route path='/admission-section' element={<Admission />} />
         <Route path='/content' element={<Content />} />
      </Routes>
    </div>
  )
}

export default App
