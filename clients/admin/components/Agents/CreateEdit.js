'use strict';

import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Well from 'react-bootstrap/lib/Well';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import Input from 'react-bootstrap/lib/Input';
import AgentStore from '../../stores/AgentStore';
import AgentActions from '../../actions/AgentActions';
import AgentListActions from '../../actions/AgentListActions';
import UploadArea from '../../../common/components/UploadArea';
import UploadAreaUtils from '../../../common/components/UploadArea/utils';
import ImageList from '../Widgets/ImageList';
import { randomNumericId, merge } from '../../../common/Helpers';

const countries = require('../../../common/lib/Countries').forSelect();
let debug = require('../../../common/debugger')('AgentsCreateEdit');

export default class AgentsCreateEdit extends React.Component {
  static propTypes = {
    model: React.PropTypes.object,
    onSave: React.PropTypes.func,
    onCancel: React.PropTypes.func
  }
  static defaultProps = {
    model: null,
    onSave: null,
    onCancel: null
  }

  constructor(props) {
    debug('constructor', props);
    super(props);
    if (props.model) {
      this.state.model = props.model;
      this.state.images = props.model.images;
    }
    this.storeListener = this.onChange.bind(this);

    this.uploadListener = this.onUploadChange.bind(this);
    this.imageUploaderInstanceId = randomNumericId();
  }

  componentDidMount() {
    debug('componentDidMount');
    AgentStore.listen(this.storeListener);
  }

  componentWillUnmount() {
    debug('componentWillUnmount');
    AgentStore.unlisten(this.storeListener);
  }

  state = {
    error: null,
    model: null,
    images: [],
    uploads: UploadAreaUtils.UploadStore.getState().uploads
  }

  onChange(state) {
    debug('onChange', state);

    if (state.created) {
      return window.location.reload();
    }

    this.setState(state);
  }

  onUploadChange(state) {
    debug('onUploadChange', state);
    this.setState({
      uploads: UploadAreaUtils.UploadStore.getState().uploads
    });
  }

  onSave() {
    debug('onSave');

    let images = [];
    // Clean broken images
    this.state.images.forEach((image) => {
      if (image.url) {
        images.push(image);
      }
    });

    let data = {
      firstname: this.refs.firstname.getValue(),
      lastname: this.refs.lastname.getValue(),
      contactNumber: this.refs.contactNumber.getValue(),
      _realPhoneNumber: this.refs.realPhoneNumber.getValue(),
      _realPhoneNumberType: this.refs.realPhoneNumberType.getValue(),
      email: this.refs.email.getValue(),
      location: {
        address: {
          country: this.refs.addressCountry.getValue()
        }
      },
      // @TODO: agency selector
      images: images
    };

    if (this.state.model) {
      data.id = this.state.model.id;
    }

    if (this.state.uploads) {
      if (this.state.uploads[this.logoUploaderInstanceId]) {
        let uploads = this.state.uploads[this.logoUploaderInstanceId];
        let key = Object.keys(uploads)[0];
        data.logo = {
          url: uploads[key].url,
          width: uploads[key].width,
          height: uploads[key].height
        };
      }
    }

    if (data.id) {
      AgentActions.updateItem(data);
    } else {
      AgentActions.createItem(data);
    }

    if (this.props.onSave) {
      this.props.onSave();
    }
  }

  onCancel() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  onReleaseNumber() {
    AgentActions.releaseNumber(this.props.model.id);
  }

  imageExists(url) {
    debug('Check if image exists', this.state.images);
    let found = false;
    this.state.images.forEach((img) => {
      if (img.url === url) {
        debug('Image exists');
        found = true;
      }
    });
    debug('Image does not exist');
    return found;
  }

  addImage(imageData) {
    debug('Add image', imageData);
    let isMaster = false;
    let image = {
      url: imageData.url,
      width: imageData.width,
      height: imageData.height,
      isMaster: isMaster
    };

    if (!this.imageExists(image.url, this.state.images)) {
      debug('Add', image);
      this.state.images.push(image);
    }
  }

  addImages() {
    debug('addImages', this.state.uploads);
    if (this.state.uploads) {
      if (this.state.uploads[this.imageUploaderInstanceId]) {
        let uploads = this.state.uploads[this.imageUploaderInstanceId];
        debug('uploads str', uploads, typeof uploads);
        for (let i in uploads) {
          this.addImage(uploads[i]);
        }
      }
    }
  }

  onImageUpload(data) {
    debug('onImageUpload', data);
    this.addImages();

    this.setState({
      images: this.state.images
    });
  }

  onRemoveImageClicked(index) {
    let newImages = [];
    this.state.images.forEach((item, idx) => {
      if (idx !== index) {
        newImages.push(item);
      }
    });
    this.setState({images: newImages});
  }

  handlePendingState() {
    return (
      <div className='model-saving'>
        <h3>Saving model...</h3>
      </div>
    );
  }

  handleErrorState() {
    return (
      <div className='model-error'>
        <h3>Error saving model!</h3>
        <p>{this.state.error.message}</p>
      </div>
    );
  }

  getCountryOptions() {
    return countries.map((country) => {
      return (
        <option
          value={country.value}
          key={'locCountry-' + country.value}>
          {country.label}
        </option>
      );
    });
  }

  render() {
    let error = null;
    let savingLoader = null;
    let statusMessage = null;
    let saveButtonDisabled = null;
    let formTitle = 'Create model';

    if (this.state.model) {
      formTitle = null;
    }

    if (this.state.error) {
      error = this.handleErrorState();
    }

    if (AgentStore.isLoading()) {
      savingLoader = this.handlePendingState();
      saveButtonDisabled = 'disabled';
    }

    if (this.state.saved) {
      statusMessage = (
        <p className='bg-success'>
          Model saved successfully!
        </p>
      );
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }

    let agent = merge({
      realPhoneNumberType: 'mobile'
    }, this.props.model || {});
    let location = merge({
      address: {
        country: 'GB'
      }
    }, agent.location || {});

    let releaseNumberColumn = (
      <Col xs={6}>
        <Button
          bsStyle='danger'
          onClick={this.onReleaseNumber.bind(this)}
        >
          Release number
        </Button>
      </Col>
    );
    if (!agent.contactNumber) {
      releaseNumberColumn = null;
    }

    let countrySelections = this.getCountryOptions();

    return (
      <Row className="center-block">
        <h1>{formTitle}</h1>

        <p>
          {error}
          {savingLoader}
          {statusMessage}
        </p>

        <form name='agentDetails' ref='agentDetailsForm' method='POST'>
          <Col md={10} sm={10}>
            <Panel header='Common'>
              <Input
                type='text'
                ref='firstname'
                label='First name'
                placeholder='First name'
                defaultValue={agent.firstname}
                required
              />
              <Input
                type='text'
                ref='lastname'
                label='Last name'
                placeholder='Last name'
                defaultValue={agent.lastname}
                required
              />
              <Input
                type='email'
                ref='email'
                label='Email'
                placeholder='firstname.lastname@company.co.uk'
                defaultValue={agent.email}
                required
              />
              <Input label='Real Contact Number' wrapperClassName="wrapper">
                <Row>
                  <Col xs={5}>
                    <Input
                      type='select'
                      ref='addressCountry'
                      label='Country'
                      placeholder='Select Country'
                      defaultValue={location.address.country}>
                      <option value=''>Select country</option>
                      {countrySelections}
                    </Input>
                  </Col>
                  <Col xs={3}>
                    <Input
                      type='select'
                      ref='realPhoneNumberType'
                      label='Type'
                      placeholder='Type'
                      defaultValue={agent.realPhoneNumberType}>
                      <option value='mobile'>Mobile</option>
                      <option value='local'>Landline</option>
                    </Input>
                  </Col>
                  <Col xs={4}>
                    <Input
                      type='tel'
                      ref='realPhoneNumber'
                      label='Number'
                      placeholder='+44 123 00 11 22'
                      defaultValue={agent.realPhoneNumber}
                      required
                    />
                  </Col>
                </Row>
              </Input>
              <Input label='Twilio Phone number (auto-generated if empty)' wrapperClassName="wrapper">
                <Row>
                  <Col xs={6}>
                    <Input
                      type='tel'
                      ref='contactNumber'
                      placeholder='+44 123 00 11 22'
                      defaultValue={agent.contactNumber}
                    />
                  </Col>
                  {releaseNumberColumn}
                </Row>
              </Input>
            </Panel>
            <Panel header='Agency'>
              <p>TODO: add a selector for agency</p>
            </Panel>
            <Panel header='Images'>
              <Row>
                <Col md={6}>
                  <h2>Image</h2>
                  <ImageList images={this.state.images} onRemove={this.onRemoveImageClicked.bind(this)} max={1} />
                </Col>
                <Col md={6}>
                  <UploadArea
                    className='uploadarea image-uploadarea'
                    signatureFolder='agentImage'
                    width='100%'
                    height='80px'
                    onUpload={this.onImageUpload.bind(this)}
                    acceptedMimes='image/*'
                    instanceId={this.imageUploaderInstanceId}>
                    <Well>
                      <p>Drag new image here, or click to select from filesystem.</p>
                    </Well>
                  </UploadArea>
                </Col>
              </Row>
            </Panel>
            <Well>
              <Row>
                <Col md={6}>
                  <Button
                    ref='saveButton'
                    bsStyle='success'
                    accessKey='s'
                    onClick={this.onSave.bind(this)}>Save</Button>
                </Col>
                <Col md={6} pullRight>
                  <Button
                    ref='cancelButton'
                    bsStyle='danger'
                    className='pull-right'
                    onClick={this.onCancel.bind(this)}>Cancel</Button>
                </Col>
              </Row>
            </Well>
          </Col>
        </form>
      </Row>
    );
  }
}
