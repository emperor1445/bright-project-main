import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";

// DEV shim: avoid "process is not defined" runtime errors in browser bundles
window.process = window.process || { env: {} };

// global demo user id
window.APP_USER_ID = window.APP_USER_ID || "demoUser";

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route path={`/auth`} component={AuthLayout} />
      <Route path={`/admin`} component={AdminLayout} />
      <Redirect exact from="/" to="/auth/signin" />
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);
