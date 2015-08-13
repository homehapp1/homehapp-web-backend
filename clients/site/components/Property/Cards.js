/* global window */
'use strict';

import React from 'react';
import { Link } from 'react-router';
import ApplicationStore from '../../../common/stores/ApplicationStore';

class PropertyCards extends React.Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired
  }

  constructor() {
    super();
    this.config = ApplicationStore.getState().config;
    this.columns = 0;
  }

  componentDidMount() {
    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);

    // Trigger the events on load
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  // Generic stuff that should happen when the window is resized
  resize() {
    if (typeof this.refs.cards === 'undefined') {
      return;
    }

    let container = this.refs.cards.getDOMNode();
    let cards = container.getElementsByClassName('card');

    // No cards available
    if (cards.length < 1) {
      return;
    }

    let width = cards[0].offsetWidth;
    console.log('width', width);
    let cols = Math.min(4, Math.floor(container.offsetWidth / width));
    let heights = [];

    if (cols === this.cols) {
      return;
    }

    if (cols === 1) {
      for (let i = 0; i < cards.length; i++) {
        cards[i].style.marginLeft = null;
        cards[i].style.marginTop = null;
      }

      if (!container.className.match(/single/)) {
        container.className += ' single';
      }

      if (container.className.match(/animate/)) {
        container.className = container.className.replace(/ ?animate/, '');
      }

      return;
    }

    if (container.className.match(/single/)) {
      container.className = container.className.replace(/ ?single/, '');
    }

    // Populate zero heights
    for (let i = 0; i < cols; i++) {
      heights.push(0);
    }

    var getMinHeight = function(arr) {
      let min = Math.min.apply(Math, arr);
      return arr.indexOf(min);
    };

    // Set the positions
    for (let i = 0; i < cards.length; i++) {
      let c = getMinHeight(heights);
      let offset = (c / cols - 0.5) * (cols * width);

      cards[i].style.marginLeft = `${offset}px`;
      cards[i].style.marginTop = `${heights[c]}px`;
      heights[c] += cards[i].offsetHeight;
    }

    let max = Math.max.apply(Math, heights);
    container.style.minHeight = `${max}px`;

    if (!container.className.match(/animate/)) {
      container.className += ' animate';
    }
  }

  render() {
    return (
      <div ref='cards' className='card-list'>
      {
        this.props.items.map((item, index) => {
          let heights = [250, 300, 340, 380, 420, 450, 460, 500, 520, 540, 560, 600, 610];
          let seed = Math.floor(Math.random() * heights.length);
          let h = heights[seed];

          let src = `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.card},h_${h}/${item.images[0]}`;
          let classes = ['card'];

          if (item.storified) {
            classes.push('storified');
          }

          return (
            <div className={classes.join(' ')} key={index}>
              <div className='card-content'>
                <Link to='home' params={{slug: item.slug}} className='thumbnail'>
                  <img src={src} height={h} />
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
      </div>
    );
  }
}

export default PropertyCards;
