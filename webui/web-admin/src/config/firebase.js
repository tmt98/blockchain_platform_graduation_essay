// import firebase from "firebase/app";
// import "firebase/firestore";
// import "firebase/auth";
// const apiKey = process.env.REACT_APP_FIREBASE_apiKey;
// const authDomain = process.env.REACT_APP_FIREBASE_authDomain;
// const databaseURL = process.env.REACT_APP_FIREBASE_databaseURL;
// const projectId = process.env.REACT_APP_FIREBASE_projectId;
// const storageBucket = process.env.REACT_APP_FIREBASE_storageBucket;
// const messagingSenderId = process.env.REACT_APP_FIREBASE_messagingSenderId;
// const appId = process.env.REACT_APP_FIREBASE_appId;
// const measurementId = process.env.REACT_APP_FIREBASE_measurementId;

// const firebaseConfig = {
//   apiKey: apiKey,
//   authDomain: authDomain,
//   databaseURL: databaseURL,
//   projectId: projectId,
//   storageBucket: storageBucket,
//   messagingSenderId: messagingSenderId,
//   appId: appId,
//   measurementId: measurementId,
// };
// // const firebaseConfig = {
// //   apiKey: "AIzaSyDUnozcahXIVhLOFxSNsyzmiXUa6sefkTY",
// //   authDomain: "iotbaseonfabric.firebaseapp.com",
// //   databaseURL: "https://iotbaseonfabric.firebaseio.com",
// //   projectId: "iotbaseonfabric",
// //   storageBucket: "iotbaseonfabric.appspot.com",
// //   messagingSenderId: "1028990275388",
// //   appId: "1:1028990275388:web:398fbc8ae9a8446c559839",
// //   measurementId: "G-JHZP0BRYCN",
// // };

// firebase.initializeApp(firebaseConfig);
// firebase
//   .auth()
//   .signInWithEmailAndPassword("admin@test.com", "123456")
//   .then((user) => {
//     // Signed in
//     console.log("SIGN IN");
//     // ...
//   })
//   .catch((error) => {
//     var errorCode = error.code;
//     var errorMessage = error.message;
//   });
// export default firebase;
