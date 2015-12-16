import React from 'react';

import ContentBlock from '../../../common/components/Widgets/ContentBlock';

let debug = require('debug')('Login');

export default class Login extends React.Component {
  render() {
    return (
      <ContentBlock>
        <div id='loginForm'>
          <h3>Login</h3>
        </div>
      </ContentBlock>
    );
  }
}
