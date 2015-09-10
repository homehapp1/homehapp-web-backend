'use strict';

import React from 'react';
import NeighborhoodsList from './List';

export default class NeighborhoodsCities extends React.Component {
  componentDidMount() {
    window.location.href = '/neighborhoods/london';
  }
  render() {
    return (
      <NeighborhoodsList city='london' />
    );
  }
}
