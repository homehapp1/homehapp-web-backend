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
import NeighborhoodsCities from './Neighborhoods/Cities';
import NeighborhoodsList from './Neighborhoods/List';
import NeighborhoodsStory from './Neighborhoods/Story';
import NeighborhoodsHomeFilter from './Neighborhoods/HomeFilter';

// MIscellaneous other handlers
import Content from './Content';
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
      <Route name='neighborhoodsCities' path='' handler={NeighborhoodsCities} />
      <Route name='neighborhoodsList' path=':city' handler={NeighborhoodsList} />
      <Route name='neighborhoodsView' path=':city/:neighborhood' handler={NeighborhoodsStory} />
      <Route name='neighborhoodsViewHomes' path=':city/:neighborhood/homes' handler={NeighborhoodsHomeFilter} />
      <DefaultRoute handler={NeighborhoodsCities} />
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
