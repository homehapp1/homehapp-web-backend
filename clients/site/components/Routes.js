/*eslint-env es6 */
'use strict';

import React from 'react';
import Router from 'react-router';
let {Route, DefaultRoute, NotFoundRoute} = Router;

import Application from './Application';
import Homepage from './Homepage';

// Home handlers
import HomeContainer from './Home/HomeContainer';
import HomeContactContainer from './Home/HomeContactContainer';
import HomeDetailsContainer from './Home/HomeDetailsContainer';
import RouteNotFound from './ErrorPages/RouteNotFound';

// Property handlers
import PropertyFilter from './Property/Filter';

// Neighborhoods handlers
import CityContainer from './City/CityContainer';
import NeighborhoodList from './Neighborhood/NeighborhoodList';
import NeighborhoodContainer from './Neighborhood/NeighborhoodContainer';
import NeighborhoodHomeFilterContainer from './Neighborhood/NeighborhoodHomeFilterContainer';

// MIscellaneous other handlers
import ContentAbout from './Content/About';
import ContentCareers from './Content/Careers';
import ContentPrivacy from './Content/Privacy';
import ContentTerms from './Content/Terms';
import Partners from './Partners';
import PartnersContact from './Partners/Contact';

module.exports = (
  <Route name='app' path='/' handler={Application}>
    <DefaultRoute handler={Homepage}/>
    <Route name='home' path='/home/:slug'>
      <Route name='homeDetails' path='details' handler={HomeDetailsContainer} />
      <Route name='homeForm' path='contact' handler={HomeContactContainer} />
      <DefaultRoute handler={HomeContainer}/>
      <NotFoundRoute handler={RouteNotFound} />
    </Route>
    <Route name='properties' path='/search'>
      <Route name='propertiesMode' path=':mode' handler={PropertyFilter} />
      <DefaultRoute handler={PropertyFilter} />
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
    <Route name='contentAbout' path='/about' handler={ContentAbout} />
    <Route name='contentCareers' path='/careers' handler={ContentCareers} />
    <Route name='contentPrivacy' path='/privacy' handler={ContentPrivacy} />
    <Route name='contentTerms' path='/terms' handler={ContentTerms} />

  <Route name='partners' path='/partners'>
      <Route name='partnersContact' path='contact' handler={PartnersContact} />
      <DefaultRoute name='partnersContent' handler={Partners} />
    </Route>
    <NotFoundRoute handler={RouteNotFound} />
  </Route>
);
