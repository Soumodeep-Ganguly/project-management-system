import React from "react";
import { Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "./ProtectedRoute";

import SignIn from './Pages/SignIn';
import Dashboard from "./Pages/Dashboard";
import TwoStep from "./Pages/TwoStep";
import Country from "./Pages/Locations/Country";
import State from "./Pages/Locations/State";
import City from "./Pages/Locations/City";
import Building from "./Pages/Locations/Building";
import Floor from "./Pages/Locations/Floor";
import Screen from "./Pages/Locations/Screen";
import Add from "./Pages/Users/Add";
import Users from "./Pages/Users";

export default function PublicRoute() {
  return (
    <div className="wrapper" style={{ overflowX: "hidden" }}>
        <Routes>
            <Route path='/sign-in' element={<SignIn/>} />
            <Route path='/two-step-verification' element={<TwoStep/>} />
            <Route element={<ProtectedRoute/>}>
              <Route path='/' element={<Dashboard/>} />

              {/* Users */}
              <Route path='/add-user' element={<Add/>} />
              <Route path='/edit-user/:userID' element={<Add/>} />
              <Route path='/all-users' element={<Users/>} />
              
              {/* Locations */}
              <Route path='/location/countries' element={<Country/>} />
              <Route path='/location/states' element={<State/>} />
              <Route path='/location/cities' element={<City/>} />
              <Route path='/location/buildings' element={<Building/>} />
              <Route path='/location/floors' element={<Floor/>} />
              <Route path='/location/screens' element={<Screen/>} />

            </Route>
            <Route path='/*' element={<div>
                Not Found
            </div>} />
        </Routes>
    </div>
  );
}
