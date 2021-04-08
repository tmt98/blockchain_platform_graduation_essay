export const fakeAuth = {
  isAuthenticated: false,
  signin(cb) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100);
  },
  signout(cb) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  },
};

export const checkUser = (token) => {
  const serectKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6InRyYW5taW5odGFpMTk5OEBnbWFpbC5jb20ifQ.GNRIeA2XrgEvy8_MCpnbHi7nehPxNU001AOT2W4s0Cc";
  if (serectKey.localeCompare(token) === 0) {
    console.log("true");
    console.log(serectKey.localeCompare(token));
    return true;
  } else {
    console.log("false");
    console.log(serectKey.localeCompare(token));
    return false;
  }
};
