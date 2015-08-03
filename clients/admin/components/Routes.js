/*eslint-env es6 */
'use strict';

import React from 'react';
import Router from 'react-router';
let {Route, DefaultRoute, NotFoundRoute} = Router;

import Application from './Application';
import Homepage from './Homepage';
import HomesIndexContainer from './Homes/IndexContainer';
import HomesEditContainer from './Homes/EditContainer';
import RouteNotFound from './ErrorPages/RouteNotFound';

let routes = (
  <Route name='app' path='/' handler={Application}>
    <DefaultRoute handler={Homepage}/>
    <Route name='homes' path='/homes'>
      <DefaultRoute handler={HomesIndexContainer}/>
      <Route name='homeEdit' path='edit/:id' handler={HomesEditContainer} />
    </Route>
    <NotFoundRoute handler={RouteNotFound} />
  </Route>
);

module.exports = routes;
