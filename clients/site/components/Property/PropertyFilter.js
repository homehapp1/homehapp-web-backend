'use strict';

import React from 'react';
import { Link } from 'react-router';
import PropertyList from './PropertyList';

class PropertyFilter extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired,
    listModes: React.PropTypes.array
  }
  static listModes = [
      {
        type: 'cards',
        icon: 'fa-th',
        label: 'Cards'
      },
      {
        type: 'list',
        icon: 'fa-th-list',
        label: 'List'
      },
      {
        type: 'single',
        icon: 'fa-stop',
        label: 'Single'
      }
    ];

  render() {
    return (
      <div className='details property-list clearfix gray'>
        <h2>Properties</h2>
        <ul className='mode-selector'>
          <li><Link to='propertiesMode' params={{mode: 'cards'}}><i className='fa fa-th' title='cards'></i></Link></li>
          <li><Link to='propertiesMode' params={{mode: 'list'}}><i className='fa fa-th-list' title='list'></i></Link></li>
          <li><Link to='propertiesMode' params={{mode: 'single'}}><i className='fa fa-stop' title='single'></i></Link></li>
        </ul>
        <PropertyList />
      </div>
    );
  }
}

export default PropertyFilter;
