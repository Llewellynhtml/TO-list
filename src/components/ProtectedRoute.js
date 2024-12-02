import React from "react";
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ element: Element }) => {
  const user = localStorage.getItem("user"); 


  return user ? <Element /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
