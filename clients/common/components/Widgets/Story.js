'use strict';

import React from 'react';
import BigImage from './BigImage';
import ContentBlock from './ContentBlock';
import Gallery from './Gallery';

class Story extends React.Component {
  static propTypes = {
    blocks: React.PropTypes.string.isRequired
  };

  render() {
    return (
      <div className='story'>
        {
          this.props.blocks.map((item, index) => {
            let rval = null;
            switch (item.template) {
              case 'BigImage':
                rval = (
                  <BigImage {...item.properties}>
                    <div className='text-content' data-align={item.properties.align} data-valign={item.properties.valign}>
                      <h1>{item.properties.title}</h1>
                    </div>
                  </BigImage>
                );
                break;
              case 'Gallery':
                rval = (
                  <Gallery {...item.properties} />
                );
                break;
              case 'ContentBlock':
                rval = (
                  <ContentBlock {...item.properties}>
                    {item.properties.content}
                  </ContentBlock>
                );
                break;
            }

            return rval;
          })
        }
      </div>
    );
  }
}

export default Story;
