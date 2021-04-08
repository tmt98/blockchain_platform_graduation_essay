import React, { useState, useEffect, useContext, createContext } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { useHistory } from "react-router-dom";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";

// // {
// //   apiKey: "AIzaSyDUnozcahXIVhLOFxSNsyzmiXUa6sefkTY",
// //   authDomain: "iotbaseonfabric.firebaseapp.com",
// //   databaseURL: "https://iotbaseonfabric.firebaseio.com",
// //   projectId: "iotbaseonfabric",
// //   storageBucket: "iotbaseonfabric.appspot.com",
// //   messagingSenderId: "1028990275388",
// //   appId: "1:1028990275388:web:398fbc8ae9a8446c559839",
// //   measurementId: "G-JHZP0BRYCN",
// // };

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyCFoqpUGjvJIBYGC5pMa_SjFGpbe7_WHmg",
    authDomain: "luanvan-iot-final.firebaseapp.com",
    databaseURL: "https://luanvan-iot-final.firebaseio.com",
    projectId: "luanvan-iot-final",
    storageBucket: "luanvan-iot-final.appspot.com",
    messagingSenderId: "976679303624",
    appId: "1:976679303624:web:e5f01bdcfd6d0fb346a8fd",
    measurementId: "G-FX303DMKTB",
  });
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStylesAlert = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export const fbase = firebase;
export const db = firebase.firestore();

const authContext = createContext({});

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const history = useHistory();
  const [state, setState] = useState({
    initializing: true,
    user: null,
    customClaims: null,
  });

  async function onChange(user) {
    if (user) {
      console.log("on change");
      const tokenResult = await firebase.auth().currentUser.getIdTokenResult();
      setState({ initializing: false, user, customClaims: tokenResult });
    } else {
      console.log("NO change");
      setState({
        ...state,
        initializing: false,
        user: null,
        customClaims: null,
      });
    }
  }

  const signin = async (email, password) => {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(async function () {
        try {
          const v = await firebase
            .auth()
            .signInWithEmailAndPassword(email, password);

          const idtoken = await v.user.getIdToken();
          const result = await axios({
            method: "POST",
            url: "http://localhost:4002/api/admin/setcustomclaims",
            headers: {
              Authorization: "Bearer " + idtoken,
            },
          });

          // console.log(result.data);
          const data = result.data;
          if (data.status == "success" && data) {
            const newtoken = await firebase.auth().currentUser.getIdToken(true);
            console.log("oke", newtoken);
            // toaster.positive(`Auth with ${v.user.email}`, {
            //   autoHideDuration: 5000,
            // });
            <Snackbar open={true} autoHideDuration={5000}>
              <Alert severity="success">{`Auth with ${v.user.email}`}</Alert>
            </Snackbar>;
            history.replace("/");
          } else {
            // toaster.warning("Auth error user does not a admin", {
            //   autoHideDuration: 5000,
            // });
            <Snackbar open={true} autoHideDuration={5000}>
              <Alert severity="success">
                {"Auth error user does not a admin"}
              </Alert>
            </Snackbar>;
            firebase.auth().signOut();
          }
        } catch (err) {
          console.log(err);
          <Snackbar open={true} autoHideDuration={5000}>
            <Alert severity="success">{err.message}</Alert>
          </Snackbar>;
        }
        // const v = await firebase
        //   .auth()
        //   .signInWithEmailAndPassword(email, password);

        // toaster.positive(`Auth with ${v.user.email}`, {
        //   autoHideDuration: 5000,
        // });
        // return v;
      })
      .catch(function (error) {
        // toaster.warning(error.message, {
        //   autoHideDuration: 5000,
        // });
        <Snackbar open={true} autoHideDuration={5000}>
          <Alert severity="success">{error.message}</Alert>
        </Snackbar>;
      });
  };

  const signout = () => {
    //history.push('/')
    sessionStorage.clear();
    return firebase.auth().signOut();
  };

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange);
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    state,
    signin,
    signout,
  };
}
