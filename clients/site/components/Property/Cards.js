/* global window */
'use strict';

import React from 'react';
import { Link } from 'react-router';
import ApplicationStore from '../../../common/stores/ApplicationStore';
import DOMManipulator from '../../../common/DOMManipulator';
import classNames from 'classnames';

class PropertyCards extends React.Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired,
    max: React.PropTypes.number
  }

  constructor() {
    super();
    this.columns = 0;
    this.storeListener = this.onChange.bind(this);
  }

  componentDidMount() {
    ApplicationStore.listen(this.storeListener);

    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);

    // Trigger the events on load
    this.resize();
  }

  componentWillUnmount() {
    ApplicationStore.unlisten(this.storeListener);
    window.removeEventListener('resize', this.resize);
  }

  state = {
    config: ApplicationStore.getState().config
  }

  onChange(state) {
    console.log('onChange', state);
    this.setState({
      config: ApplicationStore.getState().config
    });
  }

  // Generic stuff that should happen when the window is resized
  resize() {
    if (typeof this.refs.cards === 'undefined') {
      return;
    }

    let container = new DOMManipulator(this.refs.cards);
    let cards = container.getByClass('card');

    // No cards available
    if (cards.length < 1) {
      return;
    }

    let width = cards[0].width();
    let cols = Math.min(4, Math.floor(container.width() / width), cards.length);
    let heights = [];

    if (cols === this.cols) {
      return;
    }

    if (cols === 1) {
      for (let i = 0; i < cards.length; i++) {
        cards[i].css({
          marginLeft: null,
          marginTop: null
        });
      }

      container.addClass('single').removeClass('animate');
      return;
    }

    container.removeClass('single');

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

      cards[i].css({
        marginLeft: `${offset}px`,
        marginTop: `${heights[c]}px`
      });
      heights[c] += cards[i].height();
    }

    let max = Math.max.apply(Math, heights);
    container.css('min-height', `${max}px`).addClass('animate');
  }

  render() {
    //console.log('Cards this.state.config', this.state.config);
    if (!this.state.config) {
      return null;
    }
    return (
      <div ref='cards' className='card-list'>
      {
        this.props.items.map((item, index) => {
          if (this.props.max && this.props.max <= index) {
            return null;
          }

          let heights = [200, 220, 230, 250, 280, 300, 320, 340, 380, 420, 450, 460];
          let seed = Math.floor(Math.random() * heights.length);
          let h = heights[seed];

          let src = `${this.state.config.cloudinary.baseUrl}${this.state.config.cloudinary.transformations.card},h_${h}/${item.images[0]}`;
          let classes = ['card'];

          if (item.storified) {
            classes.push('storified');
          }

          return (
            <div className={classNames(classes)} key={index}>
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
