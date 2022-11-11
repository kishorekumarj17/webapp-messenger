import React,{useContext} from "react";
import {AuthContext} from '../auth';
import {Navigate } from "react-router-dom";

const PrivateRoute=({children})=>{
    const {user}=useContext(AuthContext)
    return user ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;