'use strict';

import React from 'react';
import { Link } from 'react-router';
import Cards from '../../../common/components/Cards';

class PropertyList extends React.Component {
  setPositions() {

  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    var displayMode = this.props.mode || 'cards';

    // @TODO: This part is to be removed when the API connection provides proper data
    var randomSeed = function(min, max) {
      return min + Math.floor(max * Math.random());
    };

    var getRandom = function (arr) {
      let seed = randomSeed(0, arr.length);
      return arr[seed];
    };

    var items = [];
    var createCard = function(i) {
      let srcs = ['v1436955664/DSCF9259_gjc84p', 'v1436955433/DSCF9129_vkms23', 'v1436955385/DSCF9098_ynzhue', 'v1436955372/DSCF9096_iqxiyh', 'v1436955483/DSCF9157_bsxil9', 'v1436955483/DSCF9158_bl9klb', 'v1436955629/DSCF9247_ebbijd'];
      let images = [];

      for (let k = 0; k < randomSeed(2, 10); k++) {
        images.push(getRandom(srcs));
      }

      return {
        slug: i,
        images: images,
        address: {
          street: '221 B Baker Street',
          city: 'London'
        }
      };
    };

    for (let i = 0; i < 20; i++) {
      items.push(createCard(i));
    }

    return (
      <div className={displayMode}>
        <Cards items={items} />
      </div>
    );
  }
}

export default PropertyList;
