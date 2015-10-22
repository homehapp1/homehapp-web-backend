/*global window */
import React from 'react';
// let debug = require('debug')('EditModel');

export default class EditModel extends React.Component {
  static propTypes = {
    neighborhood: React.PropTypes.object.isRequired,
    tab: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ])
  }

  static defaultProps = {
    tab: 1,
    params: {}
  }

  constructor(props) {
    super(props);
  }

  tabs = {
    details: 1,
    story: 2,
    metadata: 3
  }

  resolveOpenTab(tab = null) {
    if (!tab) {
      tab = this.props.tab || 1;
    }
    if (typeof this.tabs[tab] !== 'undefined') {
      return this.tabs[tab];
    }

    tab = Number(tab);
    if (isNaN(tab)) {
      tab = 1;
    }
    return tab;
  }
}
