'use strict';

import React from 'react';
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
            switch (item.template) {
              case 'BigImage':
                block = (
                  <BigImage {...item.properties} key={index}>
                    <div className='text-content' data-align={item.properties.align} data-valign={item.properties.valign}>
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
                block = (
                  <Map {...item.properties} key={index} />
                );
                break;

              case 'ContentBlock':
                let content = (
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
