import React, { useState } from "react";
import Register from "./Register.js";
import Login from "./Login.js";
import NotFound from "./NotFound.js";
import Dashboard from "./Dashboard.js";
import { HashRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar.js";
import Password from "./Password.js";
import { Usercontext } from "./Usercontext.js";
function App(props) {
  let [user, setUser] = useState({
    isLogin: false,
    CurrentUserid: null,
    CurrentUsername: null,
  });
  return (
    <Usercontext.Provider value={{ user, setUser }}>
      <HashRouter>
        <Navbar />
        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<Password />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </HashRouter>
    </Usercontext.Provider>
  );
}

export default App;
