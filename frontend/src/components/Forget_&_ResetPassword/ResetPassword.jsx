import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPasswordAPI } from "../../services/employeeFunctions";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const handleReset = async () => {
    const res = await resetPasswordAPI(token, password);

    if (!res.success) {
      alert(res.message);
      return;
    }

    alert("Password reset successful");
    navigate("/login");
  };

  return (
    <div className="container mt-5">
      <h3>Reset Password</h3>

      <input
        type="password"
        className="form-control mt-3"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn btn-success mt-3" onClick={handleReset}>
        Update Password
      </button>
    </div>
  );
}

export default ResetPassword;