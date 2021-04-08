import React from "react";
import { useHistory, useLocation } from "react-router-dom";
// import { useAuth } from "../contexts/auth";
import {useAuth,fbase} from "../hook/use-auth"
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import MuiAlert from "@material-ui/lab/Alert"
import Snackbar from '@material-ui/core/Snackbar';
import { useSnackbar } from 'material-ui-snackbar-provider'
import CircularProgress from '@material-ui/core/CircularProgress';

import axios from 'axios'
function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="#">
        IOT BASE ON FABRIC
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  toast: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const Login = () => {
  let history = useHistory();
  // let location = useLocation();
  // let auth = useAuth();
  // let { from } = location.state || { from: { pathname: "/" } };
  // let login = () => {
  //   auth.signin(() => {
  //     history.replace(from);
  //   });
  // };
  const {signin} = useAuth()

  const [email, setemail] = React.useState("");
  const [password, setpassword] = React.useState("");
  const classes = useStyles();
  const snackbar = useSnackbar()

  const handleSomething = () => {
    snackbar.showMessage(
      'Something happened!'
    )
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Email:", email, "Password: ", password);
    // You should see email and password in console.
    // ..code to submit form to backend here...
    // signin(email,password);
    <div className={classes.root}>
      <CircularProgress  color="secondary" />
    </div>
    fbase
    .auth()
    .setPersistence(fbase.auth.Auth.Persistence.SESSION)
    .then(async function () {

      try {
        const v = await fbase
          .auth()
          .signInWithEmailAndPassword(email, password);
    
        const idtoken = await v.user.getIdToken();
        const result = await axios({
          method: "POST",
          url: "http://192.168.0.100:4002/api/admin/setcustomclaims",
          headers: {
            Authorization: "Bearer " + idtoken,
          },
        });

        // console.log(result.data);
        const data = result.data;
        if (data.status == "success" && data) {
          const newtoken = await fbase.auth().currentUser.getIdToken(true);
          console.log("oke" ,newtoken);
          // history.replace('/admin')
          snackbar.showMessage(`Auth with ${v.user.email}`)
        }else{
          snackbar.showMessage(`Auth error user does not a admin`)
          fbase.auth().signOut();
        }
      } catch (err) {
        console.log(err);
        fbase.auth().signOut();
        snackbar.showMessage(`Auth error : ${err}`)
      }
      
    })
    .catch(function (error) {
      console.log(error.message)
      snackbar.showMessage(`Auth error : ${error.message}`)
    });
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Admin Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onInput={(e) => setemail(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onInput={(e) => setpassword(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Sign In
          </Button>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
};

// export default Login;
