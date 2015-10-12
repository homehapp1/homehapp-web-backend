'use strict';

import BaseQueryBuilder from './BaseQueryBuilder';
import {NotFound} from '../../Errors';
let debug = require('debug')('ContactQueryBuilder');

export default class ContactQueryBuilder extends BaseQueryBuilder {
  constructor(app) {
    super(app, 'Contact');
  }

  initialize() {
  }
}
