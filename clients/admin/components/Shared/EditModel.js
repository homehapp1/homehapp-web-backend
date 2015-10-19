/*global window */


import React from 'react';

export default class EditModel extends React.Component {
  static propTypes = {
    neighborhood: React.PropTypes.object.isRequired,
    tab: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ])
  }

  defaultProps = {
    tab: 1
  }

  constructor(props) {
    super(props);
  }

  tabs = {
    details: 1,
    story: 2,
    metadata: 3
  }

  resolveOpenTab() {
    let tab = this.props.tab;

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
