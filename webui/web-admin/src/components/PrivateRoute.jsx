import React from "react";
import { Route, Redirect } from "react-router-dom";
// import { useAuth } from "../contexts/auth";
import { useAuth } from "../hook/use-auth";
function PrivateRoute({ children, ...rest }) {
  const { state } = useAuth();
  console.log(state);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        state.user !== null && state.customClaims.claims.admin === true ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              // state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
