'use strict';

import React from 'react';
import NeighborhoodsCity from './City';

class NeighborhoodsCities extends React.Component {
  componentDidMount() {
    window.location.href = '/neighborhoods/london';
  }
  render() {
    return (
      <NeighborhoodsCity city='london' />
    );
  }
}

export default NeighborhoodsCities;
