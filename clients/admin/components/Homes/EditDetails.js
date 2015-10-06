'use strict';

import React from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import HomeStore from '../../stores/HomeStore';
import HomeActions from '../../actions/HomeActions';
import UploadArea from '../../../common/components/UploadArea';
import UploadAreaUtils from '../../../common/components/UploadArea/utils';
import {randomNumericId, enumerate, merge} from '../../../common/Helpers';
import ImageList from '../Widgets/ImageList';
import NeighborhoodSelect from '../Widgets/NeighborhoodSelect';

import NeighborhoodListStore from '../../stores/NeighborhoodListStore';
import NeighborhoodListActions from '../../actions/NeighborhoodListActions';

let debug = require('../../../common/debugger')('HomesEditDetails');
const countries = require('../../../common/lib/Countries').forSelect();

export default class HomesEditDetails extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired,
    context: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.func
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onHomeStoreChange.bind(this);
    this.uploadListener = this.onUploadChange.bind(this);
    this.nhStoreListener = this.onNeighborhoodsChange.bind(this);
    this.imageUploaderInstanceId = randomNumericId();
    this.onRemoveImageClicked = this.onRemoveImageClicked.bind(this);

    if (props.home) {
      this.state.currentAttributes = props.home.attributes || [
        {
          name: '', value: '', valueType: 'string'
        }
      ];
      this.state.homeImages = props.home.images || [];
    }

    debug('Constructor', this);
  }

  state = {
    error: null,
    uploads: UploadAreaUtils.UploadStore.getState().uploads,
    currentAttributes: [],
    homeImages: [],
    neighborhoods: NeighborhoodListStore.getState().neighborhoods
  }

  componentDidMount() {
    HomeStore.listen(this.storeListener);
    NeighborhoodListStore.listen(this.nhStoreListener);
    if (!NeighborhoodListStore.getState().neighborhoods.length) {
      NeighborhoodListStore.fetchNeighborhoods();
      //NeighborhoodListActions.fetchNeighborhoods();
    }
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.storeListener);
  }

  componentWillReceiveProps(props) {
    debug('componentWillReceiveProps', props);
    if (props.home) {
      this.setState({
        currentAttributes: props.home.attributes || {},
        homeImages: props.home.images || []
      });
    }
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

  onNeighborhoodsChange(state) {
    this.setState({
      neighborhoods: NeighborhoodListStore.getState().neighborhoods
    });
  }

  onFormChange(/*event*/) {
    // let {type, target} = event;
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

    let id = null;
    if (this.props.home) {
      id = this.props.home.id;
    }

    let homeProps = {
      id: id,
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
        neighborhood: this.refs.addressNeighborhood.getValue(),
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

    this.saveHome(homeProps);
  }

  saveHome(homeProps) {
    debug('saveHome', homeProps);
    if (homeProps.id) {
      return HomeActions.updateItem(homeProps);
    }
    return HomeActions.createItem(homeProps);
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
          debug(key, 'data:', imageData);
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
    if (!newAttributes.length) {
      newAttributes.push({
        name: '', value: '', valueType: 'string'
      });
    }
    this.setState({currentAttributes: newAttributes});
  }

  onAddAttributeClicked(/*event*/) {
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
          onClick={() => this.onRemoveAttributeClicked(index)}>
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
            onClick={() => this.onRemoveAttributeClicked(index)}>
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
    debug('render', this.state);
    let error = null;
    let savingLoader = null;
    if (this.state.error) {
      error = this.handleErrorState();
    }
    if (HomeStore.isLoading()) {
      savingLoader = this.handlePendingState();
    }

    let home = merge({
      costs: {},
      amenities: [],
      facilities: []
    }, this.props.home || {});
    let homeLocation = merge({
      address: {
        street: null,
        apartment: null,
        zipcode: null,
        city: null,
        country: 'GB'
      },
      coordinates: [],
      neighborhood: null
    }, home.location || {});

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
    if (home && homeLocation.coordinates.length) {
      lat = homeLocation.coordinates[0];
      lon = homeLocation.coordinates[1];
    }
    //debug('Neighborhood of this home', this.props.homeLocation.neighborhood);

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
                defaultValue={home.title}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='textarea'
                ref='description'
                label='Description'
                placeholder='Write description'
                defaultValue={home.description}
                onChange={this.onFormChange.bind(this)}
                required
              />
            </Panel>
            <Panel header='Location'>
              <Input
                type='text'
                ref='addressStreet'
                label='Street Address'
                placeholder='ie. Kauppakartanonkuja 3 B'
                defaultValue={homeLocation.address.street}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                ref='addressApartment'
                label='Apartment'
                placeholder='ie. 22'
                defaultValue={homeLocation.address.apartment}
                onChange={this.onFormChange.bind(this)}
              />
              <NeighborhoodSelect
                ref='addressNeighborhood'
                selected={homeLocation.neighborhood}
                neighborhoods={this.state.neighborhoods}
              />
              <Input
                type='text'
                ref='addressCity'
                label='City'
                placeholder='ie. Helsinki'
                defaultValue={homeLocation.address.city}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                ref='addressZipcode'
                label='Zipcode'
                placeholder=''
                defaultValue={homeLocation.address.zipcode}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='select'
                ref='addressCountry'
                label='Country'
                placeholder='Select Country'
                defaultValue={homeLocation.address.country}
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
                defaultValue={home.costs.currency}
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
                defaultValue={home.costs.deptFreePrice}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                ref='costsSellingPrice'
                label='Selling Price'
                placeholder='(optional)'
                defaultValue={home.costs.sellingPrice}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                ref='costsSquarePrice'
                label='Square meter Price'
                placeholder='(optional)'
                defaultValue={home.costs.squarePrice}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                ref='costsReTaxPerYear'
                label='Real estate Tax (per year)'
                placeholder='(optional)'
                defaultValue={home.costs.realEstateTaxPerYear}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                ref='costsEcPerMonth'
                label='Electrict Charge (per month)'
                placeholder='(optional)'
                defaultValue={home.costs.electricChargePerMonth}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                ref='costsWcPerMonth'
                label='Water charge (per month)'
                placeholder='(optional)'
                defaultValue={home.costs.waterChargePerMonth}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='select'
                ref='costsWcPerType'
                label='Water charge type'
                placeholder='Water charge type'
                defaultValue={home.costs.waterChargePerType}
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
                defaultValue={home.amenities.join(`\n`)}
                onChange={this.onFormChange.bind(this)}
              />
            </Panel>
            <Panel header='Facilities'>
              <Input
                type='textarea'
                ref='facilities'
                label='Input Facilities (one per line)'
                placeholder='(optional)'
                defaultValue={home.facilities.join(`\n`)}
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
                  <Link to='homeDelete' params={{id: this.props.home.id}} className='pull-right btn btn-danger'>Delete</Link>
                </Col>
              </Row>
            </Well>
          </Col>
        </form>
      </Row>
    );
  }
}
