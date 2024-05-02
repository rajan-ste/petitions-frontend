import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Petitions from './components/Petitions';
import NotFound from './components/NotFound';
import Header from './components/common/Header';

function App() {
  return (
   <div className="App">
      <Router>
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/petitions" element={<Petitions/>}/>
            <Route path="*" element={<NotFound/>}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
