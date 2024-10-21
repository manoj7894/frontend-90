import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Usercontext } from "./Usercontext.js";

const Register = () => {
  const navigate = useNavigate();
  const Context = useContext(Usercontext);

  const [state, setState] = useState({
    email: "",
    password: "",
    fullName: "",
    country: "",
    mobile: "",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // Step 1: Registration Form, Step 2: OTP Verification
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [registeredUser, setRegisteredUser] = useState(null);

  const [error, setError] = useState({
    email: [],
    password: [],
    fullName: [],
    mobile: [],
    country: [],
  });

  const [dirty, setDirty] = useState({
    email: false,
    password: false,
    fullName: false,
    mobile: false,
    country: false,
  });

  const [message, setMessage] = useState("");

  const [countries] = useState([
    { id: 1, country: "Select Country" },
    { id: 2, country: "USA" },
    { id: 3, country: "Canada" },
    { id: 4, country: "India" },
    { id: 5, country: "UK" },
    { id: 6, country: "Australia" },
  ]);

  const validate = () => {
    let errorData = {};

    // Email validation
    errorData.email = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!state.email) {
      errorData.email.push("Email can't be blank");
    } else if (!emailRegex.test(state.email)) {
      errorData.email.push("Enter a valid email");
    }

    // Password validation
    errorData.password = [];
    const validPasswordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,15})/;
    if (!state.password) {
      errorData.password.push("Password can't be blank");
    } else if (!validPasswordRegex.test(state.password)) {
      errorData.password.push(
        "Password should be 6-15 characters long with at least one uppercase letter, one lowercase letter, and one digit"
      );
    }

    // Full name validation
    errorData.fullName = [];
    if (!state.fullName) {
      errorData.fullName.push("Full name can't be blank");
    }

    // Country validation
    errorData.country = [];
    if (!state.country || state.country === "Select Country") {
      errorData.country.push("Please select a country");
    }

    // Mobile validation
    errorData.mobile = [];
    if (!state.mobile) {
      errorData.mobile.push("Mobile number can't be blank");
    }

    setError(errorData);
  };

  useEffect(validate, [state]);

  const isValid = () => {
    for (let control in error) {
      if (error[control].length > 0) {
        return false;
      }
    }
    return true;
  };

  const onRegisterClick = async () => {
    let dirtyData = { ...dirty };
    Object.keys(dirty).forEach((control) => {
      dirtyData[control] = true;
    });
    setDirty(dirtyData);
    validate();

    if (isValid()) {
      // Generate OTP
      const otp = Math.floor(1000 + Math.random() * 9000);

      let response = await fetch("http://localhost:5000/users", {
        method: "POST",
        body: JSON.stringify({
          email: state.email,
          password: state.password,
          fullName: state.fullName,
          mobile: state.mobile,
          country: state.country,
          otp: otp, // Send OTP to the database
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        setStep(2); // Move to OTP verification step
        setGeneratedOtp(otp); // Store the generated OTP
        setRegisteredUser({ fullName: state.fullName });
        setMessage(<span className="text-success">OTP sent successfully</span>);
      } else {
        setMessage(
          <span className="text-danger">Error during registration</span>
        );
      }
    } else {
      setMessage(
        <span className="text-danger">Please correct the errors</span>
      );
    }
  };

  const handleOtpSubmit = async () => {
    const response = await fetch("http://localhost:5000/users", {
      method: "POST",
      body: JSON.stringify({
        email: state.email,
        otp: otp,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();
    if (result.success && parseInt(otp) === generatedOtp) {
      // Update the context with user details
      Context.setUser({
        ...Context.user,
        isLogin: true,
        CurrentUsername: registeredUser.fullName,
      });
      navigate("/Dashboard");
    } else {
      alert("Incorrect OTP, please try again");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6 col-lg-4">
        <div className="card p-4 shadow">
          {step === 1 && (
            <div>
              <h2 className="text-center mb-4">Sign Up</h2>

              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="fullName">Full Name:</label>
                <input
                  type="text"
                  id="fullName"
                  className="form-control"
                  value={state.fullName}
                  onChange={(event) =>
                    setState({ ...state, fullName: event.target.value })
                  }
                  onBlur={() => setDirty({ ...dirty, fullName: true })}
                />
                <div className="text-danger">
                  {dirty.fullName && error.fullName.join(", ")}
                </div>
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  value={state.email}
                  onChange={(event) =>
                    setState({ ...state, email: event.target.value })
                  }
                  onBlur={() => setDirty({ ...dirty, email: true })}
                />
                <div className="text-danger">
                  {dirty.email && error.email.join(", ")}
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  className="form-control"
                  value={state.password}
                  onChange={(event) =>
                    setState({ ...state, password: event.target.value })
                  }
                  onBlur={() => setDirty({ ...dirty, password: true })}
                />
                <div className="text-danger">
                  {dirty.password && error.password.join(", ")}
                </div>
              </div>

              {/* Mobile */}
              <div className="form-group">
                <label htmlFor="mobile">Mobile Number:</label>
                <input
                  type="tel"
                  className="form-control"
                  value={state.mobile}
                  onChange={(event) =>
                    setState({ ...state, mobile: event.target.value })
                  }
                  onBlur={() => setDirty({ ...dirty, mobile: true })}
                />
                <div className="text-danger">
                  {dirty.mobile && error.mobile.join(", ")}
                </div>
              </div>

              {/* Country */}
              <div className="form-group">
                <label htmlFor="country">Country:</label>
                <select
                  className="form-control"
                  value={state.country}
                  onChange={(event) =>
                    setState({ ...state, country: event.target.value })
                  }
                  onBlur={() => setDirty({ ...dirty, country: true })}
                >
                  {countries.map((country) => (
                    <option key={country.id} value={country.country}>
                      {country.country}
                    </option>
                  ))}
                </select>
                <div className="text-danger">
                  {dirty.country && error.country.join(", ")}
                </div>
              </div>

              {/* Register Button */}
              <div className="text-center">
                {message}
                <button
                  className="btn btn-primary mt-3 w-100"
                  onClick={onRegisterClick}
                >
                  Register
                </button>
              </div>
            </div>
          )}

          {/* OTP Verification */}
          {step === 2 && (
            <div className="card mt-5">
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="otp" className="form-label">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                  />
                </div>
                <div className="text-center">
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleOtpSubmit}
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
