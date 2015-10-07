'use strict';

import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import AgentStore from '../../stores/AgentStore';
import AgentActions from '../../actions/AgentActions';
import UploadArea from '../../../common/components/UploadArea';
import UploadAreaUtils from '../../../common/components/UploadArea/utils';
import {randomNumericId, enumerate} from '../../../common/Helpers';
import ImageList from '../Widgets/ImageList';

let debug = require('../../../common/debugger')('AgentsEditDetails');

export default class AgentsEditDetails extends React.Component {
  static propTypes = {
    agent: React.PropTypes.object.isRequired,
    context: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.func
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onAgentStoreChange.bind(this);
    this.uploadListener = this.onUploadChange.bind(this);
    this.imageUploaderInstanceId = randomNumericId();
    this.state.agentImages = props.agent.images;
    this.onRemoveImageClicked = this.onRemoveImageClicked.bind(this);
    debug('Constructor', this);
  }

  state = {
    error: null,
    uploads: UploadAreaUtils.UploadStore.getState().uploads,
    currentAttributes: this.props.agent.attributes,
    agentImages: []
  }

  componentDidMount() {
    AgentStore.listen(this.storeListener);
  }

  componentWillUnmount() {
    AgentStore.unlisten(this.storeListener);
  }

  onAgentStoreChange(state) {
    debug('onAgentStoreChange', state);
    this.setState(state);
  }

  onUploadChange(state) {
    debug('onUploadChange', state);
    this.setState({
      uploads: UploadAreaUtils.UploadStore.getState().uploads
    });
  }

  onFormChange(/*event*/) {
    // let {type, target} = event;
    // TODO: Validation could be done here
    //debug('onFormChange', event, type, target);
    //this.props.agent.facilities = this.refs.facilities.getValue().split("\n");
  }

  onSave() {
    debug('save');

    let images = [];
    // Clean broken images
    this.state.agentImages.forEach((image) => {
      if (image.url) {
        images.push(image);
      }
    });

    let agentProps = {
      uuid: this.props.agent.id,
      firstname: this.refs.firstname.getValue(),
      lastname: this.refs.lastname.getValue(),
      phone: this.refs.phone.getValue(),
      email: this.refs.email.getValue(),
      company: {
        title: this.refs.companyTitle.getValue(),
        phone: this.refs.companyPhone.getValue(),
        email: this.refs.companyEmail.getValue()
      },
      images: images
    };

    this.saveAgent(agentProps);
  }

  saveAgent(agentProps) {
    debug('Update agentProps', agentProps);
    AgentActions.updateItem(agentProps);
  }

  onCancel() {
    React.findDOMNode(this.refs.agentDetailsForm).reset();
  }

  onImageUpload(data) {
    debug('onImageUpload', data);

    let imageExists = (url) => {
      let found = false;
      this.state.agentImages.forEach((img) => {
        if (img.url === url) {
          found = true;
        }
      });
      return found;
    };

    if (this.state.uploads) {
      if (this.state.uploads[this.imageUploaderInstanceId]) {
        let uploads = this.state.uploads[this.imageUploaderInstanceId];
        for (let [key, imageData] of enumerate(uploads)) {
          debug(key, 'data:', imageData);
          let isMaster = false;
          let agentImage = {
            url: imageData.url,
            width: imageData.width,
            height: imageData.height,
            isMaster: isMaster
          };

          if (!imageExists(agentImage.url)) {
            this.state.agentImages = [agentImage];
          }
        }
      }
    }

    this.setState({
      agentImages: this.state.agentImages
    });
  }

  onRemoveImageClicked(index) {
    let newImages = [];
    this.state.agentImages.forEach((item, idx) => {
      if (idx !== index) {
        newImages.push(item);
      }
    });
    this.setState({agentImages: newImages});
  }

  onRemoveAttributeClicked(index) {
    let newAttributes = [];
    this.state.currentAttributes.forEach((item, idx) => {
      if (idx !== index) {
        newAttributes.push(item);
      }
    });
    this.setState({currentAttributes: newAttributes});
  }

  handlePendingState() {
    return (
      <div className='agent-saving'>
        <h3>Saving agent...</h3>
      </div>
    );
  }

  handleErrorState() {
    return (
      <div className='agent-error'>
        <h3>Error updating agent!</h3>
        <p>{this.state.error.message}</p>
      </div>
    );
  }

  render() {
    let error = null;
    let savingLoader = null;
    if (this.state.error) {
      error = this.handleErrorState();
    }
    if (AgentStore.isLoading()) {
      savingLoader = this.handlePendingState();
    }

    return (
      <Row>
        {error}
        {savingLoader}
        <form name='agentDetails' ref='agentDetailsForm' method='POST'>
          <Col md={10} sm={10}>
            <Panel header='Common'>
              <Input
                type='text'
                ref='firstname'
                label='First name'
                placeholder='First name'
                defaultValue={this.props.agent.firstname}
                onChange={this.onFormChange.bind(this)}
                required
              />
              <Input
                type='text'
                ref='lastname'
                label='Last name'
                placeholder='Last name'
                defaultValue={this.props.agent.lastname}
                onChange={this.onFormChange.bind(this)}
                required
              />
              <Input
                type='email'
                ref='email'
                label='Email'
                placeholder='firstname.lastname@company.co.uk'
                defaultValue={this.props.agent.email}
                onChange={this.onFormChange.bind(this)}
                required
              />
              <Input
                type='tel'
                ref='phone'
                label='Phone number'
                placeholder='+44 123 00 11 22'
                defaultValue={this.props.agent.phone}
                onChange={this.onFormChange.bind(this)}
                required
              />
            </Panel>
            <Panel header='Company'>
              <Input type='text'
                ref='companyTitle'
                label='Company name'
                placeholder='Company Name Ltd'
                defaultValue={this.props.agent.company.title}
              />
              <Input type='email'
                ref='companyEmail'
                label='Company email'
                placeholder='email@company.co.uk'
                defaultValue={this.props.agent.company.email}
              />
            <Input type='tel'
                ref='companyPhone'
                label='Company phone'
                placeholder='+44 123 00 11 22'
                defaultValue={this.props.agent.company.title}
              />
            </Panel>
            <Panel header='Images'>
              <Row>
                <Col md={6}>
                  <h2>Image</h2>
                  <ImageList images={this.state.agentImages} onRemove={this.onRemoveImageClicked} onChange={this.onFormChange} max={1} />
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
                  <Button bsStyle='success' accessKey='s' onClick={this.onSave.bind(this)}>Save</Button>
                </Col>
                <Col md={6} pullRight>
                  <Button bsStyle='danger' className='pull-right'>Delete</Button>
                </Col>
              </Row>
            </Well>
          </Col>
        </form>
      </Row>
    );
  }
}
