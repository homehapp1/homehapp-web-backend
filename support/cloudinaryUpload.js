'use strict';

import path from 'path';
import cloudinary from 'cloudinary';
import Configuration from '../server/lib/Configuration';
import {merge, walkDirSync} from '../server/lib/Helpers';
let debug = require('debug')('ProjectUploader');

const PROJECT_ROOT = path.join(__dirname, '..');
const PROJECT_NAME = process.env.PROJECT_NAME || 'site';

class ProjectUploader {
  constructor() {
  }
  upload(sourceFolder, callback) {
    this.sourceFolder = path.resolve(sourceFolder);

    let status = null;

    this._configure()
    .then(() => this._uploadResouces('images'))
    .then(() => this._uploadResouces('fonts'))
    .then(() => this._uploadResouces('css'))
    .then(() => this._uploadResouces('js'))
    .then(() => {
      debug('Finished Uploading all assets');
      callback(null, status);
    })
    .catch((err) => {
      callback(err);
    });
  }

  _uploadResouces(resourceName) {
    debug(`Uploading ${resourceName} resources`);
    let tasks = [];

    let filesPath = path.join(this.sourceFolder, resourceName);
    let files = walkDirSync(filesPath);

    files.forEach((filePath) => {
      let baseName = path.basename(filePath);
      tasks.push(new Promise((resolve, reject) => {
        let publicId = `${PROJECT_NAME}/${resourceName}/${baseName}`;
        debug(`Removing old ${baseName}`);
        this.cloudinary.uploader.destroy(publicId, () => {
          debug(`Uploading ${baseName}`);
          this.cloudinary.uploader.upload(filePath, (result) => {
            //console.log(`Upload finished for ${baseName}`);
            resolve();
          }, {
            public_id: publicId,
            resource_type: 'raw',
            invalidate: true
          });
        }, {
          resource_type: 'raw'
        });
      }));
    });

    return Promise.all(tasks);
  }

  _configure() {
    return new Promise((resolve, reject) => {
      Configuration.load(PROJECT_ROOT, PROJECT_NAME, path.join(PROJECT_ROOT, 'config'), {}, (configError, projectConfig) => {
        if (configError) {
          return reject(configError);
        }
        let config = projectConfig.cdn.adapterConfig;

        let uri = require('url').parse(config.uri, true);
        let uriConfig = {
          'cloud_name': uri.host,
          'api_key': uri.auth && uri.auth.split(':')[0],
          'api_secret': uri.auth && uri.auth.split(':')[1],
          'private_cdn': uri.pathname != null,
          'secure_distribution': uri.pathname && uri.pathname.substring(1)
        };
        config = merge(config, uriConfig);

        cloudinary.config(uriConfig);
        this.cloudinary = cloudinary;

        resolve(config);
      });
    });
  }
}

export default ProjectUploader;
