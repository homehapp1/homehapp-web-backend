'use strict';

import React from 'react';
import { Link } from 'react-router';
import Story from '../../../common/components/Widgets/Story';
import { formatPrice, primaryHomeTitle } from '../../../common/Helpers';

class HomeDetails extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired
  }

  // Primary title construction should
  getPrimaryTitle() {
    return primaryHomeTitle(this.props.home);
  }

  getSecondaryTitle() {
    let content = this.props.home.attributes.map(function(c, i) {
      // Add the items that should be included in the secondary title
      let rval = null;
      switch (c.name) {
        case 'rooms':
          rval = (c.value === 1) ? (<span>1 room</span>) : (<span>{c.value} rooms</span>);
          break;
      }
      return rval;
    });

    content.push((<span>{formatPrice(this.props.home.costs.sellingPrice)}</span>));

    return content;
  }

  getTitleBlock() {
    let image = null;

    if (this.props.home.images && this.props.home.images.length) {
      image = this.props.home.images[0];
    } else {
      image = {
        url: 'images/content/content-placeholder.jpg',
        alt: '',
        type: 'asset'
      };
    }

    return {
      template: 'BigImage',
      properties: {
        image: image,
        title: this.getPrimaryTitle(),
        align: 'center',
        valign: 'middle',
        isPageTitle: true,
        secondary: this.getSecondaryTitle()
      }
    };
  }

  getNeighborhoodBlock() {
    return {
      template: 'Neighborhood',
      properties: this.props.home.location.neighborhood
    };
  }

  render() {
    let blocks = [];
    blocks.push(this.getTitleBlock());
    blocks.push({
      template: 'ContentBlock',
      properties: {
        content: this.props.home.description,
        quote: true
      }
    });

    if (this.props.home.location.neighborhood) {
      blocks.push(this.getNeighborhoodBlock());
    }

    blocks.push({
      template: 'Agent',
      properties: {
        name: 'Arttu Manninen',
        title: 'Developer',
        phone: '+358505958435',
        email: 'arttu@kaktus.cc'
      }
    });

    return (
      <Story blocks={blocks} />
    );
  }
}

export default HomeDetails;
