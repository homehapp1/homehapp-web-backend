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

    this.refs.properties.getDOMNode().getElementsByClassName('property-list-item')[0].className += ' active';
    //.shouldUpdate
  }

  render() {
    let changeSlide = (i, el) => {
      let slides = el.parentNode.childNodes;

      for (let i = 0; i < slides.length; i++) {
        slides[i].className = slides[i].className.replace(/ ?active/, '');
      }
      el.className += ' active';
    };

    return (
      <div className='property-preview full-height width-wrapper'>
        <div className='pager' ref='pager'>
          <span className='prev'>
            <i className='fa fa-angle-left prev'></i>
          </span>
          <span className='next'>
            <i className='fa fa-angle-right next'></i>
          </span>
        </div>
        <ReactSwipe continuous={false} callback={changeSlide} ref='properties' className='container full-height-strict'>
        {
          this.props.items.map((item, index) => {
            let smallImage = `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.small}/${item.images[0]}`;
            let mediumImage = `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.preview}/${item.images[0]}`;
            let largeImage = `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.large}/${item.images[0]}`;

            return (
              <div className='property-list-item full-height-strict' key={index}>
                <div className='content'>
                  <Link to='home' params={{slug: item.slug}} className='thumbnail'>
                    <img src={smallImage} alt={item.label} className='show-for-small' />
                    <img src={mediumImage} alt={item.label} className='hide-for-small' />
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
