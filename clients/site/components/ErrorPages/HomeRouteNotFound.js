import React from 'react';

import RouteNotFound from './RouteNotFound';
import ErrorPage from '../../../common/components/Layout/ErrorPage';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';

export default class HomeRouteNotFound extends RouteNotFound {
  componentWillMount() {
    super.componentWillMount();
    this.error.message = 'Home not found';
  }

  render() {
    let error = this.error;

    return (
      <ErrorPage {...error}>
        <ContentBlock>
          <h2>Now what?</h2>
          <p>You can always:</p>
          <ul>
            <li>Lorem ipsum</li>
          </ul>
        </ContentBlock>
      </ErrorPage>
    );
  }
}
