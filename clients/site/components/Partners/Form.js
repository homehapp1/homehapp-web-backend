'use strict';

import React from 'react';
import { Link } from 'react-router';

import Columns from '../../../common/components/Widgets/Columns';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import Icon from '../../../common/components/Widgets/Icon';

export default class PartnersForm extends React.Component {
  render() {
    return (
      <ContentBlock className='home contact-form'>
        <h2>Contact us</h2>
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
            By submitting this form you accept our <a href='/terms'>Terms of use</a>
          </p>
        </form>
      </ContentBlock>
    );
  }
}
