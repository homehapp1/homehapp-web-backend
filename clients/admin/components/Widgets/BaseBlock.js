'use strict';

import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Table from 'react-bootstrap/lib/Table';
import Input from 'react-bootstrap/lib/Input';
import Well from 'react-bootstrap/lib/Well';
import UploadArea from '../../../common/components/UploadArea';
import UploadAreaUtils from '../../../common/components/UploadArea/utils';
import ApplicationStore from '../../../common/stores/ApplicationStore';
import {randomNumericId, setCDNUrlProperties, merge, enumerate} from '../../../common/Helpers';
import ImageList from './ImageList';

let debug = require('../../../common/debugger')('WidgetsBaseBlock');

function getFullImageUrl(url) {
  if (!url.match(/^http/)) {
    url = `${ApplicationStore.getState().config.cloudinary.baseUrl}${url}`;
  }
  return url;
}

function getFullVideoUrl(url) {
  return getFullImageUrl(url);
}

export default class WidgetsBaseBlock extends React.Component {
  // static propTypes = {
  //   onPropertiesChange: React.PropTypes.func.isRequired
  // }

  constructor(props) {
    super(props);
    this.uploadListener = this.onUploadChange.bind(this);
    this.uploaderInstanceIds = {};
    this.onRemoveImageClicked = this.onRemoveImageClicked.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
  }

  state = {
    uploads: UploadAreaUtils.UploadStore.getState().uploads
  };

  blockProperties = {};

  getValues() {
    debug('getValues', this.props);
    let values = this.props;
    Object.keys(this.blockProperties).map((key) => {
      let refKey = `${key}Ref`;
      if (this.refs[refKey]) {
        if (this.blockProperties[key].type !== 'checkbox') {
          values[key] = this.refs[refKey].getValue();
        }
      }
    });
    return values;
  }

  onUploadChange(state) {
    debug('onUploadChange', state);
    this.setState({
      uploads: UploadAreaUtils.UploadStore.getState().uploads
    });
  }

  onImageUpload(key, file) {
    debug('onImageUpload', key, file);
    //console.log('b this.props[key]', this.props[key]);
    if (!this.state.uploads) {
      return;
    }
    //console.log('this.blockProperties[key].type', this.blockProperties[key].type);
    let uploads = this.state.uploads[this.uploaderInstanceIds[key]];
    //console.log('uploads', uploads);
    if (this.blockProperties[key].type === 'image' || this.blockProperties[key].type === 'video') {
      for (let [k, imageData] of enumerate(uploads)) {
        //debug(k, 'data:', imageData);
        this.props[key] = merge(this.props[key], {
          url: imageData.url,
          width: imageData.width,
          height: imageData.height,
          aspectRatio: (imageData.width / imageData.height)
        });
      }
    } else if (this.blockProperties[key].type === 'images') {
      for (let [k, imageData] of enumerate(uploads)) {
        //debug(k, 'data:', imageData);
        this.props[key].push({
          url: imageData.url,
          width: imageData.width,
          height: imageData.height,
          aspectRatio: (imageData.width / imageData.height)
        });
      }
    }

    this.forceUpdate();
    //console.log('a this.props[key]', this.props[key]);
  }

  onVideoUpload(key, file) {
    debug('onVideoUpload', key, file);
    this.onImageUpload(key, file);
  }

  onRemoveImageClicked(index, key) {
    let newImages = [];
    this.props[key].forEach((item, idx) => {
      if (idx !== index) {
        newImages.push(item);
      }
    });
    this.props[key] = newImages;
    this.forceUpdate();
  }

  onFormChange(key, event, prop) {
    // console.log('onFormChange event', key, event, prop);
  }

  onImageChange(event) {
    console.log('onImageChange event', event);
  }

  onVideoChange(event) {
    console.log('onVideoChange event', event);
  }

  renderPropertyRow(key, prop) {
    let input = null;

    let placeholder = '';
    if (prop.placeholder) {
      placeholder = prop.placeholder;
    }
    let defaultValue = this.props[key] || null;
    if (!defaultValue && prop.defaultValue) {
      defaultValue = prop.defaultValue;
    }

    let inputProps = {
      defaultValue: defaultValue
    };

    switch(prop.type) {
      case 'text':
      case 'textarea':
      case 'checkbox':
      case 'select':
        let options = null;
        if (prop.type === 'checkbox') {
          if (this.props[key]) {
            inputProps.checked = true;
          }
          delete inputProps.defaultValue;
        }
        if (prop.type === 'select') {
          options = prop.options.map((inputOption, idx) => {
            let optKey = key + '-sv-' + idx;
            return (
              <option
                key={optKey}
                value={inputOption[0]}
              >
                {inputOption[1]}
              </option>
            );
          });
        }

        input = (
          <Input
            type={prop.type}
            name={key}
            label={prop.label}
            ref={key + 'Ref'}
            placeholder={placeholder}
            onChange={(e) => {
              if (prop.type === 'checkbox') {
                this.props[key] = !(this.props[key]);
                this.forceUpdate();
              }
              this.onFormChange(key, e, prop);
            }}
            {...inputProps}
          >
            {options}
          </Input>
        );
        break;
      case 'video':
        input = this.renderVideoInput(key, prop);
        break;
      case 'image':
        input = this.renderImageInput(key, prop);
        break;
      case 'images':
        input = this.renderImagesInput(key, prop);
        break;
    }

    return input;
  }

  renderImageInput(key, prop) {
    this.uploaderInstanceIds[key] = randomNumericId();

    let imageUrl = null;
    let thumbnailUrl = null;

    if (this.props[key]) {
      imageUrl = getFullImageUrl(this.props[key].url);
      thumbnailUrl = setCDNUrlProperties(imageUrl, {
        w: 80,
        h: 80,
        c: 'fill'
      });
    }

    let uploaderConfig = merge({
      signatureFolder: 'homeImage',
      acceptedMimes: 'image/*',
      width: '100%',
      height: '80px'
    }, prop.config || {});

    return (
      <Table>
        <thead>
          <tr>
            <th>Current</th>
            <th>Upload new</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <a href={imageUrl}>
                <img src={thumbnailUrl} alt='' />
              </a>
            </td>
            <td>
              <UploadArea
                className={`uploadarea ${key}-uploadarea`}
                onUpload={(file) => {
                  this.onImageUpload(key, file);
                }}
                instanceId={this.uploaderInstanceIds[key]}
                {...uploaderConfig}
              >
                <Well>
                  <p>Drag new image here, or click to select from filesystem.</p>
                </Well>
              </UploadArea>
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }

  renderVideoInput(key, prop) {
    this.uploaderInstanceIds[key] = randomNumericId();

    let videoUrl = null;
    let thumbnailUrl = null;
    debug('renderVideoInput');
    debug(this.props[key]);

    if (this.props[key]) {
      videoUrl = getFullVideoUrl(this.props[key].url);
      thumbnailUrl = setCDNUrlProperties(videoUrl.replace(/\.[a-zA-Z0-9]{2,4}$/, '.jpg'), {
        w: 80,
        h: 80,
        c: 'fill'
      });
    }

    let uploaderConfig = merge({
      signatureFolder: 'homeVideo',
      acceptedMimes: 'video/*',
      width: '100%',
      height: '80px'
    }, prop.config || {});

    return (
      <Table>
        <thead>
          <tr>
            <th>Current</th>
            <th>Upload new</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <a href={videoUrl}>
                <img src={thumbnailUrl} alt='' />
              </a>
            </td>
            <td>
              <UploadArea
                isVideo
                className={`uploadarea ${key}-uploadarea`}
                onUpload={(file) => {
                  this.onVideoUpload(key, file);
                }}
                instanceId={this.uploaderInstanceIds[key]}
                {...uploaderConfig}
              >
                <Well>
                  <p>Drag new video here, or click to select from filesystem.</p>
                </Well>
              </UploadArea>
            </td>
          </tr>
        </tbody>
      </Table>
    );
  }

  renderImagesInput(key, prop) {
    this.uploaderInstanceIds[key] = randomNumericId();
    let images = this.props[key] || [];

    let uploaderConfig = merge({
      signatureFolder: 'homeImage',
      acceptedMimes: 'image/*',
      width: '100%',
      height: '80px'
    }, prop.config || {});

    return (
      <Row>
        <Col md={6}>
          <h2>Current images</h2>
          <ImageList images={images} onChange={this.onImageChange} onRemove={this.onRemoveImageClicked} storageKey={key} label={prop.label} />
        </Col>
        <Col md={6}>
          <UploadArea
            className={`uploadarea ${key}-uploadarea`}
            onUpload={(file) => {
              this.onImageUpload(key, file);
            }}
            instanceId={this.uploaderInstanceIds[key]}
            {...uploaderConfig}
          >
            <Well>
              <p>Drag new image here, or click to select from filesystem.</p>
            </Well>
          </UploadArea>
        </Col>
      </Row>
    );
  }

  render() {
    return (
      <Row>
        <Col md={10} sm={10}>
          {
            Object.keys(this.blockProperties).map((key) => {
              return (
                <div key={'bp-' + key}>
                  {this.renderPropertyRow(key, this.blockProperties[key])}
                </div>
              );
            })
          }
        </Col>
      </Row>
    );
  }
}
