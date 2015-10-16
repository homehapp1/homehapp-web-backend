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

// Neighborhoods
import NeighborhoodsIndexContainer from './Neighborhoods/IndexContainer';
import NeighborhoodsEditContainer from './Neighborhoods/EditContainer';

// Contact requests
import ContactsIndexContainer from './Contacts/IndexContainer';
import ContactsViewContainer from './Contacts/ViewContainer';

// Homes
import UsersIndexContainer from './Users/IndexContainer';
import UsersCreateContainer from './Users/CreateContainer';
import UsersEditContainer from './Users/EditContainer';
import UsersDeleteContainer from './Users/DeleteContainer';

let routes = (
  <Route name='app' path='/' handler={Application}>
    <DefaultRoute handler={Homepage}/>
    <Route name='homes' path='/homes'>
      <DefaultRoute handler={HomesIndexContainer}/>
      <Route name='homeCreate' path='create' handler={HomesCreateContainer} />
      <Route name='homeDelete' path=':id/delete' handler={HomesDeleteContainer} />
      <Route name='homeEdit' path=':id' handler={HomesEditContainer}>
        <Route name='homeEditTab' path=':tab' handler={HomesEditContainer} />
      </Route>
    </Route>
    <Route name='agents' path='/agents'>
      <DefaultRoute handler={AgentsIndexContainer}/>
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
    <Route name='users' path='/users'>
      <DefaultRoute handler={UsersIndexContainer}/>
      <Route name='userCreate' path='create' handler={UsersCreateContainer} />
      <Route name='userDelete' path=':id/delete' handler={UsersDeleteContainer} />
      <Route name='userEdit' path=':id' handler={UsersEditContainer}>
        <Route name='userEditTab' path=':tab' handler={UsersEditContainer} />
      </Route>
    </Route>
    <NotFoundRoute handler={RouteNotFound} />
  </Route>
);

module.exports = routes;
