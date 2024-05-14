import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Petitions from './components/Petitions';
import NotFound from './components/NotFound';
import Header from './components/common/Header';
import Petition from './components/Petition';
import Register from './components/Register';
import Login from './components/Login';
import Account from './components/Account';
import useStore from './store';
import Create from './components/Create';

function App() {
  const { token } = useStore();
  return (
   <div className="App">
      <Router>
        <div>
          <Header />
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/petitions" element={<Petitions/>}/>
            <Route path="/petitions/:id" element={<Petition />}/>
            <Route path="/register" element={token ? <Navigate to="/account" /> : <Register />}/>
            <Route path="/login" element={token ? <Navigate to="/account" /> : <Login />} />
            <Route path="/account" element={token ? <Account /> : <Navigate to="/login" /> }/>
            <Route path="/account/create" element={token ? <Create /> : <Navigate to="/login" /> }/>
            <Route path="*" element={<NotFound/>}/>
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
