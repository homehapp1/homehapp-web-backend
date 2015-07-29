"use strict";

import cloudinary from "cloudinary";
import {merge} from "../../../Helpers";

let debug = require("debug")("CloudinaryAdapter");

class CloudinaryAdapter {
  constructor(app, config) {
    this.app = app;
    this.config = merge({}, config);
    let uri = require("url").parse(this.config.uri, true);
    let uriConfig = {
      "cloud_name": uri.host,
      "api_key": uri.auth && uri.auth.split(":")[0],
      "api_secret": uri.auth && uri.auth.split(":")[1],
      "private_cdn": uri.pathname != null,
      "secure_distribution": uri.pathname && uri.pathname.substring(1)
    };
    this.config = merge(this.config, uriConfig);

    this.cloudinary = cloudinary.config(this.config);

    this.registerRoutes();
  }

  registerRoutes() {
    debug("Registering POST route: /api/cdn/signature");
    this.app.post("/api/cdn/signature", (req, res) => {
      let transformation = this.config.transformations.default;
      if (this.config.transformations[req.body.folder]) {
        transformation = this.config.transformations[req.body.folder];
      }
      let signData = {
        folder: req.body.folder,
        timestamp: Math.floor(new Date().getTime() / 1000)
      };
      if (transformation) {
        signData.transformation = transformation;
      }
      res.send(this.cloudinary.utils.sign_request(signData));
    });
  }
}

module.exports = CloudinaryAdapter;
