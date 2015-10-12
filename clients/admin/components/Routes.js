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

// Agents
import AgentsIndexContainer from './Agents/IndexContainer';
import AgentsCreateContainer from './Agents/CreateContainer';
import AgentsEditContainer from './Agents/EditContainer';
import AgentsDeleteContainer from './Agents/DeleteContainer';

// Neighborhoods
import NeighborhoodsIndexContainer from './Neighborhoods/IndexContainer';
import NeighborhoodsEditContainer from './Neighborhoods/EditContainer';

// Contact requests
import ContactsIndexContainer from './Contacts/IndexContainer';
import ContactsViewContainer from './Contacts/ViewContainer';

let routes = (
  <Route name='app' path='/' handler={Application}>
    <DefaultRoute handler={Homepage}/>
    <Route name='homes' path='/homes'>
      <DefaultRoute handler={HomesIndexContainer}/>
      <Route name='homeCreate' path='create' handler={HomesCreateContainer} />
      <Route name='homeEdit' path=':id' handler={HomesEditContainer}>
        <Route name='homeEditTab' path=':tab' handler={HomesEditContainer} />
      </Route>
      <Route name='homeDelete' path=':id/delete' handler={HomesDeleteContainer} />
    </Route>
    <Route name='agents' path='/agents'>
      <DefaultRoute handler={AgentsIndexContainer}/>
      <Route name='agentCreate' path='create' handler={AgentsCreateContainer} />
      <Route name='agentEdit' path=':id' handler={AgentsEditContainer} />
      <Route name='agentDelete' path=':id/delete' handler={AgentsDeleteContainer} />
    </Route>
    <Route name='neighborhoods' path='/neighborhoods'>
      <DefaultRoute handler={NeighborhoodsIndexContainer}/>
      <Route name='neighborhoodEdit' path=':id' handler={NeighborhoodsEditContainer} />
      <Route name='neighborhoodDelete' path=':id/delete' handler={NeighborhoodsEditContainer} />
    </Route>
    <Route name='contacts' path='/contacts'>
      <DefaultRoute handler={ContactsIndexContainer}/>
      <Route name='contactView' path=':id' handler={ContactsViewContainer} />
      <Route name='contactDelete' path=':id/delete' handler={ContactsViewContainer} />
    </Route>
    <NotFoundRoute handler={RouteNotFound} />
  </Route>
);

module.exports = routes;
