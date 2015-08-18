'use strict';

import React from 'react';
import { Link } from 'react-router';

// List modes
import PropertyList from './List';
import PropertyCards from './Cards';
import PropertyPreview from './Preview';

import { createProperty } from '../../../common/Helpers';
import BigImage from '../../../common/components/Widgets/BigImage';

class PropertyFilter extends React.Component {
  static propTypes = {
    // home: React.PropTypes.object.isRequired,
    params: React.PropTypes.object
  }

  render() {
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
    let mode = this.props.params.mode || modes[0].mode;

    // Populate fake properties
    let items = [];
    for (let i = 0; i < 20; i++) {
      items.push(createProperty(i));
    }

    let imageSrc = 'v1439885926/site/images/content/staircase.jpg';

    return (
      <div className='property-filter'>
        <BigImage src={imageSrc} />
        <div className='details property-list clearfix gray'>
          <h2>Properties</h2>
          <ul className='mode-selector'>
            {
              modes.map((item) => {
                let className = (mode === item.mode) ? 'active' : '';

                return (
                  <li className={className}><Link to='propertiesMode' params={{mode: item.mode}}><i className={item.icon}></i></Link></li>
                );
              })
            }
          </ul>
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
