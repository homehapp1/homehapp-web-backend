/* global window */
'use strict';

// PropertyPreview

import React from 'react';
import { Link } from 'react-router';
import ReactSwipe from 'react-swipe';
import ApplicationStore from '../../../common/stores/ApplicationStore';

class PropertyPreview extends React.Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired
  }

  constructor() {
    super();
    this.config = ApplicationStore.getState().config;
    this.pager = [];
  }

  pagerClick(e) {
    let dx = 0;

    // Get direction
    if (e.target.className.match(/next/)) {
      dx = 1;
      this.refs.properties.swipe.next();
    } else if (e.target.className.match(/prev/)) {
      dx = -1;
      this.refs.properties.swipe.prev();
    } else {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.pagerClick = this.pagerClick.bind(this);

    this.pager = this.refs.pager.getDOMNode().getElementsByTagName('span');
    for (let i = 0; i < this.pager.length; i++) {
      this.pager[i].addEventListener('click', this.pagerClick);
      this.pager[i].addEventListener('touchstart', this.pagerClick);
    }
  }

  render() {
    return (
      <div className='property-preview width-wrapper'>
        <div className='pager' ref='pager'>
          <span className='prev'>
            <i className='fa fa-angle-left prev'></i>
          </span>
          <span className='next'>
            <i className='fa fa-angle-right next'></i>
          </span>
        </div>
        <ReactSwipe continuous={false} ref='properties'>
        {
          this.props.items.map((item, index) => {
            let src = `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.propList}/${item.images[0]}`;

            return (
              <div className='property-list-item' key={index}>
                <div className='content'>
                  <Link to='home' params={{slug: item.slug}} className='thumbnail'>
                    <img src={src} />
                  </Link>
                  <div className='details'>
                    <p className='address'>
                      <span className='street'>{item.address.street}</span>
                      <span className='city'>{item.address.city}</span>
                      <span className='country'>{item.address.country}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        }
        </ReactSwipe>
      </div>
    );
  }
}

export default PropertyPreview;
