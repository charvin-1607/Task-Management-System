import React, { useState } from "react";
import { forgotPasswordAPI } from "../../services/employeeFunctions";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    const res = await forgotPasswordAPI(email);

    if (!res.success) {
      alert(res.message);
      return;
    }

    alert("Reset link sent to your email (check console for now)");
  };

  return (
    <div className="container mt-5">
      <h3>Forgot Password</h3>

      <input
        type="email"
        className="form-control mt-3"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button className="btn btn-primary mt-3" onClick={handleSubmit}>
        Send Reset Link
      </button>
    </div>
  );
}

export default ForgotPassword;