/*eslint-env es6 */
"use strict";

import React from "react";
import Router from "react-router";
let {Route, DefaultRoute, NotFoundRoute} = Router;

import Application from "./Application";
import Homepage from "./Homepage";

import HomeStory from "./Home/Story";
import HomeDetails from "./Home/Details";
import HomeRouteNotFound from "./ErrorPages/HomeRouteNotFound";

let routes = (
  <Route name="app" path="/" handler={Application}>
    <DefaultRoute handler={Homepage}/>
    <Route name="home" path="/home/:slug">
      <Route name="homeDetails" path="details" handler={HomeDetails} />
      <DefaultRoute handler={HomeStory}/>
      <NotFoundRoute handler={HomeRouteNotFound} />
    </Route>
  </Route>
);

module.exports = routes;
