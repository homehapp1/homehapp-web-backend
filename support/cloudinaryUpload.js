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
    .then(() => {
      console.log('Configured, proceed to upload resources');
      return this._uploadResources('images')
    })
    .then(() => {
      console.log('Images uploaded');
      return this._uploadResources('fonts')
    })
    .then(() => {
      console.log('Fonts uploaded');
      return this._uploadResources('css');
    })
    .then(() => {
      return this._uploadResources('js');
    })
    .then(() => {
      console.log('Finished Uploading all assets');
      callback(null, status);
    })
    .catch((err) => {
      callback(err);
    });
  }

  _uploadResources(resourceName) {
    console.log(`Uploading ${resourceName} resources`);
    let tasks = [];

    let filesPath = path.join(this.sourceFolder, resourceName);
    let files = walkDirSync(filesPath);

    files.forEach((filePath) => {
      let baseName = path.basename(filePath);
      tasks.push(new Promise((resolve, reject) => {
        let publicId = `${PROJECT_NAME}/${resourceName}/${baseName}`;
        console.log(`Removing old ${baseName}`);
        this.cloudinary.uploader.destroy(publicId, () => {
          console.log(`Uploading ${baseName}`);
          let timeout = 30;
          let t = (new Date()).getTime();
          let timer = setInterval(() => {
            let dt = Math.round(((new Date()).getTime() - t) / 1000) / 60;
            console.log(`Warning! Uploading '${baseName}' has lasted already for ${dt}min...`);
          }, timeout * 1000);

          this.cloudinary.uploader.upload(filePath, (result) => {
            let dt = Math.round(((new Date()).getTime() - t) / 100) / 10;
            console.log(`Upload finished for ${baseName} in ${dt}s`);
            clearInterval(timer);
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
