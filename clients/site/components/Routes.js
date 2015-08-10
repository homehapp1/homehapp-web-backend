/*eslint-env es6 */
'use strict';

import React from 'react';
import Router from 'react-router';
let {Route, DefaultRoute, NotFoundRoute} = Router;

import Application from './Application';
import Homepage from './Homepage';

import HomeContainer from './Home/HomeContainer';
import HomeDetailsContainer from './Home/HomeDetailsContainer';
import HomeRouteNotFound from './ErrorPages/HomeRouteNotFound';

import PropertyFilter from './Property/Filter';

let routes = (
  <Route name='app' path='/' handler={Application}>
    <DefaultRoute handler={Homepage}/>
    <Route name='home' path='/home/:slug'>
      <Route name='homeDetails' path='details' handler={HomeDetailsContainer} />
      <DefaultRoute handler={HomeContainer}/>
      <NotFoundRoute handler={HomeRouteNotFound} />
    </Route>
    <Route name='properties' path='/properties'>
      <Route name='propertiesMode' path=':mode' handler={PropertyFilter} />
      <DefaultRoute handler={PropertyFilter} />
    </Route>
  </Route>
);

module.exports = routes;
