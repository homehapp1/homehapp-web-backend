import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import InputWidget from '../Widgets/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import NeighborhoodStore from '../../stores/NeighborhoodStore';
import NeighborhoodActions from '../../actions/NeighborhoodActions';
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
    this.imageUploaderInstanceId = randomNumericId();
    this.state.images = props.neighborhood.images;
    this.onRemoveImageClicked = this.onRemoveImageClicked.bind(this);
    this.setCoordinates = this.setCoordinates.bind(this);
  }

  state = {
    model: null,
    error: null,
    uploads: UploadAreaUtils.UploadStore.getState().uploads,
    currentAttributes: this.props.neighborhood.attributes,
    images: []
  }

  componentDidMount() {
    NeighborhoodStore.listen(this.storeListener);
  }

  componentWillUnmount() {
    NeighborhoodStore.unlisten(this.storeListener);
  }

  onNeighborhoodStoreChange(state) {
    debug('onNeighborhoodStoreChange', state);
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

    let lat = this.refs.locationLatitude.getValue();
    let lng = this.refs.locationLongitude.getValue();
    let coordinates = [];

    if (lat && lng) {
      coordinates = [lat, lng];
    }

    let neighborhoodProps = {
      uuid: this.props.neighborhood.id,
      slug: this.refs.slug.getValue(),
      title: this.refs.title.getValue(),
      description: this.refs.description.getValue(),
      location: {
        coordinates: coordinates
      },
      images: images
    };

    console.log('neighborhoodProps', neighborhoodProps);
    NeighborhoodActions.updateItem(neighborhoodProps);
  }

  onCancel() {
    React.findDOMNode(this.refs.neighborhoodDetailsForm).reset();
  }

  render() {
    this.handleErrorState();
    if (NeighborhoodStore.isLoading()) {
      this.handlePendingState();
      return null;
    }
    this.handleRenderState();

    let lat, lon = '';
    if (this.props.neighborhood.location.coordinates.length) {
      lat = this.props.neighborhood.location.coordinates[0];
      lon = this.props.neighborhood.location.coordinates[1];
    }

    let neighborhood = this.state.model || this.props.neighborhood;

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
              <PlacePicker lat={this.state.lat} lng={this.state.lng} onChange={this.setCoordinates} />
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
                      value={lon}
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
