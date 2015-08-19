'use strict';

import React from 'react';

class Pager extends React.Component {
  render() {
    return (
      <div className='pager'>
        <a className='prev'><i className='fa fa-angle-left'></i></a>
        <a className='next'><i className='fa fa-angle-right'></i></a>
      </div>
    );
  }
}

export default Pager;
