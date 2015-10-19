/* global window */


import React from 'react';
import DOMManipulator from '../../../common/DOMManipulator';
import Card from './Card';

export default class PropertyCards extends React.Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired,
    cols: React.PropTypes.number,
    max: React.PropTypes.number
  }

  static defaultProps = {
    cols: 4,
    max: Infinity
  };

  constructor() {
    super();
    this.resize = this.resize.bind(this);
    this.cols = 0;
  }

  componentDidMount() {
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
    let cols = Math.min(this.props.cols, Math.floor(container.width() / width), cards.length);
    let heights = [];

    if (cols === this.cols && !forced) {
      return null;
    }

    // Store the changed column count
    this.cols = cols;

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
      let offset = Math.round((c / cols - 0.5) * (cols * width));

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
      <div ref='cards' className='widget cards'>
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
