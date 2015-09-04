'use strict';

import React from 'react';

// Widgets
import Agent from './Agent';
import BigImage from './BigImage';
import ContentBlock from './ContentBlock';
import Gallery from './Gallery';
import LargeText from './LargeText';
import Map from './Map';
import Neighborhood from './Neighborhood';

class Story extends React.Component {
  static propTypes = {
    blocks: React.PropTypes.array.isRequired
  };

  getAgent(item, index) {
    return (<Agent {...item.properties} key={index} />);
  }

  getBigImage(item, index) {
    let primary = null;
    let secondary = null;

    // Is this the primary title?
    if (item.properties.isPageTitle || !index) {
      primary = (<h1>{item.properties.title}</h1>);
    } else {
      primary = (<h2>{item.properties.title}</h2>);
    }

    if (item.properties.secondary) {
      secondary = (
        <div className='secondary'>{item.properties.secondary}</div>
      );
    }

    return (
      <BigImage {...item.properties} key={index}>
        <LargeText align={item.properties.align} valign={item.properties.valign}>
          {primary}
        </LargeText>
        {secondary}
      </BigImage>
    );
  }

  getGallery(item, index) {
    return (<Gallery {...item.properties} key={index} />);
  }

  getMap(item, index) {
    let content = (
      <div className='content-wrapper'>
        <h2>{item.properties.label}</h2>
        {item.properties.content}
      </div>
    );
    return (
      <Map {...item.properties} key={index}>
        {content}
      </Map>
    );
  }

  getNeighborhood(item, index) {
    return (
      <Neighborhood {...item.properties} key={index} />
    );
  }

  getContentBlock(item, index) {
    let content = (
      <div className='content-wrapper'>{item.properties.content}</div>
    );

    return (
      <ContentBlock {...item.properties} key={index}>
        {content}
      </ContentBlock>
    );
  }

  render() {
    let blocks = this.props.blocks;
    return (
      <div className='story'>
        {
          blocks.map((item, index) => {
            let method = `get${item.template}`;

            if (typeof this[method] === 'function') {
              return this[method](item, index);
            }

            console.warn(`No method ${method} defined, cannot get story block with type ${item.template}`);
          })
        }
      </div>
    );
  }
}

export default Story;
