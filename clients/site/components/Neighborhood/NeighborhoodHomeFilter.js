/*eslint-env es6 */
'use strict';

import React from 'react';

// Internal components
import HomeListStore from '../../stores/HomeListStore';
import ErrorPage from '../../../common/components/Layout/ErrorPage';

// Property List
import PropertyList from '../Property/List';

// Story widgets
import BigImage from '../../../common/components/Widgets/BigImage';
import Icon from '../../../common/components/Widgets/Icon';
import LargeText from '../../../common/components/Widgets/LargeText';
import Loading from '../../../common/components/Widgets/Loading';

import { setPageTitle } from '../../../common/Helpers';
let debug = require('../../../common/debugger')('NeighborhoodHomeFilter');

export default class NeighborhoodHomeFilter extends React.Component {
  static propTypes = {
    neighborhood: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    setPageTitle(`Homes in ${this.props.neighborhood.title} | Neighbourhoods of ${this.props.neighborhood.location.city.title}`);
  }

  componentWillUnmount() {
    setPageTitle();
  }

  render() {
    debug('Render');
    let neighborhood = this.props.neighborhood;
    let defaultImage = {
      src: 'images/content/london-view.jpg',
      alt: '',
      type: 'asset',
      applySize: false
    };

    let image = neighborhood.images[0] || defaultImage;

    for (let home of neighborhood.homes) {
      home.location.neighborhood = neighborhood;
    }

    return (
      <div className='neighborhoods-home-filter'>
        <BigImage image={image} gradient='black' fixed={false} proportion={0.5}>
          <LargeText align='center' valign='middle' proportion={0.5}>
            <Icon type='marker' color='black' size='large' />
            <h1>{neighborhood.title}</h1>
            <p>Homes</p>
          </LargeText>
        </BigImage>
        <PropertyList items={neighborhood.homes} />
      </div>
    );
  }
}
