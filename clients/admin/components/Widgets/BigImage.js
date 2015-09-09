'use strict';

import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Table from 'react-bootstrap/lib/Table';
import Input from 'react-bootstrap/lib/Input';
import UploadArea from '../../../common/components/UploadArea';
import UploadAreaUtils from '../../../common/components/UploadArea/utils';
import ApplicationStore from '../../../common/stores/ApplicationStore';
import {randomNumericId, enumerate, setCDNUrlProperties} from '../../../common/Helpers';

let debug = require('../../../common/debugger')('AdminBigImage');

function getFullImageUrl(url) {
  if (!url.match(/^http/)) {
    url = `${ApplicationStore.getState().config.cloudinary.baseUrl}${url}`;
  }
  return url;
}

export default class AdminBigImage extends React.Component {
  blockProperties = {
    title: {
      label: 'Title',
      type: 'text'
    },
    description: {
      label: 'Description',
      type: 'textarea'
    },
    fixed: {
      label: 'Fixed',
      type: 'checkbox'
    },
    align: {
      label: 'Horizontal align',
      type: 'select',
      options: [
        ['left', 'Left'], ['center', 'Center'], ['right', 'Right']
      ]
    },
    valign: {
      label: 'Vertical align',
      type: 'select',
      options: [
        ['top', 'Top'], ['middle', 'Middle'], ['bottom', 'Bottom']
      ]
    },
    image: {
      label: 'Image',
      type: 'image'
    }
  }

  constructor(props) {
    super(props);
    this.uploadListener = this.onUploadChange.bind(this);
    this.uploaderInstanceIds = {};
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

  onFormChange(event) {

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
    }

    return input;
  }

  renderImageInput(key, prop) {
    this.uploaderInstanceIds[key] = randomNumericId();

    let imageUrl = getFullImageUrl(this.props[key].url);
    let thumbnailUrl = setCDNUrlProperties(imageUrl, {
      w: 80,
      h: 80,
      c: 'fill'
    });

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
                Drag new image here, or click to select from filesystem.
              </UploadArea>
            </td>
          </tr>
        </tbody>
      </Table>
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
