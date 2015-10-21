import React from 'react';

import Table from 'react-bootstrap/lib/Table';
import InputWidget from '../Widgets/Input';
import Button from 'react-bootstrap/lib/Button';
import ApplicationStore from '../../../common/stores/ApplicationStore';

import {setCDNUrlProperties} from '../../../common/Helpers';

// let debug = require('../../../common/debugger')('ImageList');

function getFullImageUrl(url) {
  if (!url.match(/^http/)) {
    url = `${ApplicationStore.getState().config.cloudinary.baseUrl}${url}`;
  }
  return url;
}

export default class ImageList extends React.Component {
  static propTypes = {
    images: React.PropTypes.array,
    onRemove: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    storageKey: React.PropTypes.string,
    label: React.PropTypes.string,
    max: React.PropTypes.number
  };

  static defaultProps = {
    images: [],
    storageKey: null,
    label: null,
    max: Infinity
  };

  getValue() {
    return this.props.images;
  }

  render() {
    // Get the last images of the stack when the max quantity is defined
    if (this.props.images.length > this.props.max) {
      let d = this.props.images.length - this.props.max;
      this.props.images = this.props.images.splice(d, this.props.max);
    }

    return (
      <Table>
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            this.props.images.map((image, idx) => {
              if (!image.url) {
                return null;
              }

              let imageUrl = getFullImageUrl(image.url);
              let thumbnailUrl = setCDNUrlProperties(imageUrl, {
                w: 80,
                h: 80,
                c: 'fill'
              });

              let altChange = (event) => {
                image.alt = event.target.value;
                this.props.onChange(event);
              };

              return (
                <tr key={`homeImage-${idx}`}>
                  <td>
                    <a href={imageUrl} target='_blank'>
                      <img src={thumbnailUrl} alt={image.alt} />
                    </a>
                  </td>
                  <td>
                    <InputWidget
                      type='text'
                      ref='alt'
                      label='Short human-readable description'
                      placeholder='(optional, but strongly recommended)'
                      defaultValue={image.alt}
                      onChange={altChange}
                    />
                  </td>
                  <td>
                    <Button
                      bsStyle='danger'
                      bsSize='small'
                      onClick={() => this.props.onRemove(idx, this.props.storageKey)}>
                      Remove
                    </Button>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </Table>
    );
  }
}
