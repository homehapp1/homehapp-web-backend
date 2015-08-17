/*eslint-env es6 */
'use strict';

import React from 'react';
import Router from 'react-router';
let {Route, DefaultRoute, NotFoundRoute} = Router;

import Application from './Application';
import Homepage from './Homepage';

// Home handlers
import HomeContainer from './Home/HomeContainer';
import HomeDetailsContainer from './Home/HomeDetailsContainer';
import HomeRouteNotFound from './ErrorPages/HomeRouteNotFound';

// Property handlers
import PropertyFilter from './Property/Filter';

// Neighborhoods handlers
import NeighborhoodsCities from './Neighborhoods/Cities';
import NeighborhoodsCity from './Neighborhoods/City';
import NeighborhoodsStory from './Neighborhoods/Story';

// MIscellaneous other handlers
import Content from './Content';

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
      <NotFoundRoute handler={HomeRouteNotFound} />
    </Route>
    <Route name='neighborhoods' path='/neighborhoods' handler={NeighborhoodsCities}>
      <Route name='neighborhoodsCity' path='/:city' handler={NeighborhoodsCity} />
      <Route name='neighborhoodsView' path='/:city/:neighborhood' handler={NeighborhoodsStory} />
      <DefaultRoute handler={NeighborhoodsCities} />
      <NotFoundRoute handler={HomeRouteNotFound} />
    </Route>
    <Route name='content' path='/:slug' handler={Content}>
      <DefaultRoute handler={Content} />
      <NotFoundRoute handler={HomeRouteNotFound} />
    </Route>
  </Route>
);

module.exports = routes;
