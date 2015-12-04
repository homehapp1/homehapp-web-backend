/* global window */


import React from 'react';
import { Link } from 'react-router';

import Hoverable from '../../../common/components/Widgets/Hoverable';
import DOMManipulator from '../../../common/DOMManipulator';

// let debug = require('../../../common/debugger')('HomeList');

export default class HomeList extends React.Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired,
    max: React.PropTypes.number,
    className: React.PropTypes.string,
    children: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ]),
    page: React.PropTypes.number,
    maxCols: React.PropTypes.number,
    filter: React.PropTypes.func
  };

  static defaultProps = {
    max: Infinity,
    className: null,
    page: 1,
    maxCols: 5,
    filter: (home) => {
      return null;
    }
  };

  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
    this.updateView = this.updateView.bind(this);
    this.container = null;
    this.list = null;
    this.lastWidth = 0;
  }

  componentDidMount() {
    this.container = new DOMManipulator(this.refs.container);
    this.list = new DOMManipulator(this.refs.list);
    this.updateEvents();

    if (window) {
      window.addEventListener('resize', this.updateView);
      this.updateView();
      this.container.addClass('init');
    }
  }

  componentDidUpdate() {
    this.updateEvents();
  }

  componentWillUnmount() {
    if (window) {
      window.removeEventListener('resize', this.updateView);
    }
  }

  componentWillReceiveProps(props) {
    this.updateView();
  }

  updateView() {
    if (!this.container) {
      return null;
    }

    let cards = this.list.children();
    if (!cards.length) {
      return null;
    }

    let d = cards[0].width() || 424;
    let w = this.list.width();

    let cols = Math.min(Math.floor(w / d), this.props.maxCols) || 1;

    let heights = [];
    for (let i = 0; i < cols; i++) {
      heights.push(0);
    }

    cards.map((card) => {
      if (cols < 2) {
        card.css({
          marginLeft: 0,
          marginTop: 0
        });

        return card;
      }

      for (let img of card.getByTagName('img')) {
        let ar = Number(img.attr('data-aspect-ratio'));
        if (!ar) {
          continue;
        }
        let height = Math.round(img.width() / ar);
        img.height(height);
      }

      if (card.hasClass('invisible')) {
        return card;
      }

      // Get the shortest column
      let col = Math.max(0, heights.indexOf(Math.min(...heights)));
      let h = card.height();

      card.css({
        marginLeft: `${(col - cols / 2) * d}px`,
        marginTop: `${heights[col]}px`
      });

      heights[col] += h;
      return card;
    });

    let height = Math.max(...heights);
    this.list.css('min-height', `${height}px`);
  }

  updateEvents() {
    if (!this.container) {
      return false;
    }

    let cards = this.container.getByClass('card');
    for (let card of cards) {
      card.removeEvent('click', this.onClick, true);
      card.addEvent('click', this.onClick, true);
      card.removeEvent('touch', this.onClick, true);
      card.addEvent('touch', this.onClick, true);
    }
  }

  onClick(event) {
    let target = event.target;
    do {
      if (target.tagName.toLowerCase() === 'a') {
        return true;
      }

      if (target === this.container) {
        break;
      }
      target = target.parentNode;
    } while (target.parentNode);

    let links = this.container.getByTagName('a');
    for (let link of links) {
      let e = new Event('click', {
        target: link
      });
      link.node.dispatchEvent(e);
      break;
    }
  }

  getStreet(home) {
    if (home.location.address.street) {
      return (<span className='street'>{home.location.address.street}</span>);
    }
    return null;
  }

  getNeighborhood(home) {
    if (home.location.neighborhood && typeof home.location.neighborhood === 'object') {
      return (<span className='neighborhood'>{home.location.neighborhood.title}</span>);
    }
    return null;
  }

  getCity(home) {
    if (home.location.neighborhood && home.location.neighborhood.city && home.location.neighborhood.city.title) {
      return (<span className='neighborhood'>{home.location.neighborhood.city.title}</span>);
    }
    return null;
  }

  getCurrencySymbol(currency) {
    if (currency.toLowerCase() === 'eur') {
      return (<span className='currency eur'>€</span>);
    }

    return (<span className='currency gbp'>£</span>);
  }

  render() {
    let containerClass = ['home-list', 'widget', 'pattern'];

    if (this.props.className) {
      containerClass.push(this.props.className);
    }
    let homes = this.props.items;
    let limit = this.props.max;
    let page = Number(this.props.page) - 1;

    if (isNaN(page)) {
      page = 0;
    }

    if (homes.length > limit) {
      homes = homes.splice(page * limit, this.props.max);
    }

    return (
      <div className={containerClass.join(' ')} ref='container'>
        {this.props.children}
        <div className='clearfix list-container' ref='list'>
          {
            homes.map((home, index) => {
              if (!home) {
                return null;
              }

              let classes = ['card'];
              let filterClass = (typeof this.props.filter === 'function') ? this.props.filter(home) : '';
              if (filterClass) {
                classes.push(filterClass);
              }

              if (index === this.props.max) {
                classes.push('last');
              }

              if (!index) {
                classes.push('first');
              }

              if (home.story.enabled && home.story.blocks.length) {
                classes.push('story');
              }

              let link = {
                to: 'home',
                params: {
                  slug: home.slug
                }
              };

              let mainImage = {
                url: home.mainImage.url,
                alt: home.mainImage.alt,
                width: 424,
                aspectRatio: home.mainImage.aspectRatio || 1,
                applySize: true,
                className: 'with-shadow',
                mode: 'fit'
              };

              let neighborhood = null;
              let city = (<span className='city default'>London</span>);

              if (home.location && home.location.address && home.location.address.city) {
                city = (<span className='city manual'>{home.location.address.city}</span>);
              }

              if (home.location.neighborhood && home.location.neighborhood.title) {
                neighborhood = (<span className='neighborhood'>{home.location.neighborhood.title}</span>);

                if (home.location.neighborhood.location && home.location.neighborhood.location.city && home.location.neighborhood.location.city.title) {
                  city = (<span className='city from-neighborhood'>{home.location.neighborhood.location.city.title}</span>);
                }
              }

              let description = home.description;
              let maxChars = 200;

              if (description.length > maxChars) {
                description = description.substr(0, maxChars).replace(/[\., \-]*$/, '...');
              }

              let price = null;

              switch (home.announcementType) {
                case 'buy':
                  if (home.formattedPrice) {
                    price = (
                      <p className='price'>
                        {this.getCurrencySymbol(home.costs.currency)}
                        {home.formattedPrice}
                      </p>
                    );
                  }
                  break;
                case 'rent':
                  if (home.formattedPrice) {
                    price = (
                      <p className='price'>
                        {this.getCurrencySymbol(home.costs.currency)}
                        {home.formattedPrice}
                        <span className='per-month'>/ month</span>
                      </p>
                    );
                  }
                  break;
              }

              return (
                <div className={classes.join(' ')} key={`containerItem${index}`}>
                  <Link {...link} className='thumbnail'>
                    <Hoverable {...mainImage}>
                      <span className='shares'>
                        <i className='fa fa-heart'>312</i>
                        <i className='fa fa-share-alt'>12</i>
                      </span>
                    </Hoverable>
                  </Link>
                  <div className='details'>
                    <p className='location'>
                      {neighborhood}
                      {city}
                    </p>
                    <h3>
                      <Link {...link} className='thumbnail'>
                        {home.homeTitle}
                      </Link>
                    </h3>
                    <p className='description'>{description}</p>
                    {price}
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}
