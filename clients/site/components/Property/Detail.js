/* global window */
'use strict';

import React from 'react';

class PropertyDetail extends React.Component {
  static propTypes = {
    label: React.PropTypes.string.isRequired,
    values: React.PropTypes.array.isRequired
  }

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
