import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import Home from './Pages/Home';
import Footer from './Components/Footer';
import Navbar from './Components/Navbar';
// import AboutUs from './pages/AboutUs';
// import Library from './pages/Library';

import './App.css';

function App() {
  return (
    <Router>
      <div>

        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/about-us" element={<AboutUs />} />
          <Route path="/library" element={<Library />} /> */}
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
