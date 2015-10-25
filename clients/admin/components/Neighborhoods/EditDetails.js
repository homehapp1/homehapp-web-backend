import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import InputWidget from '../Widgets/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import CityListStore from '../../stores/CityListStore';
import NeighborhoodStore from '../../stores/NeighborhoodStore';
import NeighborhoodActions from '../../actions/NeighborhoodActions';
import ApplicationStore from '../../../common/stores/ApplicationStore';
import UploadArea from '../../../common/components/UploadArea';
import UploadAreaUtils from '../../../common/components/UploadArea/utils';
import { randomNumericId } from '../../../common/Helpers';
import ImageList from '../Widgets/ImageList';
import EditDetails from '../Shared/EditDetails';
import PlacePicker from '../../../common/components/Widgets/PlacePicker';

let debug = require('../../../common/debugger')('NeighborhoodsEditDetails');
// const countries = require('../../../common/lib/Countries').forSelect();

class NeighborhoodsEditDetails extends EditDetails {
  static propTypes = {
    neighborhood: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onNeighborhoodStoreChange.bind(this);
    this.uploadListener = this.onUploadChange.bind(this);
    this.cityListener = this.onCityStoreChange.bind(this);
    this.imageUploaderInstanceId = randomNumericId();
    this.state.images = props.neighborhood.images;
    this.onRemoveImageClicked = this.onRemoveImageClicked.bind(this);
    this.setCoordinates = this.setCoordinates.bind(this);
  }

  state = {
    model: null,
    error: null,
    cities: null,
    uploads: UploadAreaUtils.UploadStore.getState().uploads,
    currentAttributes: this.props.neighborhood.attributes,
    images: []
  }

  componentDidMount() {
    NeighborhoodStore.listen(this.storeListener);
    CityListStore.listen(this.cityListener);

    setTimeout(() => {
      CityListStore.fetchItems();
    }, 100);
  }

  componentWillUnmount() {
    NeighborhoodStore.unlisten(this.storeListener);
    CityListStore.unlisten(this.cityListener);
  }

  onNeighborhoodStoreChange(state) {
    debug('onNeighborhoodStoreChange', state);
    this.setState(state);
  }

  onCityStoreChange(state) {
    debug('onCityStoreChange', state);
    this.setState({
      cities: state.items || state.cities
    });
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
    //this.props.neighborhood.facilities = this.refs.facilities.getValue().split("\n");
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

    let neighborhoodProps = {
      uuid: this.props.neighborhood.id,
      slug: this.refs.slug.getValue(),
      title: this.refs.title.getValue(),
      description: this.refs.description.getValue(),
      location: {
        coordinates: this.refs.coordinates.getValue(),
        city: this.refs.locationCity.getValue() || null
      },
      images: images
    };

    console.log('neighborhoodProps', neighborhoodProps);
    NeighborhoodActions.updateItem(neighborhoodProps);
  }

  onCancel() {
    React.findDOMNode(this.refs.neighborhoodDetailsForm).reset();
  }

  getPreviewLink(neighborhood) {
    if (!neighborhood || typeof neighborhood.location.city !== 'object') {
      return null;
    }
    return (
      <a href={`${ApplicationStore.getState().config.siteHost}/neighborhoods/${neighborhood.location.city.slug}/${this.props.neighborhood.slug}/story`}
        target='_blank'
        className='btn btn-primary'>
        Preview
      </a>
    );
  }

  render() {
    this.handleErrorState();
    if (NeighborhoodStore.isLoading()) {
      this.handlePendingState();
      return null;
    }
    this.handleRenderState();
    let neighborhood = this.state.model || this.props.neighborhood;

    let lat = null;
    let lng = null;

    if (this.state.lat && this.state.lng) {
      lat = this.state.lat;
      lng = this.state.lng;
    } else if (neighborhood.location.coordinates.length) {
      lat = neighborhood.location.coordinates[0];
      lng = neighborhood.location.coordinates[1];
    }
    debug('lat', lat, 'lng', lng);

    let updateCoords = (lat, lng) => {
      this.setState({
        lat: lat,
        lng: lng
      });
    };

    let cities = [];
    if (neighborhood.location.city) {
      cities.push(neighborhood.location.city);
    }
    if (Array.isArray(this.state.cities)) {
      this.state.cities.map((city) => {
        cities.push(city);
      });
    }

    return (
      <Row>
        <form name='neighborhoodDetails' ref='neighborhoodDetailsForm' method='POST'>
          <Col md={10} sm={10}>
            <Panel header='Common'>
              <InputWidget
                type='text'
                ref='title'
                label='Title'
                placeholder='Title (optional)'
                defaultValue={neighborhood.title}
                onChange={this.onFormChange.bind(this)}
              />
              <InputWidget
                type='text'
                ref='slug'
                label='Slug'
                placeholder='Slug'
                readOnly
                defaultValue={neighborhood.slug}
              />
              <InputWidget
                type='textarea'
                ref='description'
                label='Description'
                placeholder='Write description'
                defaultValue={neighborhood.description}
                onChange={this.onFormChange.bind(this)}
              />
            </Panel>
            <Panel header='Location'>
              <InputWidget
                type='select'
                ref='locationCity'
                label='City'
                onChange={this.onFormChange.bind(this)}
              >
                {
                  cities.map((city, i) => {
                    let props = {
                      value: city.id
                    };
                    if (neighborhood.location.city && neighborhood.location.city.id === city.id) {
                      props.selected = true;
                    }

                    return (
                      <option {...props} key={`city-${i}`}>{city.title}</option>
                    );
                  })
                }
              </InputWidget>
              <PlacePicker lat={lat} lng={lng} ref='coordinates' onChange={updateCoords} />
              <InputWidget
                label='Coordinates'
                help='Coordinates for the neighborhood' wrapperClassName='wrapper'>
                <Row>
                  <Col xs={6}>
                    <InputWidget
                      type='text'
                      ref='locationLatitude'
                      readOnly
                      addonBefore='Latitude:'
                      value={lat}
                    />
                  </Col>
                  <Col xs={6}>
                    <InputWidget
                      type='text'
                      ref='locationLongitude'
                      readOnly
                      addonBefore='Longitude:'
                      value={lng}
                    />
                  </Col>
                </Row>
              </InputWidget>
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
                    signatureFolder='neighborhoodImage'
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
                  {this.getPreviewLink(neighborhood)}
                </Col>
              </Row>
            </Well>
          </Col>
        </form>
      </Row>
    );
  }
}

export default NeighborhoodsEditDetails;
