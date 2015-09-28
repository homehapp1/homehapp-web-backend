'use strict';

import React from 'react';

import ContentBlock from '../../../common/components/Widgets/ContentBlock';

export default class PartnersForm extends React.Component {
  static propTypes = {
    context: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.object
  };

  render() {
    let terms = '/terms';

    if (this.props.context) {
      this.context = this.props.context;
    }

    if (this.context && this.context.router) {
      terms = this.context.router.makeHref('contentTerms');
    }

    return (
      <ContentBlock className='home contact-form'>
        <h1>Contact us</h1>
        <form method='post'>
          <div className='form'>
            <label className='control'>
              <span className='label'>
                Name
              </span>
              <input type='text' name='name' placeholder='Your name' required />
            </label>

            <label className='control'>
              <span className='label'>
                Email
              </span>
              <input type='email' name='email' placeholder='myname@example.com' required />
            </label>

            <label className='control'>
              <span className='label'>
                Message
              </span>
              <textarea name='message'></textarea>
            </label>
          </div>
          <div className='buttons'>
            <input type='submit' className='button' value='Send message' />
          </div>
          <p className='fineprint'>
            By submitting this form you accept our <a href={terms}>Terms of use</a>
          </p>
        </form>
      </ContentBlock>
    );
  }
}
