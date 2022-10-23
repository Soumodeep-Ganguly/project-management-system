import React from "react";
import { Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";

import SignIn from './Pages/SignIn';
import Dashboard from "./Pages/Dashboard";
import SignUp from "./Pages/SignUp";
import Add from "./Pages/Technologies/Add";
import Technologies from "./Pages/Technologies";

export default function PublicRoute() {
  return (
    <div className="wrapper" style={{ overflowX: "hidden" }}>
        <Routes>
            <Route path='/sign-in' element={<SignIn/>} />
            <Route path='/sign-up' element={<SignUp/>} />
            <Route element={<ProtectedRoute/>}>
              <Route path='/' element={<Dashboard/>} />

              <Route path='/technologies' element={<Technologies/>} />
              <Route path='/technologies/add' element={<Add/>} />

            </Route>
            <Route path='/*' element={<div>
                Not Found
            </div>} />
        </Routes>
    </div>
  );
}
