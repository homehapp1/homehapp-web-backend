/*eslint-env es6 */
'use strict';

import React from 'react';
import Router from 'react-router';
let {Route, DefaultRoute, NotFoundRoute} = Router;

import Application from './Application';
import Homepage from './Homepage';
import RouteNotFound from './ErrorPages/RouteNotFound';

// Homes
import HomesIndexContainer from './Homes/IndexContainer';
import HomesEditContainer from './Homes/EditContainer';

// eighborhoods
import NeighborhoodsIndexContainer from './Neighborhoods/IndexContainer';
import NeighborhoodsEditContainer from './Neighborhoods/EditContainer';

let routes = (
  <Route name='app' path='/' handler={Application}>
    <DefaultRoute handler={Homepage}/>
    <Route name='homes' path='/homes'>
      <DefaultRoute handler={HomesIndexContainer}/>
      <Route name='homeEdit' path='edit/:id' handler={HomesEditContainer} />
    </Route>
    <Route name='neighborhoods' path='/neighborhoods'>
      <DefaultRoute handler={NeighborhoodsIndexContainer}/>
      <Route name='neighborhoodEdit' path='edit/:id' handler={NeighborhoodsEditContainer} />
    </Route>
    <NotFoundRoute handler={RouteNotFound} />
  </Route>
);

module.exports = routes;
