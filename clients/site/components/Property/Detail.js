/* global window */
'use strict';

import React from 'react';
import { Link } from 'react-router';
import ApplicationStore from '../../../common/stores/ApplicationStore';

class PropertyDetail extends React.Component {
  render() {
    let values = this.props.values;
    let label = this.props.label;

    if (!Array.isArray(values)) {
      values = [values];
    }

    return (
      <div className='detail'>
        <span className='label'>{label}: </span>
        <span className='values'>{values.join(', ')}</span>
      </div>
    );
  }
}

export default PropertyDetail;
