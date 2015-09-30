'use strict';

import BaseQueryBuilder from './BaseQueryBuilder';
import {NotFound} from '../../Errors';
import async from 'async';

class CityQueryBuilder extends BaseQueryBuilder {
  constructor(app) {
    super(app, 'City');
  }

  initialize() {
  }
}

export default CityQueryBuilder;
