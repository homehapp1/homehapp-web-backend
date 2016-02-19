import React from 'react';

export default class RouteNotFound extends React.Component {
  render() {
    return (
      <div className='errorPage'>
        <h1>Route does not exist.</h1>
        <p>The requested route was not found</p>
      </div>
    );
  }
}
