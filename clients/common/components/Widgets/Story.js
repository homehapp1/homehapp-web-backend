'use strict';

import React from 'react';

// Widgets
import Agent from './Agent';
import BigImage from './BigImage';
import ContentBlock from './ContentBlock';
import Gallery from './Gallery';
import Map from './Map';

class Story extends React.Component {
  static propTypes = {
    blocks: React.PropTypes.array.isRequired
  };

  render() {
    let blocks = this.props.blocks;
    return (
      <div className='story'>
        {
          blocks.map((item, index) => {
            let block = null;
            let content = null;

            switch (item.template) {
              case 'Agent':
                block = (
                  <Agent {...item.properties} key={index} />
                );
                break;

              case 'BigImage':
                block = (
                  <BigImage {...item.properties} key={index}>
                    <div className='text-content large-text' data-align={item.properties.align} data-valign={item.properties.valign}>
                      <h1>{item.properties.title}</h1>
                    </div>
                  </BigImage>
                );
                break;

              case 'Gallery':
                block = (
                  <Gallery {...item.properties} key={index} />
                );
                break;

              case 'Map':
                content = (
                  <div className='content-wrapper'>
                    <h2>{item.properties.label}</h2>
                    {item.properties.content}
                  </div>
                );
                block = (
                  <Map {...item.properties} key={index}>
                    {content}
                  </Map>
                );
                break;

              case 'ContentBlock':
                content = (
                  <div className='content-wrapper'>{item.properties.content}</div>
                );

                block = (
                  <ContentBlock {...item.properties} key={index}>
                    {content}
                  </ContentBlock>
                );
                break;

              default:
                console.log('Undefined story block type', item);
            }

            return block;
          })
        }
      </div>
    );
  }
}

export default Story;
