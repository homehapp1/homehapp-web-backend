/* global window */
'use strict';

import React from 'react';
import { Link } from 'react-router';
import DOMManipulator from '../../../common/DOMManipulator';
import classNames from 'classnames';
import Image from '../../../common/components/Widgets/Image';

class PropertyCards extends React.Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired,
    max: React.PropTypes.number
  }

  constructor() {
    super();
    this.columns = 0;
  }

  componentDidMount() {
    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);

    // Trigger the events on load
    this.resize();
  }

  componentDidUpdate() {
    this.resize(true);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  // Generic stuff that should happen when the window is resized
  resize(forced = false) {
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
    let cols = Math.min(6, Math.floor(container.width() / width), cards.length);
    let heights = [];

    if (cols === this.cols && !forced) {
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
    return (
      <div ref='cards' className='card-list'>
      {
        this.props.items.map((item, index) => {
          if (this.props.max && this.props.max <= index) {
            return null;
          }

          let classes = ['card'];

          if (item.storified) {
            classes.push('storified');
          }

          return (
            <div className={classNames(classes)} key={index}>
              <div className='card-content'>
                <Link to='home' params={{slug: item.slug}} className='thumbnail'>
                  {
                    item.images.map((img, ind) => {
                      if (ind) {
                        return null;
                      }

                      return (
                        <Image src={img.url} alt={img.alt} aspectRatio={img.aspectRatio} variant='card' key={ind} />
                      );
                    })
                  }
                </Link>
                <div className='details'>
                  <p className='address'>
                    <Link to='home' params={{slug: item.slug}}>
                      <span className='apartment'>{item.location.address.apartment}</span>
                      <span className='street'>{item.location.address.street}</span>
                      <span className='city'>{item.location.address.city}</span>
                      <span className='country'>{item.location.address.country}</span>
                    </Link>
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
