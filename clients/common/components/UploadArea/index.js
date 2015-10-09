'use strict';

import React from 'react';
import ExecutionEnvironment from 'react/lib/ExecutionEnvironment';
import request from '../../request';
import UploadAreaUtils from './utils';
import Helpers from '../../Helpers';
import ApplicationStore from '../../stores/ApplicationStore';

let debug = require('../../debugger')('UploadArea');

let Dropzone = null;
if (ExecutionEnvironment.canUseDOM) {
  Dropzone = require('../../../../assets/js/admin/dropzone.js');
}

class UploadArea extends React.Component {
  static propTypes = {
    dropzoneConfig: React.PropTypes.object,
    useCloudinary: React.PropTypes.bool,
    signatureFolder: React.PropTypes.string,
    signatureData: React.PropTypes.object,
    isVideo: React.PropTypes.bool,
    uploadUrl: React.PropTypes.string,
    uploadParams: React.PropTypes.object,
    width: React.PropTypes.string,
    height: React.PropTypes.string,
    className: React.PropTypes.string,
    maxFiles: React.PropTypes.number,
    onProgress: React.PropTypes.func,
    onUpload: React.PropTypes.func,
    acceptedMimes: React.PropTypes.string,
    instanceId: React.PropTypes.number,
    thumbnailWidth: React.PropTypes.number,
    thumbnailHeight: React.PropTypes.number,
    clickable: React.PropTypes.bool,
    children: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ])
  }

  static defaultProps = {
    className: 'uploadArea',
    instanceId: Helpers.randomNumericId(),
    thumbnailWidth: 80,
    thumbnailHeight: 80,
    useCloudinary: true,
    uploadUrl: null,
    uploadParams: {},
    clickable: true,
    isVideo: false
  }

  constructor(props) {
    let type = 'image';
    if (props.isVideo) {
      type = 'video';
    }

    let defaultUploadUrl = `${ApplicationStore.getState().config.cloudinary.apiUrl}/${type}/upload`;

    props.uploadUrl = props.uploadUrl || defaultUploadUrl;

    super(props);
    this.uploads = {};
    //this.state.signatureData = this.props.signatureData;
  }

  state = {
    //signatureData: null,
    uploading: false,
    uploads: {}
  }

  componentDidMount() {
    this._buildDropzone();
  }

  componentWillUnmount() {
    if (this.dropzone) {
      this.dropzone.destroy();
    }
    this.dropzone = null;
  }

  static fetchCloudinarySignature(folder) {
    debug('fetchCloudinarySignature', folder);
    let data = {
      folder: folder
    };
    let reqPath = ApplicationStore.getState().config.cloudinary.signatureRoute;
    return request.post(reqPath, data);
  }

  _fetchCloudinarySignature() {
    return UploadArea.fetchCloudinarySignature(this.props.signatureFolder)
    .then((result) => {
      this.setState({
        signatureData: result.data.signed
      });

      let params = Helpers.merge(this.dropzone.options.params, result.data.signed);
      this.dropzone.options.params = params;
    });
  }

  _buildDropzone() {
    let params = this.props.uploadParams || {};
    if (this.props.useCloudinary && this.props.isVideo) {
      params[`resource_type`] = 'video';
    }

    let dropzoneConfig = {
      url: this.props.uploadUrl,
      previewsContainer: false,
      addRemoveLinks: false,
      maxFiles: this.props.maxFiles,
      acceptedMimeTypes: this.props.acceptedMimes,
      params: params,
      clickable: this.props.clickable,
      accept: (file, done) => {
        file.id = Helpers.randomNumericId();
        UploadAreaUtils.UploadActions.updateUpload({
          instanceId: this.props.instanceId,
          id: file.id,
          data: file
        });
        this.uploads[file.id] = {
          name: file.name,
          progress: 0
        };

        this.setState({
          uploading: true,
          uploads: this.uploads
        });

        if (this.props.useCloudinary && !this.state.signatureData) {
          this._fetchCloudinarySignature().then(() => {
            done();
          }).catch(done);
        } else {
          done();
        }
      }
    };

    if (this.props.dropzoneConfig) {
      dropzoneConfig = Helpers.merge(dropzoneConfig, this.props.dropzoneConfig);
    }

    this.dropzone = new Dropzone(
      this.refs.uploader.getDOMNode(), dropzoneConfig
    );

    this.dropzone.on('thumbnail', (file, dataUrl) => {
      debug('dropzone.thumbnail', file, dataUrl);
      UploadAreaUtils.UploadActions.updateUpload({
        instanceId: this.props.instanceId,
        id: file.id,
        data: {
          thumbnail: dataUrl
        }
      });
    });

    this.dropzone.on('uploadprogress', (file, progress) => {
      debug('dropzone.uploadprogress', file, progress);
      debug('this.uploads', this.uploads);
      this.uploads[file.id].progress = progress;
      this.setState({
        uploading: true,
        uploads: this.uploads
      });
      if (this.props.onProgress) {
        this.props.onProgress(file, progress);
      }
    });

    this.dropzone.on('success', (file, response) => {
      debug('dropzone.success', file, response);
      let fileData = response;

      if (this.props.useCloudinary) {
        fileData.url = response[`secure_url`];
        if (this.props.isVideo) {
          let projectId = ApplicationStore.getState().config.cloudinary.projectId;
          let publicId = response[`public_id`];
          let thumbnailUrl = `//res.cloudinary.com/${projectId}/video/upload/${publicId}.jpg`;
          fileData.thumbnail = thumbnailUrl;
        }
      }

      UploadAreaUtils.UploadActions.updateUpload({
        instanceId: this.props.instanceId,
        id: file.id,
        data: fileData
      });
      this.props.onUpload(file, response);

      this.setState({
        uploading: false,
        uploads: this.uploads
      });
    });
  }

  render() {
    let className = this.props.className;
    let loader = (
      <div className='upload-area-progress-container'>
        {
          Object.keys(this.state.uploads).map((id, index) => {
            let file = this.state.uploads[id];
            let progress = `${Math.round(file.progress)}%`;
            let classes = ['upload'];

            if (Math.round(file.progress) >= 100) {
              classes.push('finished');
            }

            return (
              <div className={classes.join(' ')} key={`uploadArea${index}`}>
                <div className='bar-container clearfix'>
                  <div className='bar' style={{width: progress}}></div>
                  <div className='percentage'>{progress}</div>
                </div>
                <div className='filename'>{file.name}</div>
              </div>
            );
          })
        }
      </div>
    );

    return (
      <div
        className={className}
        ref='uploader'
        style={{ width: this.props.width, height: this.props.height }}>
        <div className='dz-message'>
          {this.props.children}
          {loader}
        </div>
      </div>
    );
  }
}

export default UploadArea;
