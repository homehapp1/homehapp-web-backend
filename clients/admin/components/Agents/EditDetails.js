'use strict';

import React from 'react';
import { Link } from 'react-router';
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
import { randomNumericId, merge } from '../../../common/Helpers';
import ImageList from '../Widgets/ImageList';
import EditDetails from '../Shared/EditDetails';

let debug = require('../../../common/debugger')('AgentsEditDetails');

export default class AgentsEditDetails extends EditDetails {
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
    this.state.images = props.agent.images;
    this.onRemoveImageClicked = this.onRemoveImageClicked.bind(this);
    debug('Constructor', this);
  }

  state = {
    error: null,
    uploads: UploadAreaUtils.UploadStore.getState().uploads,
    images: []
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
    this.state.images.forEach((image) => {
      if (image.url) {
        images.push(image);
      }
    });

    let agentProps = {
      uuid: this.props.agent.id,
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
    this.saveAgent(agentProps);
  }

  onReleaseNumber() {
    debug('onReleaseNumber');
    AgentActions.releaseNumber(this.props.agent.id);
  }

  saveAgent(agentProps) {
    debug('Update agentProps', agentProps);
    AgentActions.updateItem(agentProps);
  }

  onCancel() {
    React.findDOMNode(this.refs.agentDetailsForm).reset();
  }

  render() {
    debug('Render');
    this.handleErrorState();
    if (AgentStore.isLoading()) {
      this.handlePendingState();
      return null;
    }
    this.handleRenderState();

    let agent = merge({
      realPhoneNumberType: 'mobile'
    }, this.props.agent || {});
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
      <Row>
        <form name='agentDetails' ref='agentDetailsForm' method='POST'>
          <Col md={10} sm={10}>
            <Panel header='Common'>
              <Input
                type='text'
                ref='firstname'
                label='First name'
                placeholder='First name'
                defaultValue={agent.firstname}
                onChange={this.onFormChange.bind(this)}
                required
              />
              <Input
                type='text'
                ref='lastname'
                label='Last name'
                placeholder='Last name'
                defaultValue={agent.lastname}
                onChange={this.onFormChange.bind(this)}
                required
              />
              <Input
                type='email'
                ref='email'
                label='Email'
                placeholder='firstname.lastname@company.co.uk'
                defaultValue={agent.email}
                onChange={this.onFormChange.bind(this)}
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
                      defaultValue={location.address.country}
                      onChange={this.onFormChange.bind(this)}>
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
                      defaultValue={agent.realPhoneNumberType}
                      onChange={this.onFormChange.bind(this)}>
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
                      onChange={this.onFormChange.bind(this)}
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
                      onChange={this.onFormChange.bind(this)}
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
                  <ImageList images={this.state.images} onRemove={this.onRemoveImageClicked} onChange={this.onFormChange} max={1} />
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
                  <Link to='agentDelete' params={{id: this.props.agent.id}} className='btn btn-danger pull-right'>
                    Delete
                  </Link>
                </Col>
              </Row>
            </Well>
          </Col>
        </form>
      </Row>
    );
  }
}
