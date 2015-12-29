import React from 'react';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import BigImage from '../../../common/components/Widgets/BigImage';
import LargeText from '../../../common/components/Widgets/LargeText';
import Image from '../../../common/components/Widgets/Image';
import Separator from '../../../common/components/Widgets/Separator';
import InputWidget from '../../../admin/components/Widgets/Input';
import Modal from '../../../common/components/Widgets/Modal';

import DOMManipulator from '../../../common/DOMManipulator';
import { countryMap } from '../../../common/lib/Countries';

import NewsletterStore from '../../stores/NewsletterStore';
import NewsletterActions from '../../actions/NewsletterActions';

let debug = require('debug')('Lander');

export default class Lander extends React.Component {
  componentDidMount() {
    let scroller = new DOMManipulator(this.refs.readmore);
    debug('scroller', scroller);
    let scrollTo = (event) => {
      event.preventDefault();
      try {
        (new DOMManipulator(this.refs.readmore)).scrollTo(400, 160);
      } catch(error) {
        debug('error', error);
      }
    };

    scroller.addEvent('click', scrollTo);
  }

  subscribeToNewsletter(event) {
    event.preventDefault();
    event.stopPropagation();

    let email = (new DOMManipulator(this.refs.contactEmail)).node.value || '';
    let submit = (e) => {
      e.preventDefault();
      e.stopPropagation();
      let props = {
        email: email
      };
      NewsletterActions.createItem(props);
    };

    this.modal = (
      <Modal className='white with-overflow confirmation' onClose={this.modalClose.bind(this)}>
        <div className='content center centered'>
          <h2>Join with address:<br className='hide-for-small' /> {email}</h2>
          <p>
            Please confirm that your e-mail address is correct.
          </p>
          <p className='form-actions'>
            <a className='button highlight' onClick={submit}>Yes, that's right</a>
            <a className='button' id='wrongAddress'>No, the address is wrong</a>
          </p>
        </div>
      </Modal>
    );

    // Create the modal
    let modal = React.render(this.modal, document.getElementById('modals'), () => {
      try {
        document.getElementById('wrongAddress').addEventListener('click', (event) => {
          modal.close();
        }, true);
      } catch (error) {
        debug(error);
      }
    });

    this.initModal();
  }

  initModal() {
    this.body = new DOMManipulator(document.getElementsByTagName('body')[0]);
    this.body.addClass('blurred');
  }

  submitBetaForm(event) {

  }

  modalClose() {
    let modals = document.getElementById('modals').getElementsByClassName('contact-form');
    for (let modal of modals) {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }

    if (this.body) {
      this.body.removeClass('blurred');
      this.body.removeClass('no-scroll');
    }
  }

  listCountries() {
    let countries = [];
    countries.push(
      <option value='GB'>{countryMap['GB']}</option>
    );
    let tmp = [];

    for (let code in countryMap) {
      tmp.push([code, countryMap[code]]);

      if (countryMap[code].match(/^The /)) {
        tmp.push([code, countryMap[code].replace(/^The /, '')]);
      }
    }
    tmp.sort((a, b) => {
      if (a[1] < b[1]) {
        return -1;
      }
      if (a[1] > b[1]) {
        return 1;
      }
      return 0;
    });

    tmp.map((c) => {
      let code = c[0];
      let country = c[1];

      countries.push(
        <option value={code}>{country}</option>
      );
    });

    return countries;
  }

  render() {
    let image = {
      url: 'https://res.cloudinary.com/homehapp/image/upload/v1450887451/site/images/content/lander.jpg',
      alt: 'Placeholder',
      width: 1920,
      height: 1280,
      aspectRatio: 1920 / 1280
    };

    let appImage = {
      url: 'http://res.cloudinary.com/homehapp/image/upload/v1450903388/site/images/content/responsive-homehapp.png',
      alt: '',
      width: 434,
      height: 296,
      applySize: true
    };

    return (
      <div id='lander'>
        <BigImage image={image} className='full-height'>
          <LargeText align='center' valign='middle' className='full-height'>
            <h1 className='pre-line'>WE ARE TRANSFORMING<br className='hide-for-small' /> HOW HOMES ARE PRESENTED.</h1>
            <p className='title-like'>
              Please join our mailing list. We will keep you posted on our progress<br className='hide-for-small' /> and notify you when we go live.
            </p>
            <form method='post' className='mailchimp' action='/api/contact/mailchimp' onSubmit={this.subscribeToNewsletter.bind(this)}>
              <table className='wrapper'>
                <tr>
                  <td width='60%' className='email'><input type='email' name='email' defaultValue='arttu@kaktus.cc' ref='contactEmail' placeholder='Fill in your email address' /></td>
                  <td width='40%' className='submit'><input type='submit' value='Notify me!' /></td>
                </tr>
              </table>
            </form>
          </LargeText>
          <div className='secondary centered'>
            <p className='title-like uppercase'>
              <a href='#readmore' ref='readmore'>
                <i className='fa fa-angle-down icon'></i>
                Want to know more?
              </a>
            </p>
          </div>
        </BigImage>
        <Separator type='white' />
        <ContentBlock className='centered center pattern' ref='target'>
          <a name='readmore'></a>
          <p>
            <Image {...appImage} />
          </p>
          <h2>WE BELIEVE EVERY HOME HAS A STORY</h2>
          <p>
            Homehapp is the place where you can create, store and share your<br className='hide-for-small' /> home
            moments. And when the time comes for you to move on, and<br className='hide-for-small' /> you want
            to sell or let your home, all you have to do is click a button<br className='hide-for-small' /> and
            homehapp helps you find the right buyer or tenant.
          </p>
          <p className='title-like uppercase'>
            WE’RE CURRENTLY IN BETA TESTING PHASE. FILL IN YOUR DETAILS <br className='hide-for-small' /> TO JOIN OUR TEST GROUP WITH EARLY ACCESS.
          </p>
          <form method='post' action='/api/contact/beta' onSubmit={this.subscribeToNewsletter.bind(this)} className='beta-testers'>
            <div className='form'>
              <InputWidget type='text' name='name' ref='name' placeholder='Your name' required />
              <InputWidget type='email' name='email' ref='email' placeholder='Your email address' required />
              <InputWidget type='select' name='country' ref='country'>
                <option value=''>Pick your home country</option>
                {this.listCountries()}
              </InputWidget>
              <InputWidget type='select' name='type' ref='type'>
                <option value=''>Are you a home owner or a real estate professional?</option>
                <option value='owner'>Home owner</option>
                <option value='professional'>Real estate professional</option>
              </InputWidget>
              <InputWidget type='submit' value='Send info and become a beta tester' />
            </div>

          </form>
        </ContentBlock>
      </div>
    );
  }
}
