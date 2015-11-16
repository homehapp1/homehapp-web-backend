/*eslint-env es6 */


import React from 'react';

// Property List
import HomeList from '../Home/HomeList';

// Story widgets
import BigImage from '../../../common/components/Widgets/BigImage';
import Icon from '../../../common/components/Widgets/Icon';
import LargeText from '../../../common/components/Widgets/LargeText';

import { setPageTitle } from '../../../common/Helpers';
// let debug = require('../../../common/debugger')('NeighborhoodHomeFilter');

export default class NeighborhoodHomeFilter extends React.Component {
  static propTypes = {
    neighborhood: React.PropTypes.object.isRequired
  };

  componentDidMount() {
    if (this.props.neighborhood && this.props.neighborhood.location && this.props.neighborhood.location.city && this.props.neighborhood.location.city.title) {
      setPageTitle(`Homes in ${this.props.neighborhood.title} | Neighbourhoods of ${this.props.neighborhood.location.city.title}`);
    }
  }

  componentWillUnmount() {
    setPageTitle();
  }

  render() {
    let neighborhood = this.props.neighborhood;
    let image = neighborhood.mainImage;

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
        <HomeList items={neighborhood.homes} />
      </div>
    );
  }
}
