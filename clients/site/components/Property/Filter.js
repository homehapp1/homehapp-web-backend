'use strict';

import React from 'react';
import { Link } from 'react-router';

// List modes
import PropertyList from './List';
import PropertyCards from './Cards';

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
    var displayMode = this.props.params.mode || 'list';

    // @TODO: This part is to be removed when the API connection provides proper data
    var randomSeed = function(min, max) {
      return min + Math.floor(max * Math.random());
    };

    var getRandom = function (arr) {
      let seed = randomSeed(0, arr.length);
      return arr[seed];
    };

    var items = [];

    // Create a random card for demo purposes only
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
          city: 'London',
          country: 'GB'
        }
      };
    };

    for (let i = 0; i < 20; i++) {
      items.push(createCard(i));
    }

    return (
      <div className='details property-list clearfix gray'>
        <h2>Properties</h2>
        <ul className='mode-selector'>
          <li><Link to='propertiesMode' params={{mode: 'cards'}}><i className='fa fa-th' title='cards'></i></Link></li>
          <li><Link to='propertiesMode' params={{mode: 'list'}}><i className='fa fa-th-list' title='list'></i></Link></li>
          <li><Link to='propertiesMode' params={{mode: 'single'}}><i className='fa fa-stop' title='single'></i></Link></li>
        </ul>
        <div className={displayMode}>
          {
            (() => {
              switch (displayMode) {
                case 'cards':
                  return (
                    <PropertyCards items={items} />
                  );
                case 'list':
                  return (
                    <PropertyList items={items} />
                  );
              }
            })()
          }
        </div>
      </div>
    );
  }
}

export default PropertyFilter;
