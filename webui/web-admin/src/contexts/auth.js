// import React, { createContext, useContext, useState } from "react";
// import { fakeAuth, checkUser } from "../auth/auth";

// export const authContext = createContext();
// export const ProvideAuth = ({ children }) => {
//   const auth = useProvideAuth();
//   return <authContext.Provider value={auth}>{children}</authContext.Provider>;
// };

// export const useAuth = () => {
//   return useContext(authContext);
// };

// function useProvideAuth() {
//   let key = null;
//   if (sessionStorage.getItem("LOCALKEY")) {
//     if (checkUser(sessionStorage.getItem("LOCALKEY"))) {
//       key = sessionStorage.getItem("LOCALKEY");
//       console.log(key);
//     } else {
//       console.log("REMOVE KEY");
//       sessionStorage.removeItem("LOCALKEY");
//     }
//   }
//   console.log(key);
//   const [user, setUser] = useState(key);
//   console.log(user);

//   const signin = (cb) => {
//     return fakeAuth.signin(() => {
//       sessionStorage.setItem(
//         "LOCALKEY",
//         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6InRyYW5taW5odGFpMTk5OEBnbWFpbC5jb20ifQ.GNRIeA2XrgEvy8_MCpnbHi7nehPxNU001AOT2W4s0Cc"
//       );
//       setUser(
//         "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6InRyYW5taW5odGFpMTk5OEBnbWFpbC5jb20ifQ.GNRIeA2XrgEvy8_MCpnbHi7nehPxNU001AOT2W4s0Cc"
//       );
//       cb();
//     });
//   };

//   const signout = (cb) => {
//     return fakeAuth.signout(() => {
//       sessionStorage.removeItem("LOCALKEY");
//       setUser(null);
//     });
//   };

//   return {
//     user,
//     signin,
//     signout,
//   };
// }
