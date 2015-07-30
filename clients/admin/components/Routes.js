/*eslint-env es6 */
"use strict";

import React from "react";
import Router from "react-router";
let {Route, DefaultRoute, NotFoundRoute} = Router;

import Application from "./Application";
import Homepage from "./Homepage";

import RouteNotFound from "./ErrorPages/RouteNotFound";

let routes = (
  <Route name="app" path="/" handler={Application}>
    <DefaultRoute handler={Homepage}/>
    <NotFoundRoute handler={RouteNotFound} />
  </Route>
);

module.exports = routes;
