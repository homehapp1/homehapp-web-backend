/* global window */
'use strict';

import React from 'react';
import ApplicationStore from '../../stores/ApplicationStore';

class Cards extends React.Component {
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
  resize(e) {
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
    let cols = Math.min(4, Math.floor(container.offsetWidth / width));
    let heights = [];

    if (cols === this.cols) {
      console.log('column count did not change');
      return;
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
      console.log('card', i, 'height', cards[i].offsetHeight, c, offset);

      cards[i].style.marginLeft = `${offset}px`;
      cards[i].style.marginTop = `${heights[c]}px`;
      heights[c] += cards[i].offsetHeight;
    }

    let max = Math.max.apply(Math, heights);
    container.style.minHeight = `${max}px`;

    if (!container.className.match(/animate/))
      container.className += ' animate';
  }

  render() {
    let style = {
      //width: `${this.props.width}px`
    };
    return (
      <div ref='cards' className='card-list'>
      {
        this.props.items.map((item, index) => {
          let heights = [250, 300, 340, 380, 420, 450, 460, 500, 520, 540, 560, 600, 610];
          let seed = Math.floor(Math.random() * heights.length);
          let h = heights[seed];

          let src = `${this.config.cloudinary.baseUrl}${this.config.cloudinary.transformations.card},h_${h}/${item.images[0]}`;

          return (
            <div className='card' key={index}>
              <div className='card-content'>
                <a className='thumbnail'>
                  <img src={src} height={h} />
                </a>
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

export default Cards;
