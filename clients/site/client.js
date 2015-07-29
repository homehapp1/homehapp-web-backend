/*eslint-env es6, browser */
/*global window, __DEBUG__ */
"use strict";

let debug = require("../common/debugger")("site");
if (__DEBUG__) {
  debug.enable("*,-engine.io-client:polling*,-engine.io-client:*");
}

import React from "react";
import Router from "react-router";
import Iso from "iso";
import alt from "../common/alt";

import routes from "./components/Routes";

// External assets required. Remember to sync these to the vendor list
// in webpack config
//require("../../assets/js/site/jquery.js");

let {HistoryLocation} = Router;

// Once we bootstrap the stores, we run react-router using
// Router.HistoryLocation
// the element is created and we just render it into the container
// and our application is now live
Iso.bootstrap(function (state, _, container) {
    debug("Bootsrap Application with state", state);
    alt.bootstrap(state);

    Router.run(routes, HistoryLocation, function (Handler) {
        var node = React.createElement(Handler);
        React.render(node, container);
    });
});
