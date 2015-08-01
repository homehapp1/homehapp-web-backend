'use strict';

import React from 'react';

class Layout extends React.Component {
  static propTypes = {
    children: React.PropTypes.array.isRequired,
    width: React.PropTypes.number.isRequired
  }
  static defaultProps = {
  }

  scrollTop(e) {
    
  }
  
  resize(e) {
    let items = document.getElementsByClassName('full-height');
    let height = window.innerHeight;
    
    for (let i = 0; i < items.length; i++) {
      items[i].style.minHeight = `${height}px`;
    }
  }
  
  render() {
    let style = {
      //width: `${this.props.width}px`
    };
    return (
      <div id='layout' style={style}>
        {this.props.children}
      </div>
    );
  }
}

export default Layout;
