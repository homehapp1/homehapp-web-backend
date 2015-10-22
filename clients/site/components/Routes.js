/*eslint-env es6 */


import React from 'react';
import Router from 'react-router';
let {Route, DefaultRoute, NotFoundRoute} = Router;

import Application from './Application';
import Homepage from './Homepage';

// Home handlers
import HomeContainer from './Home/HomeContainer';
import HomeContactContainer from './Home/HomeContactContainer';
import HomeDetailsContainer from './Home/HomeDetailsContainer';
import HomeStoryContainer from './Home/HomeStoryContainer';
import HomeSearch from './Home/HomeSearch';
import RouteNotFound from './ErrorPages/RouteNotFound';

// Neighborhoods handlers
import CityContainer from './City/CityContainer';
import NeighborhoodList from './Neighborhood/NeighborhoodList';
import NeighborhoodContainer from './Neighborhood/NeighborhoodContainer';
import NeighborhoodHomeFilterContainer from './Neighborhood/NeighborhoodHomeFilterContainer';

import Partners from './Partners';
import PartnersContact from './Partners/Contact';

// MIscellaneous other handlers
import Page from './Page';

module.exports = (
  <Route name='app' path='/' handler={Application}>
    <DefaultRoute handler={Homepage}/>
    <Route name='homes' path='/homes'>
      <Route name='home' path=':slug'>
        <Route name='homeDetails' path='details' handler={HomeDetailsContainer} />
        <Route name='homeStory' path='story' handler={HomeStoryContainer} />
        <Route name='homeForm' path='contact' handler={HomeContactContainer} />
        <DefaultRoute handler={HomeContainer}/>
        <NotFoundRoute handler={RouteNotFound} />
      </Route>
      <DefaultRoute handler={HomeSearch} />
      <NotFoundRoute handler={RouteNotFound} />
    </Route>
    <Route name='search' path='/search'>
      <Route name='searchMode' path=':mode' handler={HomeSearch} />
      <DefaultRoute handler={HomeSearch} />
      <NotFoundRoute handler={RouteNotFound} />
    </Route>
    <Route name='neighborhoods' path='/neighborhoods'>
      <Route name='cityList' path='' handler={CityContainer} />
      <Route name='neighborhoodList' path=':city' handler={NeighborhoodList} />
      <Route name='neighborhoodView' path=':city/:neighborhood' handler={NeighborhoodContainer} />
      <Route name='neighborhoodViewHomes' path=':city/:neighborhood/homes' handler={NeighborhoodHomeFilterContainer} />
      <DefaultRoute handler={CityContainer} />
      <NotFoundRoute handler={RouteNotFound} />
    </Route>
    <Route name='partners' path='/partners' handler={Partners}>
      <Route name='partnersContact' path='contact' handler={PartnersContact} />
      <DefaultRoute handler={Partners} />
    </Route>
    <Route name='page' path=':slug' handler={Page} />
    <NotFoundRoute handler={RouteNotFound} />
  </Route>
);
