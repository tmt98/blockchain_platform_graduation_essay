import React, { useState, useEffect, useContext, createContext } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import { toaster } from 'baseui/toast'
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyCFoqpUGjvJIBYGC5pMa_SjFGpbe7_WHmg',
    authDomain: 'luanvan-iot-final.firebaseapp.com',
    databaseURL: 'https://luanvan-iot-final.firebaseio.com',
    projectId: 'luanvan-iot-final',
    storageBucket: 'luanvan-iot-final.appspot.com',
    messagingSenderId: '976679303624',
    appId: '1:976679303624:web:91bca95efe0bbbe446a8fd',
    measurementId: 'G-2Q73T8TBYW',
  })
}

// if (!firebase.apps.length) {
//   firebase.initializeApp({
//     apiKey: "AIzaSyA-GH0jZCClR2nYfWb5dbL2wJzkpFPjJg8",
//     authDomain: "iot-blockchain-64e27.firebaseapp.com",
//     databaseURL: "https://iot-blockchain-64e27.firebaseio.com",
//     projectId: "iot-blockchain-64e27",
//     storageBucket: "iot-blockchain-64e27.appspot.com",
//     messagingSenderId: "348471051563",
//     appId: "1:348471051563:web:710c1b36533f862a87b16e",
//     measurementId: "G-EGLBQ622NR"
//   })
// }

export const fbase = firebase
export const db = firebase.firestore()

const authContext: any = createContext({})

export function ProvideAuth({ children }: any) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

function useProvideAuth() {
  //const history = useHistory();
  const [state, setState] = useState({
    initializing: true,
    user: null,
    customClaims: null,
  })

  async function onChange(user: any) {
    if (user) {
      console.log('on change')
      const tokenResult: any = await firebase
        .auth()
        .currentUser!.getIdTokenResult()

      setState({ initializing: false, user, customClaims: tokenResult })
    } else {
      console.log('NO change')
      setState({
        ...state,
        initializing: false,
        user: null,
        customClaims: null,
      })
    }
  }

  // const signin = async (email: string, password: string) => {
  //   try {

  //     const v = await firebase
  //       .auth()
  //       .signInWithEmailAndPassword(email, password)

  //     toaster.positive(`Auth with ${v.user!.email}`, {
  //       autoHideDuration: 5000,
  //     })
  //   } catch (error) {
  //     toaster.warning(error.message, {
  //       autoHideDuration: 5000,
  //     })
  //   }
  // }

  const signin = async (email: string, password: string) => {
    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(async function () {
        // const v = await firebase
        //   .auth()
        //   .signInWithEmailAndPassword(email, password)

        // toaster.positive(`Auth with ${v.user!.email}`, {
        //   autoHideDuration: 5000,
        // })
        //return v;
        let provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().useDeviceLanguage()
        const v = await firebase.auth().signInWithPopup(provider)

        toaster.positive(`Auth with Google`, {
          autoHideDuration: 5000,
        })
        return v
      })
      .catch(function (error) {
        toaster.warning(error.message, {
          autoHideDuration: 5000,
        })
      })
  }
  const signout = () => {
    //history.push('/')
    sessionStorage.clear()
    return firebase.auth().signOut()
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(onChange)
    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    state,
    signin,
    signout,
  }
}
