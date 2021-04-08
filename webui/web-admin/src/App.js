import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
// import Route from "./components/PrivateRoute";
import { ProvideAuth } from "./hook/use-auth";
import { SnackbarProvider } from 'material-ui-snackbar-provider'

// import "@fortawesome/fontawesome-free/css/all.min.css";
// import "bootstrap-css-only/css/bootstrap.min.css";
// import "mdbreact/dist/css/mdb.css";

import Admin from "./pages/Admin";
import {Layout} from "./layouts/Layout"
import {Login} from "./layouts/Login"
function App() {
  return (
    <div className="App">
    <SnackbarProvider SnackbarProps={{ autoHideDuration: 3000 }}>
      <ProvideAuth>
          <Router>
            <Layout>
              <Switch>
                  <Route exact path="/">
                    {/* <Admin></Admin> */}
                    <Redirect push to="/admin" />
                  </Route>
                  <Route path="/admin">
                    <Admin />
                  </Route>
              </Switch>
            </Layout>
          </Router>
        </ProvideAuth>
    </SnackbarProvider>
      
    </div>
  );
}

export default App;
