import React from 'react';

import Table from 'react-bootstrap/lib/Table';
import InputWidget from '../Widgets/Input';
import Button from 'react-bootstrap/lib/Button';
import ApplicationStore from '../../../common/stores/ApplicationStore';

import {setCDNUrlProperties} from '../../../common/Helpers';

let debug = require('../../../common/debugger')('ImageList');

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
    max: React.PropTypes.number,
    types: React.PropTypes.object
  };

  static defaultProps = {
    images: [],
    storageKey: 'images',
    label: null,
    max: Infinity,
    types: null
  };

  getValue() {
    debug('getValue for ImageList', this.props.images);
    return this.props.images;
  }

  getTypes(image) {
    if (!this.props.types) {
      return null;
    }

    // JS event for the type changing
    let typeChange = (event) => {
      image.tag = event.target.value || null;
      this.props.onChange(event);
      debug('set type', image);
    };

    // Create an array map
    let types = [];
    for (let k in this.props.types) {
      types.push({value: k, label: this.props.types[k]});
    }

    // Sort the types alphabetically
    types.sort((a, b) => {
      if (a.label > b.label) {
        return 1;
      }
      if (a.label > b.label) {
        return -1;
      }
      return 0;
    });

    return (
      <InputWidget
        type='select'
        defaultValue={image.tag}
        onChange={typeChange}
      >
        <option value=''>Select type...</option>
        {
          types.map((type, index) => {
            return (
              <option value={type.value} key={`imagelist-type-${index}`}>{type.label}</option>
            );
          })
        }
      </InputWidget>
    );
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
            <th>Description</th>
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

              // Always use a web compatible image suffix
              if (!thumbnailUrl.match(/\.(png|jpe?g|gif)$/i)) {
                thumbnailUrl = thumbnailUrl.replace(/\.[a-z0-9]{2,4}$/, '.jpg');
              }

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
                      placeholder='(description, recommended strongly)'
                      defaultValue={image.alt}
                      onChange={altChange}
                    />
                    {this.getTypes(image)}
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
