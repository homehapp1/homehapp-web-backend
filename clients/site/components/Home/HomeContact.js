'use strict';

import React from 'react';

import Columns from '../../../common/components/Widgets/Columns';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';

export default class HomeContact extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired,
    context: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.func
  };

  render() {
    let terms = '/404';

    if (this.props.context) {
      this.context = this.props.context;
    }

    if (this.context && this.context.router) {
      terms = this.context.router.makeHref('contentTerms');
    }

    return (
      <ContentBlock className='home contact-form'>
        <h2>Home details</h2>
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

            <span className='label'>
              Type of enquiry
            </span>
            <Columns cols={2} className='control-group'>
              <label className='control radio'>
                <input type='radio' name='type' value='details' /> Request details
              </label>
              <label className='control radio'>
                <input type='radio' name='type' value='viewing' /> Arrange viewing
              </label>
            </Columns>

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
