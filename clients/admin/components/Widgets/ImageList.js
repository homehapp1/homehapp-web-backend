import React from 'react';

import Table from 'react-bootstrap/lib/Table';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import ApplicationStore from '../../../common/stores/ApplicationStore';

import {setCDNUrlProperties} from '../../../common/Helpers';

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
    label: React.PropTypes.string
  };

  static defaultProps = {
    images: [],
    storageKey: null,
    label: null
  };

  render() {
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

              return (
                <tr key={`homeImage-${idx}`}>
                  <td>
                    <a href={imageUrl} target='_blank'>
                      <img src={thumbnailUrl} alt={image.alt} />
                    </a>
                  </td>
                  <td>
                    <Input
                      type='text'
                      ref='alt'
                      label='Description'
                      placeholder='(optional)'
                      defaultValue={image.alt}
                      onChange={this.props.onChange.bind(this)}
                    />
                    <Input
                      type='text'
                      ref='author'
                      label='Author'
                      placeholder='(optional)'
                      defaultValue={image.author}
                      onChange={this.props.onChange.bind(this)}
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
