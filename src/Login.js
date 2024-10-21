import React, { useState, useEffect, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Usercontext } from "./Usercontext.js";

function Login(props) {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [dirty, setDirty] = useState({ email: false, password: false });
  let [error, setError] = useState({ email: [], password: [] });
  let [message, setMessage] = useState("");

  // Global declaration of user state
  let Context = useContext(Usercontext);
  const navigate = useNavigate();

  // Validation function
  let validate = () => {
    let errorData = { email: [], password: [] };

    // Email validation
    if (!email) {
      errorData.email.push("Email cannot be blank");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errorData.email.push("Enter a valid email");
      }
    }

    // Password validation
    if (!password) {
      errorData.password.push("Password cannot be blank");
    } else {
      const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15})/;
      if (!passwordRegex.test(password)) {
        errorData.password.push(
          "Password must be 6-15 characters long and include at least one uppercase letter, one lowercase letter, and one number"
        );
      }
    }

    setError(errorData);
  };

  useEffect(validate, [email, password]);

  // On login click handler
  let onloginclick = async () => {
    let dirtyData = { ...dirty };
    Object.keys(dirty).forEach((control) => {
      dirtyData[control] = true;
    });
    setDirty(dirtyData);
    validate();

    if (isvalid()) {
      try {
        let response = await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          let responseBody = await response.json();
          if (responseBody.token) {
            // Set user details in global state (with token if applicable)
            Context.setUser({
              ...Context.user,
              isLogin: true,
              CurrentUsername: responseBody.fullName,
              CurrentUserid: responseBody.id,
              token: responseBody.token, // Store token if using JWT or session-based auth
            });

            // Redirect to Dashboard after successful login
            navigate("/Dashboard");
          } else {
            setMessage(<span className="text-danger">Invalid Login</span>);
          }
        } else {
          setMessage(<span className="text-danger">Invalid Login</span>);
        }
      } catch (error) {
        console.error("Login error:", error);
        setMessage(
          <span className="text-danger">An error occurred during login</span>
        );
      }
    }
  };

  // Function to check if the form is valid
  let isvalid = () => {
    let valid = true;
    for (let control in error) {
      if (error[control].length > 0) valid = false;
    }
    return valid;
  };

  return (
    <div className="row">
      <div className="col-lg-5 col-md-7 mx-auto">
        <div className="card border-success shadow-lg my-2">
          <div className="card-header border-bottom border-success">
            <h4
              style={{ fontSize: "28px" }}
              className="text-success text-center"
            >
              SIGN IN
            </h4>
          </div>

          <div className="card-body border-bottom border-success">
            {/* Email field */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                className="form-control"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => {
                  setDirty({ ...dirty, email: true });
                  validate();
                }}
              />
              <div className="text-danger">
                {dirty.email && error.email.length > 0 ? error.email[0] : ""}
              </div>
            </div>

            {/* Password field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onBlur={() => {
                  setDirty({ ...dirty, password: true });
                  validate();
                }}
              />
              <div className="text-danger">
                {dirty.password && error.password.length > 0
                  ? error.password[0]
                  : ""}
              </div>
            </div>
          </div>

          {/* Submit button and message */}
          <div className="card-footer border-top border-success shadow-lg">
            <div className="m-1">{message}</div>
            <button
              className="btn btn-success m-2"
              style={{ float: "right" }}
              onClick={onloginclick}
            >
              Login
            </button>
            {/* Forgot Password Link */}
            <Link
              to="/forgot-password"
              className="text-muted"
              style={{ float: "left", fontSize: "13px" }}
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
