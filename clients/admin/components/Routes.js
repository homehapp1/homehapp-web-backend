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
import HomesCreateContainer from './Homes/CreateContainer';
import HomesEditContainer from './Homes/EditContainer';
import HomesDeleteContainer from './Homes/DeleteContainer';

// Homes
import AgentsIndexContainer from './Agents/IndexContainer';
import AgentsEditContainer from './Agents/EditContainer';
import AgentsCreateContainer from './Agents/CreateContainer';

// Neighborhoods
import NeighborhoodsIndexContainer from './Neighborhoods/IndexContainer';
import NeighborhoodsEditContainer from './Neighborhoods/EditContainer';

let routes = (
  <Route name='app' path='/' handler={Application}>
    <DefaultRoute handler={Homepage}/>
    <Route name='homes' path='/homes'>
      <DefaultRoute handler={HomesIndexContainer}/>
      <Route name='homeCreate' path='create' handler={HomesCreateContainer} />
      <Route name='homeEdit' path='edit/:id' handler={HomesEditContainer} />
      <Route name='homeDelete' path='delete/:id' handler={HomesDeleteContainer} />
    </Route>
    <Route name='agents' path='/agents'>
      <DefaultRoute handler={AgentsIndexContainer}/>
      <Route name='agentCreate' path='create' handler={AgentsCreateContainer} />
      <Route name='agentEdit' path='edit/:id' handler={AgentsEditContainer} />
    </Route>
    <Route name='neighborhoods' path='/neighborhoods'>
      <DefaultRoute handler={NeighborhoodsIndexContainer}/>
      <Route name='neighborhoodEdit' path='edit/:id' handler={NeighborhoodsEditContainer} />
    </Route>
    <NotFoundRoute handler={RouteNotFound} />
  </Route>
);

module.exports = routes;
