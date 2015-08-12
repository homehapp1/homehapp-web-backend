'use strict';

import React from 'react';
import { Link, NotFound } from 'react-router';

// List modes
import PropertyList from './List';
import PropertyCards from './Cards';
import PropertyPreview from './Preview';

class PropertyFilter extends React.Component {
  static propTypes = {
    // home: React.PropTypes.object.isRequired,
    params: React.PropTypes.object
  }

  render() {
    console.log('regexp test', this);
    let mode = this.props.params.mode || 'list';
    let modes = [
      {
        mode: 'cards',
        icon: 'fa fa-th'
      },
      {
        mode: 'list',
        icon: 'fa fa-th-list'
      },
      {
        mode: 'preview',
        icon: 'fa fa-stop'
      }
    ];

    // @TODO: This part is to be removed when the API connection provides proper data
    var randomSeed = function(min, max, precision = 0) {
      if (precision) {
        return Number((min + max * Math.random()).toFixed(precision));
      }

      return min + Math.floor(max * Math.random());
    };

    var getRandom = function (arr, l = 0) {
      if (l) {
        l = Math.min(arr.length, l);
        let rval = [];
        let i = 0;

        while (rval.length < l) {
          let opt = getRandom(arr);
          if (rval.indexOf(opt) === -1) {
            rval.push(opt);
          }

          i++;

          // Overflow protection and throttling
          if (i > 100) {
            break;
          }
        }
        return rval;
      }

      let seed = randomSeed(0, arr.length);
      return arr[seed];
    };

    var items = [];

    // Create a random card for demo purposes only
    var createCard = function(i) {
      return {
        slug: i,
        images: getRandom(['v1436955664/DSCF9259_gjc84p', 'v1436955433/DSCF9129_vkms23', 'v1436955385/DSCF9098_ynzhue', 'v1436955372/DSCF9096_iqxiyh', 'v1436955483/DSCF9157_bsxil9', 'v1436955483/DSCF9158_bl9klb', 'v1436955629/DSCF9247_ebbijd'], randomSeed(2, 10)),
        price: randomSeed(1, 5, 4),
        construction: getRandom(['Adobe', 'Brick', 'Concrete Block', 'Log', 'Metal', 'Stone', 'Straw', 'Wood']),
        exterior: getRandom(['Coastal view', 'City view', 'Hill view', 'By a river', 'Ocean view', 'Lakefront', 'Greenbelt', 'Golf Course', 'Suburban', 'City', 'Cul De Sac', 'Dead End Street', 'Gated Community']),
        style: getRandom(['A-Frame', 'Bungalow', 'Colonial', 'Contemporary', 'Cottage', 'Dome', 'Log', 'Mediterranean', 'Ranch', 'Spanish', 'Tudor', 'Victorian']),
        roof: getRandom(['Composition Shingle', 'Concrete Tile', 'Metal', 'Rock', 'Shake', 'Slate', 'Tar', 'Tile', 'Wood']),
        yard: getRandom(['Swimming Pool', 'Sport pool', 'Spa', 'Sauna', 'Steam Room', 'Fireplace or fire pit', 'Built-in BBQ', 'Outdoor Kitchen', 'Courtyard', 'Covered Patio', 'Uncovered Patio', 'Deck', 'Tennis Courts', 'Trees and Landscaping', 'Gardens', 'Lawn', 'Automatic Sprinklers', 'Drip', 'Misting System'], randomSeed(0, 4)),
        flooring: getRandom(['Carpeting', 'Concrete', 'Bamboo', 'Stone', 'Tile', 'Laminate', 'Cork', 'Vinyl / Linoleum', 'Manufactured Wood', 'Marble', 'Wood'], randomSeed(0, 4)),
        energy: getRandom(['Attic Fans', 'Ceiling Fans', 'Dual or Triple Pane Windows', 'Programmable Thermostats', 'Single Flush Toilets', 'Window Shutters', 'Solar Heat', 'Solar Plumbing', 'Solar Screens', 'Storm Windows', 'Tankless Water Heater', 'Skylights or Sky Tubes', 'Whole House Fan'], randomSeed(0, 4)),
        disabilityFeatures: getRandom(['Extra-Wide Doorways', 'Ramps', 'Grab Bars', 'Lower Counter Heights', 'Walk-in Tubs and Showers'], randomSeed(0, 2)),

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
          {
            modes.map((item, index) => {
              let className = (mode === item.mode) ? 'active' : '';

              return (
                <li className={className}><Link to='propertiesMode' params={{mode: item.mode}}><i className={item.icon}></i></Link></li>
              );
            })
          }
        </ul>
        <div className={mode}>
          {
            (() => {
              switch (mode) {
                case 'list':
                  return (
                    <PropertyList items={items} />
                  );
                case 'preview':
                  return (
                    <PropertyPreview items={items} />
                  );
                case 'cards':
                default:
                  return (
                    <PropertyCards items={items} />
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
