'use strict';

import React from 'react';
import BigImage from './BigImage';
import ContentBlock from './ContentBlock';
import Gallery from './Gallery';

class Image extends React.Component {
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
                  <BigImage {...item} />
                );
                break;
              case 'Gallery':
                rval = (
                  <Gallery {...item} />
                );
                break;
              case 'ContentBlock':
                rval = (
                  <ContentBlock {...item} />
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

export default Image;
