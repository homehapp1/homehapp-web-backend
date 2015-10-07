'use strict';

import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import NeighborhoodStore from '../../stores/NeighborhoodStore';
import NeighborhoodActions from '../../actions/NeighborhoodActions';
import UploadArea from '../../../common/components/UploadArea';
import UploadAreaUtils from '../../../common/components/UploadArea/utils';
import {randomNumericId, enumerate} from '../../../common/Helpers';
import ImageList from '../Widgets/ImageList';
import Loading from '../../../common/components/Widgets/Loading';

let debug = require('../../../common/debugger')('NeighborhoodsEditDetails');
const countries = require('../../../common/lib/Countries').forSelect();

class NeighborhoodsEditDetails extends React.Component {
  static propTypes = {
    neighborhood: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onNeighborhoodStoreChange.bind(this);
    this.uploadListener = this.onUploadChange.bind(this);
    this.imageUploaderInstanceId = randomNumericId();
    this.state.neighborhoodImages = props.neighborhood.images;
    this.onRemoveImageClicked = this.onRemoveImageClicked.bind(this);
  }

  state = {
    error: null,
    uploads: UploadAreaUtils.UploadStore.getState().uploads,
    currentAttributes: this.props.neighborhood.attributes,
    neighborhoodImages: []
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
    this.state.neighborhoodImages.forEach((image) => {
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
        coordinates: [
          this.refs.locationLatitude.getValue(),
          this.refs.locationLongitude.getValue()
        ]
      },
      images: images
    };

    console.log('neighborhoodProps', neighborhoodProps);
    NeighborhoodActions.updateItem(neighborhoodProps);
  }

  onCancel() {
    React.findDOMNode(this.refs.neighborhoodDetailsForm).reset();
  }

  onImageUpload(data) {
    debug('onImageUpload', data);

    let imageExists = (url) => {
      let found = false;
      this.state.neighborhoodImages.forEach((img) => {
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
          let neighborhoodImage = {
            url: imageData.url,
            width: imageData.width,
            height: imageData.height,
            // TODO: Remove me when backend supports it
            aspectRatio: (imageData.width / imageData.height),
            isMaster: isMaster
          };

          if (!imageExists(neighborhoodImage.url)) {
            this.state.neighborhoodImages.push(neighborhoodImage);
          }
        }
      }
    }

    this.setState({
      neighborhoodImages: this.state.neighborhoodImages
    });
  }

  onRemoveImageClicked(index) {
    let newImages = [];
    this.state.neighborhoodImages.forEach((item, idx) => {
      if (idx !== index) {
        newImages.push(item);
      }
    });
    this.setState({neighborhoodImages: newImages});
  }

  handlePendingState() {
    return (
      <Loading>
        <h3>Saving neighborhood...</h3>
      </Loading>
    );
  }

  handleErrorState() {
    return (
      <div className='neighborhood-error'>
        <h3>Error updating neighborhood!</h3>
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
    if (NeighborhoodStore.isLoading()) {
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
    if (this.props.neighborhood.location.coordinates.length) {
      lat = this.props.neighborhood.location.coordinates[0];
      lon = this.props.neighborhood.location.coordinates[1];
    }

    return (
      <Row>
        {error}
        {savingLoader}
        <form name='neighborhoodDetails' ref='neighborhoodDetailsForm' method='POST'>
          <Col md={10} sm={10}>
            <Panel header='Common'>
              <Input
                type='text'
                ref='title'
                label='Title'
                placeholder='Title (optional)'
                defaultValue={this.props.neighborhood.title}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                ref='slug'
                label='Slug'
                placeholder='Slug'
                readOnly
                defaultValue={this.props.neighborhood.slug}
              />
              <Input
                type='textarea'
                ref='description'
                label='Description'
                placeholder='Write description'
                defaultValue={this.props.neighborhood.description}
                onChange={this.onFormChange.bind(this)}
              />
            </Panel>
            <Panel header='Location'>
              <Input
                label='Coordinates'
                help='Coordinates for the neighborhood' wrapperClassName='wrapper'>
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
            <Panel header='Images'>
              <Row>
                <Col md={6}>
                  <h2>Images</h2>
                  <ImageList images={this.state.neighborhoodImages} onRemove={this.onRemoveImageClicked} onChange={this.onFormChange} />
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

export default NeighborhoodsEditDetails;
