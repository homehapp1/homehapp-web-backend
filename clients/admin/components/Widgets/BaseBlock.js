'use strict';

import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Table from 'react-bootstrap/lib/Table';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import UploadArea from '../../../common/components/UploadArea';
import UploadAreaUtils from '../../../common/components/UploadArea/utils';
import ApplicationStore from '../../../common/stores/ApplicationStore';
import {randomNumericId, enumerate, setCDNUrlProperties} from '../../../common/Helpers';
import ImageList from './ImageList';

let debug = require('../../../common/debugger')('WidgetsBaseBlock');

function getFullImageUrl(url) {
  if (!url.match(/^http/)) {
    url = `${ApplicationStore.getState().config.cloudinary.baseUrl}${url}`;
  }
  return url;
}

export default class WidgetsBaseBlock extends React.Component {
  blockProperties = {}

  constructor(props) {
    super(props);
    this.uploadListener = this.onUploadChange.bind(this);
    this.uploaderInstanceIds = {};
    this.onRemoveImageClicked = this.onRemoveImageClicked.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
  }

  state = {
    uploads: UploadAreaUtils.UploadStore.getState().uploads
  }

  onUploadChange(state) {
    debug('onUploadChange', state);
    this.setState({
      uploads: UploadAreaUtils.UploadStore.getState().uploads
    });
  }

  onImageUpload(data) {
    debug('onImageUpload', data);
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

  onFormChange(event) {
    console.log('onFormChange event', event);
  }

  onImageChange(event) {
    console.log('onImageChange event', event);
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

    let inputProps = {};

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
        }
        if (prop.type === 'select') {
          options = prop.options.map((inputOption) => {
            return <option value={inputOption[0]}>{inputOption[1]}</option>;
          });
        }

        input = (
          <Input
            type={prop.type}
            name={key}
            label={prop.label}
            ref={key}
            placeholder={placeholder}
            defaultValue={defaultValue}
            onChange={this.onFormChange.bind(this)}
            {...inputProps}
          >
            {options}
          </Input>
        );
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
                signatureFolder='homeImage'
                width='100%'
                height='80px'
                onUpload={this.onImageUpload.bind(this)}
                acceptedMimes='image/*'
                instanceId={this.uploaderInstanceIds[key]}>
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

  renderImagesInput(key, prop) {
    this.uploaderInstanceIds[key] = randomNumericId();
    let images = this.props[key] || [];

    return (
      <Row>
        <Col md={6}>
          <h2>Current images</h2>
          <ImageList images={images} onChange={this.onImageChange} onRemove={this.onRemoveImageClicked} storageKey={key} />
        </Col>
        <Col md={6}>
          <UploadArea
            className={`uploadarea ${key}-uploadarea`}
            signatureFolder='homeImage'
            width='100%'
            height='80px'
            onUpload={this.onImageUpload.bind(this)}
            acceptedMimes='image/*'
            instanceId={this.uploaderInstanceIds[key]}>
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
              return this.renderPropertyRow(
                key, this.blockProperties[key]
              );
            })
          }
        </Col>
      </Row>
    );
  }
}
