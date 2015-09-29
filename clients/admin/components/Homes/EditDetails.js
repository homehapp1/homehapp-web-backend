'use strict';

import React from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Table from 'react-bootstrap/lib/Table';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import HomeStore from '../../stores/HomeStore';
import HomeActions from '../../actions/HomeActions';
import ApplicationStore from '../../../common/stores/ApplicationStore';
import UploadArea from '../../../common/components/UploadArea';
import UploadAreaUtils from '../../../common/components/UploadArea/utils';
import {randomNumericId, enumerate} from '../../../common/Helpers';
import ImageList from '../Widgets/ImageList';

let debug = require('../../../common/debugger')('HomesEditDetails');
const countries = require('../../../common/lib/Countries').forSelect();

class HomesEditDetails extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onHomeStoreChange.bind(this);
    this.uploadListener = this.onUploadChange.bind(this);
    this.imageUploaderInstanceId = randomNumericId();
    this.state.homeImages = props.home.images;
    this.onRemoveImageClicked = this.onRemoveImageClicked.bind(this);
  }

  componentDidMount() {
    HomeStore.listen(this.storeListener);
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.storeListener);
  }

  state = {
    error: null,
    uploads: UploadAreaUtils.UploadStore.getState().uploads,
    currentAttributes: this.props.home.attributes,
    homeImages: []
  }

  onHomeStoreChange(state) {
    debug('onHomeStoreChange', state);
    this.setState(state);
  }

  onUploadChange(state) {
    debug('onUploadChange', state);
    this.setState({
      uploads: UploadAreaUtils.UploadStore.getState().uploads
    });
  }

  onFormChange(event) {
    let {type, target} = event;
    // TODO: Validation could be done here
    //debug('onFormChange', event, type, target);
    //this.props.home.facilities = this.refs.facilities.getValue().split("\n");
  }

  onSave() {
    debug('save');

    let images = [];
    // Clean broken images
    this.state.homeImages.forEach((image) => {
      if (image.url) {
        images.push(image);
      }
    });

    let homeProps = {
      uuid: this.props.home.id,
      title: this.refs.title.getValue(),
      description: this.refs.description.getValue(),
      location: {
        address: {
          street: this.refs.addressStreet.getValue(),
          apartment: this.refs.addressApartment.getValue(),
          city: this.refs.addressCity.getValue(),
          zipcode: this.refs.addressZipcode.getValue(),
          country: this.refs.addressCountry.getValue()
        },
        coordinates: [
          this.refs.locationLatitude.getValue(),
          this.refs.locationLongitude.getValue()
        ]
      },
      costs: {
        currency: this.refs.costsCurrency.getValue(),
        deptFreePrice: this.refs.costsDeptFreePrice.getValue(),
        sellingPrice: this.refs.costsSellingPrice.getValue(),
        squarePrice: this.refs.costsSquarePrice.getValue(),
        realEstateTaxPerYear: this.refs.costsReTaxPerYear.getValue(),
        electricChargePerMonth: this.refs.costsEcPerMonth.getValue(),
        waterChargePerMonth: this.refs.costsWcPerMonth.getValue(),
        waterChargePerType: this.refs.costsWcPerType.getValue()
      },
      amenities: this.refs.amenities.getValue().split('\n'),
      facilities: this.refs.facilities.getValue().split('\n'),
      attributes: this.state.currentAttributes,
      images: images
    };

    console.log('homeProps', homeProps);
    HomeActions.updateItem(homeProps);
  }

  onCancel() {
    React.findDOMNode(this.refs.homeDetailsForm).reset();
  }

  onImageUpload(data) {
    debug('onImageUpload', data);

    let imageExists = (url) => {
      let found = false;
      this.state.homeImages.forEach((img) => {
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
          console.log(key, 'data:', imageData);
          let isMaster = false;
          let homeImage = {
            url: imageData.url,
            width: imageData.width,
            height: imageData.height,
            // TODO: Remove me when backend supports it
            aspectRatio: (imageData.width / imageData.height),
            isMaster: isMaster
          };

          if (!imageExists(homeImage.url)) {
            this.state.homeImages.push(homeImage);
          }
        }
      }
    }

    this.setState({
      homeImages: this.state.homeImages
    });
  }

  onRemoveImageClicked(index) {
    let newImages = [];
    this.state.homeImages.forEach((item, idx) => {
      if (idx !== index) {
        newImages.push(item);
      }
    });
    this.setState({homeImages: newImages});
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

  onAddAttributeClicked(event) {
    this.state.currentAttributes.push({
      name: '', value: '', valueType: 'string'
    });
    this.setState({currentAttributes: this.state.currentAttributes});
  }

  onAttributeValueChanged(event, index, field) {
    let newAttributes = this.state.currentAttributes;
    if (!newAttributes[index]) {
      newAttributes[index] = {
        name: '', value: '', valueType: 'string'
      };
    }
    newAttributes[index][field] = event.currentTarget.value;
    this.setState({
      currentAttributes: newAttributes
    });
  }

  renderAttributeRow(index, attr, isLast) {
    let actions = (
      <Col md={2}>
        <Button
          bsStyle='danger'
          bsSize='small'
          onClick={(event) => this.onRemoveAttributeClicked(index)}>
          -
        </Button>
      </Col>
    );
    if (isLast) {
      actions = (
        <Col md={2}>
          <Button
            bsStyle='danger'
            bsSize='small'
            onClick={(event) => this.onRemoveAttributeClicked(index)}>
            -
          </Button>
          <Button
            bsStyle='success'
            bsSize='small'
            ref='addAttributeButton'
            onClick={this.onAddAttributeClicked.bind(this)}>
            +
          </Button>
        </Col>
      );
    }
    return (
      <Row key={'attribute-' + index + '-' + attr.name}>
        <Col md={4}>
          <Input
            type='select'
            addonBefore='Name'
            placeholder='Select Attribute'
            name={'attributes[' + index + '][name]'}
            defaultValue={attr.name}
            onChange={(event) => this.onAttributeValueChanged(event, index, 'name')}
          >
            <option value=''>Select Attribute</option>
            <option value='floor'>Floor</option>
            <option value='rooms'>Rooms</option>
            <option value='elevator'>Elevator</option>
          </Input>
        </Col>
        <Col md={4}>
          <Input
            type='text'
            addonBefore='Value'
            name={'attributes[' + index + '][value]'}
            defaultValue={attr.value}
            onChange={(event) => this.onAttributeValueChanged(event, index, 'value')}
          />
        </Col>
        {actions}
      </Row>
    );
  }

  handlePendingState() {
    return (
      <div className='home-saving'>
        <h3>Saving home...</h3>
      </div>
    );
  }

  handleErrorState() {
    return (
      <div className='home-error'>
        <h3>Error updating home!</h3>
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
    if (HomeStore.isLoading()) {
      savingLoader = this.handlePendingState();
    }

    let countrySelections = countries.map((country) => {
      return (
        <option
          value={country.value}
          key={'locCountry-' + country.value}>
          {country.label}
        </option>
      );
    });

    let lat, lon = '';
    if (this.props.home.location.coordinates.length) {
      lat = this.props.home.location.coordinates[0];
      lon = this.props.home.location.coordinates[1];
    }

    return (
      <Row>
        {error}
        {savingLoader}
        <form name='homeDetails' ref='homeDetailsForm' method='POST'>
          <Col md={10} sm={10}>
            <Panel header='Common'>
              <Input
                type='text'
                ref='title'
                label='Title'
                placeholder='Title (optional)'
                defaultValue={this.props.home.title}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='textarea'
                ref='description'
                label='Description'
                placeholder='Write description'
                defaultValue={this.props.home.description}
                onChange={this.onFormChange.bind(this)}
              />
            </Panel>
            <Panel header='Location'>
              <Input
                type='text'
                ref='addressStreet'
                label='Street Address'
                placeholder='ie. Kauppakartanonkuja 3 B'
                defaultValue={this.props.home.location.address.street}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                ref='addressApartment'
                label='Apartment'
                placeholder='ie. 22'
                defaultValue={this.props.home.location.address.apartment}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                ref='addressCity'
                label='City'
                placeholder='ie. Helsinki'
                defaultValue={this.props.home.location.address.city}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                ref='addressZipcode'
                label='Zipcode'
                placeholder=''
                defaultValue={this.props.home.location.address.zipcode}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='select'
                ref='addressCountry'
                label='Country'
                placeholder='Select Country'
                defaultValue={this.props.home.location.address.country}
                onChange={this.onFormChange.bind(this)}>
                <option value=''>Select country</option>
                {countrySelections}
              </Input>

              <Input
                label='Coordinates'
                help='Optional coordinates for the home' wrapperClassName='wrapper'>
                <Row>
                  <Col xs={6}>
                    <Input
                      type='text'
                      ref='locationLatitude'
                      addonBefore='Latitude:'
                      defaultValue={lat}
                    />
                  </Col>
                  <Col xs={6}>
                    <Input
                      type='text'
                      ref='locationLongitude'
                      addonBefore='Longitude:'
                      defaultValue={lon}
                    />
                  </Col>
                </Row>
              </Input>
            </Panel>
            <Panel header='Costs'>
              <Input
                type='select'
                ref='costsCurrency'
                label='Currency'
                placeholder='Select Applied Currency'
                defaultValue={this.props.home.costs.currency}
                onChange={this.onFormChange.bind(this)}>
                <option value='EUR'>Euro</option>
                <option value='GBP'>British Pounds</option>
                <option value='SUD'>US Dollars</option>
              </Input>
              <Input
                type='text'
                ref='costsDeptFreePrice'
                label='Dept Free Price'
                placeholder='(optional)'
                defaultValue={this.props.home.costs.deptFreePrice}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                ref='costsSellingPrice'
                label='Selling Price'
                placeholder='(optional)'
                defaultValue={this.props.home.costs.sellingPrice}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                ref='costsSquarePrice'
                label='Square meter Price'
                placeholder='(optional)'
                defaultValue={this.props.home.costs.squarePrice}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                ref='costsReTaxPerYear'
                label='Real estate Tax (per year)'
                placeholder='(optional)'
                defaultValue={this.props.home.costs.realEstateTaxPerYear}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                ref='costsEcPerMonth'
                label='Electrict Charge (per month)'
                placeholder='(optional)'
                defaultValue={this.props.home.costs.electricChargePerMonth}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                ref='costsWcPerMonth'
                label='Water charge (per month)'
                placeholder='(optional)'
                defaultValue={this.props.home.costs.waterChargePerMonth}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='select'
                ref='costsWcPerType'
                label='Water charge type'
                placeholder='Water charge type'
                defaultValue={this.props.home.costs.waterChargePerType}
                onChange={this.onFormChange.bind(this)}>
                <option value='person'>Per Person</option>
                <option value='household'>Per Household</option>
              </Input>
            </Panel>
            <Panel header='Amenities'>
              <Input
                type='textarea'
                ref='amenities'
                label='Input Amenities (one per line)'
                placeholder='(optional)'
                defaultValue={this.props.home.amenities.join(`\n`)}
                onChange={this.onFormChange.bind(this)}
              />
            </Panel>
            <Panel header='Facilities'>
              <Input
                type='textarea'
                ref='facilities'
                label='Input Facilities (one per line)'
                placeholder='(optional)'
                defaultValue={this.props.home.facilities.join(`\n`)}
                onChange={this.onFormChange.bind(this)}
              />
            </Panel>
            <Panel header='Other Attributes'>
              {
                this.state.currentAttributes.map((attr, index) => {
                  let isLast = false;
                  if (index === this.state.currentAttributes.length - 1) {
                    isLast = true;
                  }
                  return this.renderAttributeRow(index, attr, isLast);
                })
              }
            </Panel>
            <Panel header='Images'>
              <Row>
                <Col md={6}>
                  <h2>Current images</h2>
                  <ImageList images={this.state.homeImages} onRemove={this.onRemoveImageClicked} onChange={this.onFormChange} />
                </Col>
                <Col md={6}>
                  <UploadArea
                    className='uploadarea image-uploadarea'
                    signatureFolder='homeImage'
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

export default HomesEditDetails;
