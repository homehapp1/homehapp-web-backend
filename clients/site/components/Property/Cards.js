/* global window */
'use strict';

import React from 'react';
import DOMManipulator from '../../../common/DOMManipulator';
import Card from '../../../common/components/Widgets/Card';

class PropertyCards extends React.Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired,
    max: React.PropTypes.number
  }

  static defaultProps = {
    max: Infinity
  };

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

  resetMargins(cards) {
    for (let i = 0; i < cards.length; i++) {
      cards[i].css({
        marginLeft: null,
        marginTop: null
      });
    }
  }

  getMinHeight(arr) {
    let min = Math.min.apply(Math, arr);
    return arr.indexOf(min);
  }

  // Generic stuff that should happen when the window is resized
  resize(forced = false) {
    if (typeof this.refs.cards === 'undefined') {
      return null;
    }

    let container = new DOMManipulator(this.refs.cards);
    let cards = container.getByClass('card');

    // No cards available
    if (cards.length < 1) {
      return null;
    }

    let width = cards[0].width();
    let cols = Math.min(6, Math.floor(container.width() / width), cards.length);
    let heights = [];

    if (cols === this.cols && !forced) {
      return null;
    }

    if (cols === 1) {
      this.resetMargins(cards);
      container.addClass('single').removeClass('animate');
      return null;
    }

    container.removeClass('single');

    // Populate zero heights
    for (let i = 0; i < cols; i++) {
      heights.push(0);
    }

    // Set the positions
    for (let i = 0; i < cards.length; i++) {
      let c = this.getMinHeight(heights);
      let offset = (c / cols - 0.5) * (cols * width);

      cards[i].css({
        marginLeft: `${offset}px`,
        marginTop: `${heights[c]}px`
      });
      heights[c] += cards[i].height();

      let images = cards[i].getByTagName('img');

      if (!images.length) {
        continue;
      }

      // Set the thumbnail wrapper size to be the same as the one of the card
      images[0].parent()
        .addClass('positioning-enabled')
        .width(images[0].attr('width'))
        .height(images[0].attr('height'));

      images[0].parent().parent()
        .addClass('positioning-enabled')
        .width(images[0].attr('width'))
        .height(images[0].attr('height'));
    }

    let max = Math.max.apply(Math, heights);
    container.css('min-height', `${max}px`).addClass('animate');
  }

  render() {
    return (
      <div ref='cards' className='card-list'>
      {
        this.props.items.map((item, index) => {
          if (this.props.max <= index) {
            return null;
          }

          return (
            <Card item={item} key={index} />
          );
        })
      }
      </div>
    );
  }
}

export default PropertyCards;
