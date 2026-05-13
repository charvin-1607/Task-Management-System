import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  // const {employee} = useSelector((state) => state.auth);
  const { employee, authChecked, fetchMyDetailsRequest } = useSelector((state) => state.auth);

  // ✅ STEP 1: WAIT first
  if (fetchMyDetailsRequest.loading || !authChecked) {
    return <h3>Checking authentication...</h3>;
  }

  // ✅ STEP 2: now check login
  if (!employee) {
    return <Navigate to="/login" />;
  }

 // console.log("in ProtectedRoute component employee = ", employee);

  //  Role not allowed
  if (allowedRoles && !allowedRoles.includes(employee.role)) {
    return <h3>Access Denied</h3>;
  }

 

  //  Allowed
  return children;
}

export default ProtectedRoute;