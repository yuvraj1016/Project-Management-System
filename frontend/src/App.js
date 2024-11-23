import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Home from './Components/Home';
import Signup from './Components/Signup';
import User from './Components/User';
import Prof from './Components/Prof';
import Error from './Components/Error';
import Navigation from './Components/Navigation';
import './App.css';

function App() {
  const Auth = Cookies.get("auth");
  const ProfAuth = Cookies.get("profauth");

  return (
    <div className="app-container">
      <Navigation Auth={Auth} ProfAuth={ProfAuth} />
      <main className="main-content">
        <Routes>
          {!Auth && !ProfAuth && (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
            </>
          )}
          {Auth && <Route path="/user" element={<User />} />}
          {ProfAuth && <Route path="/prof" element={<Prof />} />}
          <Route path="/error" element={<Error />} />
          <Route path="*" element={<Navigate to="/error" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

