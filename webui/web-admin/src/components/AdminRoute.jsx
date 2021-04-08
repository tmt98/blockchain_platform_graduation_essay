import React from "react";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import Dashboard from "../Views/Dashboard";
import DeviceManager from "../Views/DeviceManager";
import UserManager from "../Views/UserManager";

const AdminRoute = () => {
  return (
    <Switch>
      {/* <Route exact path="/admin/dashboard">
        <Dashboard />
      </Route> */}
      <Route exact path="/admin/devicemanager">
        <DeviceManager />
      </Route>
      {/* <Route exact path="/admin/usermanager">
        <UserManager />
      </Route> */}
    </Switch>
  );
};

export default AdminRoute;
