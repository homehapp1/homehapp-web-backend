/*eslint-env es6 */


import React from 'react';
import Router from 'react-router';
let {Route, DefaultRoute, NotFoundRoute} = Router;

import Application from './Application';
import Homepage from './Homepage';
import RouteNotFound from './ErrorPages/RouteNotFound';

// Homes
import HomesIndex from './Homes';
import HomesCreateContainer from './Homes/CreateContainer';
import HomesEditContainer from './Homes/EditContainer';
import HomesDeleteContainer from './Homes/DeleteContainer';

// Agents
import AgentsIndexContainer from './Agents/IndexContainer';

// Neighborhoods
import Neighborhoods from './Neighborhoods';
import NeighborhoodsEditContainer from './Neighborhoods/EditContainer';

// Contact requests
import Contacts from './Contacts';
import ContactsViewContainer from './Contacts/ViewContainer';

// Homes
import UsersIndexContainer from './Users/IndexContainer';
import UsersCreateContainer from './Users/CreateContainer';
import UsersEditContainer from './Users/EditContainer';
import UsersDeleteContainer from './Users/DeleteContainer';

// Pages
import PagesIndex from './Pages';
import PagesCreate from './Pages/Create';
import PagesEdit from './Pages/Edit';
import PagesDelete from './Pages/Delete';

let routes = (
  <Route name='app' path='/' handler={Application}>
    <DefaultRoute handler={Homepage}/>
    <Route name='homes' path='/homes'>
      <DefaultRoute handler={HomesIndex}/>
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
      <DefaultRoute handler={Neighborhoods}/>
      <Route name='neighborhoodsAll' path='all' handler={Neighborhoods} />
      <Route name='neighborhoodDelete' path=':id/delete' handler={NeighborhoodsEditContainer} />
      <Route name='neighborhoodEdit' path=':id' handler={NeighborhoodsEditContainer}>
        <Route name='neighborhoodEditTab' path=':tab' handler={NeighborhoodsEditContainer} />
      </Route>
    </Route>
    <Route name='pages' path='/pages'>
      <DefaultRoute handler={PagesIndex} />
      <Route name='pageCreate' path='create' handler={PagesCreate} />
      <Route name='pageDelete' path=':id/delete' handler={PagesDelete} />
      <Route name='pageEdit' path=':id' handler={PagesEdit}>
        <Route name='pageEditTab' path=':tab' handler={PagesEdit} />
      </Route>
    </Route>
    <Route name='contacts' path='/contacts'>
      <DefaultRoute handler={Contacts}/>
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
