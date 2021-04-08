import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import "./Dashboard.css";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const Dasdboard = () => {
  const classes = useStyles();
  return (
    // <Grid container spacing={3} style={{ height: "100%" }}>
    //   <Grid item xs={12}>
    //     <Paper square className={classes.paper}>
    //       {process.env.REACT_APP_SECRET_KEY}
    //     </Paper>
    //   </Grid>
    // </Grid>
    // <div className="view intro-2">
    //   <div className="full-bg-img">
    //     <div className="mask rgba-black-strong flex-center">
    //       <div className="container">
    //         <div className="white-text text-center wow fadeInUp">
    //           <h2>This Navbar isn't fixed</h2>
    //           <h5>When you scroll down it will disappear</h5>
    //           <br />
    //           <p>
    //             Full page intro with background image will be always displayed
    //             in full screen mode, regardless of device{" "}
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div>ABC</div>
  );
};

export default Dasdboard;
