'use strict';

import React from 'react';

export default class ObjectNotFound extends React.Component {
  render() {
    return (
      <div className='errorPage'>
        <h1>Not found</h1>
        <p>The object you have requested was not found</p>
      </div>
    );
  }
}
