import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Usercontext } from "./Usercontext.js";
function Navbar(props) {
  let Context = useContext(Usercontext);
  let isLogout = (event) => {
    event.preventDefault();
    Context.setUser({
      isLogin: false,
      CurentUsername: null,
      currentUserId: null,
    });
    window.location.hash = "/";
  };
  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-dark bg-secondary navbar-style">
        <div className="container-fluid">
          <NavLink className="navbar-brand text-white">LOGIN PAGE</NavLink>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav me-auto">
              {Context.user.isLogin ? (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard">
                    Dashboard
                  </NavLink>
                </li>
              ) : (
                " "
              )}
              {!Context.user.isLogin ? (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/">
                    Login
                  </NavLink>
                </li>
              ) : (
                ""
              )}
              {!Context.user.isLogin ? (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Register
                  </NavLink>
                </li>
              ) : (
                ""
              )}
            </ul>
            {Context.user.isLogin ? (
              <ul className="navbar-nav ms-auto">
                <li className="nav-item dropdown">
                  <NavLink
                    className="nav-link dropdown-toggle"
                    to="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {Context.user.CurrentUsername}
                  </NavLink>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <NavLink
                        className="dropdown-item"
                        to="/Logout" 
                        onClick={isLogout}
                      >
                        Logout
                      </NavLink>
                    </li>
                  </ul>
                </li>
              </ul>
            ) : (
              ""
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
export default Navbar;
