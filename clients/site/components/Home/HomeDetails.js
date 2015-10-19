

import React from 'react';

import StoryLayout from '../../../common/components/Layout/StoryLayout';
import HomeNavigation from './HomeNavigation';

import { setPageTitle } from '../../../common/Helpers';

// let debug = require('debug')('HomeDetails');

export default class HomeDetails extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired
  }

  componentDidMount() {
    setPageTitle(this.props.home.homeTitle);
  }

  componentWillUnmount() {
    setPageTitle();
  }

  getSecondaryTitle() {
    let content = this.props.home.attributes.map(function(c) {
      // Add the items that should be included in the secondary title
      let rval = null;
      switch (c.name) {
        case 'rooms':
          rval = (c.value === 1) ? (<span>1 room</span>) : (<span>{c.value} rooms</span>);
          break;
      }
      return rval;
    });

    content.push((<span>{this.props.home.formattedPrice}</span>));

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
        title: this.props.home.homeTitle,
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

  getIconList() {
    return [
      {
        icon: 'floorplan',
        label: 'Floor plan'
      },
      {
        icon: 'epc',
        label: 'EPC'
      },
      {
        icon: 'brochures',
        label: 'Brochure'
      }
    ];
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

    if (this.props.home.images.length > 1) {
      blocks.push({
        template: 'Gallery',
        properties: {
          images: this.props.home.images,
          className: 'pattern details-view'
        }
      });
    }

    let iconlist = this.getIconList();

    if (iconlist.length) {
      blocks.push({
        template: 'IconList',
        properties: {
          icons: iconlist
        }
      });
    }

    blocks.push({
      template: 'Details',
      properties: {
        home: this.props.home
      }
    });

    if (this.props.home.location.neighborhood) {
      blocks.push({
        template: 'Separator',
        properties: {}
      });

      blocks.push(this.getNeighborhoodBlock());
    }

    blocks.push({
      template: 'Separator',
      properties: {
        icon: 'marker'
      }
    });

    blocks.push({
      template: 'Map',
      properties: this.props.home.location
    });

    // blocks.push({
    //   template: 'Agent',
    //   properties: {
    //     name: 'Arttu Manninen',
    //     title: 'Developer',
    //     phone: '+358505958435',
    //     email: 'arttu@kaktus.cc'
    //   }
    // });

    return (
      <div className='home-view'>
        <HomeNavigation home={this.props.home} />
        <StoryLayout blocks={blocks} />
      </div>
    );
  }
}
