import React from "react";
// import firebase from "../config/firebase";

import DeviceTable from "../components/DeviceTable";
import { Grid, Typography } from "@material-ui/core";

const DeviceManager = () => {
  return (
    <>
      <div style={{ marginTop: "30px" }}>
        <div style={{ textAlign: "center" }}>QUẢN LÝ THIẾT BỊ</div>
      </div>
      <Grid container>
        <Grid item xs={12}>
          <div
            style={{
              marginLeft: "2px",
              marginTop: "20px",
              marginBottom: "20px",
              marginRight: "20px",
            }}
          >
            <DeviceTable />
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default DeviceManager;
