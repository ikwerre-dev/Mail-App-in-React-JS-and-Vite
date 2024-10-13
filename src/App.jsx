import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Write from './pages/Write';
import ViewMail from './pages/ViewMail';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/write" element={<Write />} />
        <Route path="/mail/:id" element={<ViewMail />} />

      </Routes>
    </Router>
  );
};

export default App;
