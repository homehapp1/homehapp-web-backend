/* global window */


import React from 'react';
import { Link } from 'react-router';

import Hoverable from '../../../common/components/Widgets/Hoverable';
import DOMManipulator from '../../../common/DOMManipulator';

let debug = require('../../../common/debugger')('HomeList');

export default class HomeList extends React.Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired,
    max: React.PropTypes.number,
    className: React.PropTypes.string,
    children: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.array
    ]),
    page: React.PropTypes.number
  };

  static defaultProps = {
    max: Infinity,
    className: null,
    page: 1
  };

  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    this.container = new DOMManipulator(this.refs.container);
    this.updateEvents();
  }

  componentDidUpdate() {
    this.updateEvents();
  }

  updateEvents() {
    if (!this.container) {
      return false;
    }

    let cards = this.container.getByClass('preview');
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
    if (home.location.address.city) {
      return (<span className='neighborhood'>{home.location.address.city}</span>);
    }
    return null;
  }

  render() {
    debug('Render');
    let containerClass = ['home-list', 'preview-list'];

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
        <div className='clearfix'>
          {
            homes.map((home, index) => {
              let classes = ['preview'];

              if (index === this.props.max) {
                classes.push('last');
              }

              if (!index) {
                classes.push('first');
              }

              let link = {
                to: 'home',
                params: {
                  slug: home.slug
                }
              };
              let rooms = 0;

              for (let i = 0; i < home.attributes.length; i++) {
                if (home.attributes[i].name !== 'rooms') {
                  continue;
                }

                rooms = home.attributes[i].value;
                break;
              }

              if (rooms === 1) {
                rooms = `${rooms} bedroom`;
              } else {
                rooms = `${rooms} bedrooms`;
              }

              let mainImage = {
                url: home.mainImage.url,
                alt: home.mainImage.alt
              };

              return (
                <div className={classes.join(' ')} key={`containerItem${index}`}>
                  <Link {...link} className='thumbnail'>
                    <Hoverable {...mainImage} width={464} height={556} mode='fill' applySize>
                      <span className='title'>{home.homeTitle}</span>
                    </Hoverable>
                  </Link>
                  <div className='description'>
                    <p className='price'>{home.formattedPrice}</p>
                    <p className='address'>
                      {this.getStreet(home)}
                      {this.getNeighborhood(home)}
                      {this.getCity(home)}
                      <span className='city'>{home.location.address.city}</span>
                    </p>
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
