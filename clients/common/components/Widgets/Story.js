'use strict';

import React from 'react';
import BigImage from './BigImage';
import ContentBlock from './ContentBlock';
import Gallery from './Gallery';

class Story extends React.Component {
  static propTypes = {
    blocks: React.PropTypes.array.isRequired
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
                  <BigImage {...item.properties} key={index}>
                    <div className='text-content' data-align={item.properties.align} data-valign={item.properties.valign}>
                      <h1>{item.properties.title}</h1>
                    </div>
                  </BigImage>
                );
                break;
              case 'Gallery':
                rval = (
                  <Gallery {...item.properties} key={index} />
                );
                break;
              case 'ContentBlock':
                let content = (
                  <div className='content-wrapper'>{item.properties.content}</div>
                );

                rval = (
                  <ContentBlock {...item.properties} key={index}>
                    {content}
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
