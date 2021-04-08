import React from "react";
import { Grid } from "@material-ui/core";

import AdminRoute from "../components/AdminRoute";
import {TopBar} from "../layouts/TopBar";
import Menu from "./Menu";

const Admin = () => {
  
  return (
    <>
   
      <TopBar />
      <Grid container style={{ height: "100%" }}>
        <Grid item xs={12} sm={5} md={3} lg={2}>
          <Menu />
        </Grid>
        <Grid item xs={12} sm={7} md={9} lg={10}>
          <AdminRoute />
        </Grid>
      </Grid>
    </>
  );
};

export default Admin;
