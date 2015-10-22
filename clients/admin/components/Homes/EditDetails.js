import React from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import InputWidget from '../Widgets/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import HomeStore from '../../stores/HomeStore';
import HomeActions from '../../actions/HomeActions';
import UploadArea from '../../../common/components/UploadArea';
import UploadAreaUtils from '../../../common/components/UploadArea/utils';
import { randomNumericId, merge, createNotification } from '../../../common/Helpers';
import ImageList from '../Widgets/ImageList';
import NeighborhoodSelect from '../Widgets/NeighborhoodSelect';
import ApplicationStore from '../../../common/stores/ApplicationStore';
import EditDetails from '../Shared/EditDetails';
import PlacePicker from '../../../common/components/Widgets/PlacePicker';

let debug = require('../../../common/debugger')('HomesEditDetails');

export default class HomesEditDetails extends EditDetails {
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
    this.imageUploaderInstanceId = randomNumericId();
    this.onRemoveImageClicked = this.onRemoveImageClicked.bind(this);
    this.setCoordinates = this.setCoordinates.bind(this);

    if (props.home) {
      this.setInitialLocation(props.home.location);

      this.state.currentAttributes = props.home.attributes || [
        {
          name: '', value: '', valueType: 'string'
        }
      ];
      this.state.images = props.home.images || [];
    }
  }

  state = {
    error: null,
    uploads: UploadAreaUtils.UploadStore.getState().uploads,
    home: null,
    currentAttributes: [],
    images: [],
    coordinates: [],
    lat: null,
    lng: null
  }

  componentDidMount() {
    HomeStore.listen(this.storeListener);
  }

  componentWillReceiveProps(props) {
    debug('componentWillReceiveProps', props);
    if (props.home) {
      this.setState({
        currentAttributes: props.home.attributes || {},
        images: props.home.images || []
      });
    }
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.storeListener);
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

  onFormChange(/*event*/) {
    // let {type, target} = event;
    // TODO: Validation could be done here
    //debug('onFormChange', event, type, target);
    //this.props.home.facilities = this.refs.facilities.getValue().split("\n");
  }

  onSave() {
    debug('save', this.refs);

    for (let key in this.refs) {
      let ref = this.refs[key];
      if (typeof ref.isValid !== 'function') {
        continue;
      }

      if (!ref.isValid()) {
        debug('Validation failed', ref);
        let label = ref.props.label || 'Validation error';
        let message = ref.message || 'Field failed the validation';

        createNotification({
          type: 'danger',
          duration: 10,
          label: label,
          message: message
        });
        return false;
      }
    }

    let images = [];
    // Clean broken images
    this.state.images.forEach((image) => {
      if (image.url) {
        images.push(image);
      }
    });

    let id = null;
    if (this.props.home) {
      id = this.props.home.id;
    }

    debug('Coordinates', this.getCoordinates());

    let homeProps = {
      id: id,
      title: this.refs.title.getValue(),
      announcementType: this.refs.announcementType.getValue(),
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
        coordinates: this.getCoordinates()
      },
      costs: {
        currency: this.refs.costsCurrency.getValue(),
        sellingPrice: Number(this.refs.costsSellingPrice.getValue()),
        councilTax: Number(this.refs.costsCouncilTax.getValue())
      },
      details: {
        area: Number(this.refs.detailsArea.getValue())
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
          <InputWidget
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
          </InputWidget>
        </Col>
        <Col md={4}>
          <InputWidget
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

  render() {
    this.handleErrorState();
    if (HomeStore.isLoading()) {
      this.handlePendingState();
      return null;
    }
    this.handleRenderState();
    let home = merge({
      costs: {
        currency: 'GBP'
      },
      details: {
        area: null
      },
      amenities: [],
      facilities: []
    }, this.state.home || this.props.home || {});
    let homeLocation = merge({
      address: {
        street: null,
        apartment: null,
        zipcode: null,
        city: null,
        country: 'GB'
      },
      coordinates: [this.state.lat, this.state.lng],
      neighborhood: null
    }, home.location || {});

    if (this.props.home) {
      home.title = this.props.home.homeTitle;
    }

    if (this.state.home) {
      home.title = this.state.home.homeTitle;
    }

    let countrySelections = this.getCountryOptions();

    let lat = this.state.lat || 0;
    let lng = this.state.lng || 0;
    debug('lat', lat, 'lng', lng);

    let deleteLink = null;
    let previewLink = null;
    if (this.props.home) {
      deleteLink = (<Link to='homeDelete' params={{id: this.props.home.id}} className='pull-right btn btn-danger btn-preview'>Delete</Link>);
      previewLink = (
        <a href={`${ApplicationStore.getState().config.siteHost}/homes/${this.props.home.slug}`}
          target='_blank'
          className='btn btn-primary'>
          Preview
        </a>
      );
    }
    debug('Render', home);
    //debug('Neighborhood of this home', this.props.homeLocation.neighborhood);

    return (
      <Row>
        <form name='homeDetails' ref='homeDetailsForm' method='POST'>
          <Col md={10} sm={10}>
            <Panel header='Common'>
              <InputWidget
                type='text'
                ref='title'
                label='Title'
                placeholder='Title (optional)'
                defaultValue={home.title}
                onChange={this.onFormChange.bind(this)}
              />
              {this.getSlug(home)}
              <InputWidget
                type='select'
                ref='announcementType'
                label='Announcement type'
                defaultValue='buy'
                value={home.announcementType}
                onChange={this.onFormChange.bind(this)}
              >
                <option value='buy'>This home is for sale</option>
                <option value='rent'>This home is for rent</option>
              </InputWidget>
              <InputWidget
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
              <InputWidget
                type='text'
                ref='addressStreet'
                label='Street Address'
                placeholder='ie. Kauppakartanonkuja 3 B'
                defaultValue={homeLocation.address.street}
                onChange={this.onFormChange.bind(this)}
              />
              <InputWidget
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
              />
              <InputWidget
                type='text'
                ref='addressCity'
                label='City'
                placeholder='ie. Helsinki'
                defaultValue={homeLocation.address.city}
                onChange={this.onFormChange.bind(this)}
              />
              <InputWidget
                type='text'
                ref='addressZipcode'
                label='Post code'
                placeholder=''
                defaultValue={homeLocation.address.zipcode}
                onChange={this.onFormChange.bind(this)}
              />
              <InputWidget
                type='select'
                ref='addressCountry'
                label='Country'
                placeholder='Select Country'
                defaultValue={homeLocation.address.country}
                onChange={this.onFormChange.bind(this)}>
                <option value=''>Select country</option>
                {countrySelections}
              </InputWidget>

              <PlacePicker lat={this.state.lat} lng={this.state.lng} onChange={this.setCoordinates} />

              <InputWidget
                label='Coordinates'
                help='Optional coordinates for the home' wrapperClassName='wrapper'>
                <Row>
                  <Col xs={6}>
                    <InputWidget
                      type='text'
                      ref='locationLatitude'
                      addonBefore='Latitude:'
                      value={this.state.lat}
                      readOnly
                    />
                  </Col>
                  <Col xs={6}>
                    <InputWidget
                      type='text'
                      ref='locationLongitude'
                      addonBefore='Longitude:'
                      value={this.state.lng}
                      readOnly
                    />
                  </Col>
                </Row>
              </InputWidget>
            </Panel>
            <Panel header='General specifications'>
              <InputWidget
                type='text'
                ref='detailsArea'
                label='Living area (square feet)'
                placeholder='1000'
                defaultValue={home.details.area}
                onChange={this.onFormChange.bind(this)}
                pattern='([0-9]*)(\.[0-9]+)?'
                patternError='Please enter a valid number (e.g. 123.45) without any units'
              />
            </Panel>
            <Panel header='Pricing information'>
              <InputWidget
                type='select'
                ref='costsCurrency'
                label='Used currency'
                placeholder='Select Applied Currency'
                defaultValue={home.costs.currency}
                onChange={this.onFormChange.bind(this)}>
                <option value='GBP'>British Pounds</option>
                <option value='EUR'>Euro</option>
                <option value='SUD'>US Dollars</option>
              </InputWidget>
              <InputWidget
                type='text'
                ref='costsSellingPrice'
                label='Selling price'
                placeholder='(optional)'
                defaultValue={home.costs.sellingPrice}
                onChange={this.onFormChange.bind(this)}
                pattern='([0-9]*)(\.[0-9]+)?'
                patternError='Please enter a valid number (e.g. 123.45) without any units'
              />
              <InputWidget
                type='text'
                ref='costsCouncilTax'
                label='Council tax'
                placeholder='(optional)'
                defaultValue={home.costs.councilTax}
                onChange={this.onFormChange.bind(this)}
                pattern='([0-9]*)(\.[0-9]+)?'
                patternError='Please enter a valid number (e.g. 123.45) without any units'
              />
            </Panel>
            <Panel header='Amenities'>
              <InputWidget
                type='textarea'
                ref='amenities'
                label='Input Amenities (one per line)'
                placeholder='(optional)'
                defaultValue={home.amenities.join(`\n`)}
                onChange={this.onFormChange.bind(this)}
              />
            </Panel>
            <Panel header='Facilities'>
              <InputWidget
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
                  <h2>Images</h2>
                  <ImageList images={this.state.images} onRemove={this.onRemoveImageClicked} onChange={this.onFormChange} />
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
                  {previewLink}
                </Col>
                <Col md={6} pullRight>
                  {deleteLink}
                </Col>
              </Row>
            </Well>
          </Col>
        </form>
      </Row>
    );
  }
}
