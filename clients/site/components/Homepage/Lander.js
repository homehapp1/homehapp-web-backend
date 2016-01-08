import React from 'react';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import BigImage from '../../../common/components/Widgets/BigImage';
import LargeText from '../../../common/components/Widgets/LargeText';
import Image from '../../../common/components/Widgets/Image';
import Separator from '../../../common/components/Widgets/Separator';
import InputWidget from '../../../admin/components/Widgets/Input';
import Modal from '../../../common/components/Widgets/Modal';

import SocialMedia from '../Navigation/SocialMedia';

import DOMManipulator from '../../../common/DOMManipulator';
import { countryMap } from '../../../common/lib/Countries';

import NewsletterStore from '../../stores/NewsletterStore';
import NewsletterActions from '../../actions/NewsletterActions';
import ContactStore from '../../stores/ContactStore';
import ContactActions from '../../actions/ContactActions';

let debug = require('debug')('Lander');

export default class Lander extends React.Component {
  constructor() {
    super();

    this.contactStateChange = this.contactStateChange.bind(this);
    this.newsletterStateChange = this.newsletterStateChange.bind(this);
  }

  state = {
    error: null,
    newsletter: null,
    contact: null
  }

  componentDidMount() {
    let scroller = new DOMManipulator(this.refs.readmore);
    debug('scroller', scroller);

    if (jQuery) {
      jQuery('a.pager').on('click touch', function() {
        let i = Math.floor(jQuery(window).scrollTop() / jQuery(window).height()) + 1;
        $('body, html').animate({
          scrollTop: $(window).height() * i + 'px'
        }, 1000)
      });

      $('#socialShare').on('click touchstart', (event) => {
        event.stopPropagation();
        event.preventDefault();
        this.displaySocial();
      });
    } else {
      debug('no jquery');
    }

    ContactStore.listen(this.contactStateChange);
    NewsletterStore.listen(this.newsletterStateChange);
  }

  componentWillUnmount() {
    ContactStore.unlisten(this.contactStateChange);
    NewsletterStore.unlisten(this.newsletterStateChange);
  }

  newsletterStateChange(state) {
    this.setState(state);
    if (state.newsletter) {
      this.displayThankYou();
    }
  }

  contactStateChange(state) {
    this.setState(state);
    if (state.contact) {
      this.displayThankYou();
    }
  }

  displayThankYou() {
    if (this.modal && this.modal.closeModal) {
      this.modal.close();
    }

    let reject = () => {
      this.modal.close();
    };

    let modal = (
      <Modal className='white with-overflow confirmation' onClose={this.modalClose.bind(this)}>
        <a className='close' onClick={reject}>✕</a>
        <div className='content center centered'>
          <h2>Thank you!</h2>
          <p>
            We will be in touch with you shortly. In the<br className='hide-for-small' /> meantime, you can check our social media<br className='hide-for-small' /> channels too.
          </p>
          <SocialMedia />
        </div>
      </Modal>
    );

    // Create the modal
    this.modal = React.render(modal, document.getElementById('modals'));
    this.initModal();
  }

  displaySocial() {
    if (this.modal && this.modal.closeModal) {
      this.modal.close();
    }

    let reject = () => {
      this.modal.close();
    };

    let modal = (
      <Modal className='white with-overflow confirmation confirmation-small' onClose={this.modalClose.bind(this)}>
        <a className='close' onClick={reject}>✕</a>
        <div className='content center centered'>
          <h2>Follow us!</h2>
          <p className='clearfix'></p>
          <SocialMedia />
        </div>
      </Modal>
    );

    // Create the modal
    this.modal = React.render(modal, document.getElementById('modals'));
    this.initModal();
  }

  subscribeAsTester(event) {
    event.preventDefault();
    event.stopPropagation();

    let data = {
      subType: `Beta testing: ${this.refs.type.getValue()}`,
      sender: {
        name: this.refs.name.getValue(),
        email: this.refs.email.getValue(),
        country: this.refs.country.getValue(),
      },
      type: 'email'
    };

    if (!data.sender.email || !data.sender.name) {
      return null;
    }

    debug('Will send', data);
    this.email = data.sender.email;

    let submit = (e) => {
      ContactActions.createItem(data);
    };

    this.displayConfirmation(submit);
  }

  subscribeToNewsletter(event) {
    event.preventDefault();
    event.stopPropagation();

    this.email = (new DOMManipulator(this.refs.subscriberEmail)).node.value || (new DOMManipulator(this.refs.subscriberEmail2)).node.value || '';

    if (!this.email) {
      return null;
    }

    let submit = (e) => {
      e.preventDefault();
      e.stopPropagation();
      let props = {
        email: this.email
      };
      NewsletterActions.createItem(props);
    };

    this.displayConfirmation(submit, null);
  }

  displayConfirmation(resolve, reject) {
    if (!resolve) {
      resolve = (event) => {
        debug('Resolved');
      };
    }

    if (!reject) {
      reject = (event) => {
        this.modal.close();
      };
    }

    let modal = (
      <Modal className='white with-overflow confirmation' onClose={this.modalClose.bind(this)}>
        <a className='close' onClick={reject}>✕</a>
        <div className='content center centered'>
          <h2>Join with address:<br className='hide-for-small' /> {this.email}</h2>
          <p>
            Please confirm that your e-mail address is correct.
          </p>
          <p className='form-actions'>
            <a className='button highlight' onClick={resolve}>Yes, that's right</a>
            <a className='button' onClick={reject}>No, the address is wrong</a>
          </p>
        </div>
      </Modal>
    );

    // Create the modal
    this.modal = React.render(modal, document.getElementById('modals'));
    this.initModal();
  }

  initModal() {
    this.body = new DOMManipulator(document.getElementsByTagName('body')[0]);
    this.body.addClass('blurred');
  }

  submitBetaForm(event) {

  }

  modalClose(event) {
    if (event) {
      event.preventDefault();
    }

    if (this.modal) {
      React.unmountComponentAtNode(React.findDOMNode(this.modal));
      this.modal = null;
    }

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
      aspectRatio: 1920 / 1280,
      align: 'left'
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
        <i className='fa fa-share-alt show-for-small' id='socialShare' ref='socialShare'></i>
        <BigImage image={image} className='full-height-always' align='left'>
          <LargeText align='center' valign='middle' className='full-height-always' id='mainContent'>
            <h1>WE ARE<br className='show-for-small' /> TRANSFORMING<br /> HOW HOMES ARE<br className='show-for-small' /> PRESENTED</h1>
            <p className='title-like hide-for-small'>
              <span>Please join our mailing list.</span> We will keep you posted on our progress and notify you when we go live.
            </p>
            <form method='post' className='mailchimp hide-for-small' action='/api/contact/mailchimp' onSubmit={this.subscribeToNewsletter.bind(this)}>
              <table className='wrapper'>
                <tr>
                  <td width='60%' className='email'><input type='email' name='email' ref='subscriberEmail' placeholder='Fill in your email address' /></td>
                  <td width='40%' className='submit'><input type='submit' value='Notify me!' /></td>
                </tr>
              </table>
            </form>
          </LargeText>
          <div className='secondary centered'>
            <p className='title-like uppercase'>
              <a href='#readmore' ref='readmore' className='pager'>
                <i className='fa fa-angle-down icon'></i>
                <span className='hide-for-small'>Want to know more?</span>
              </a>
            </p>
          </div>
        </BigImage>
        <ContentBlock className='show-for-small pattern full-height-always mailing-list'>
          <h2 className='page-title'>Please join<br /> our mailing list</h2>
          <p className='title-like centered'>
            We will keep you posted on our<br /> progress and notify you when<br /> we go live
          </p>
          <form method='post' className='mailchimp' action='/api/contact/mailchimp' onSubmit={this.subscribeToNewsletter.bind(this)}>
            <table className='wrapper'>
              <tr>
                <td width='60%' className='email'><input type='email' name='email' ref='subscriberEmail2' placeholder='Fill in your email address' /></td>
                <td width='40%' className='submit'><input type='submit' value='Join' /></td>
              </tr>
            </table>
          </form>
          <div className='secondary centered'>
            <p className='title-like uppercase'>
              <a href='#readmore' ref='readmore' className='pager'>
                <i className='fa fa-angle-down icon'></i>
                Want to know more?
              </a>
            </p>
          </div>
        </ContentBlock>
        <ContentBlock className='centered center pattern' ref='target'>
          <p>
            <Image {...appImage} />
          </p>
          <h2>WE BELIEVE EVERY HOME HAS A STORY</h2>
          <p className='mobile-padded'>
            Homehapp is the place where you can create, store and share your<br className='hide-for-small' /> home
            moments. And when the time comes for you to move on, and<br className='hide-for-small' /> you want
            to sell or let your home, all you have to do is click a button<br className='hide-for-small' /> and
            homehapp helps you find the right buyer or tenant.
          </p>
          <p className='title-like uppercase mobile-padded'>
            WE’RE CURRENTLY IN BETA TESTING PHASE. PLEASE FILL IN YOUR DETAILS <br className='hide-for-small' /> TO JOIN OUR TEST GROUP WITH EARLY ACCESS.
          </p>
          <form method='post' action='/api/contact/beta' onSubmit={this.subscribeAsTester.bind(this)} className='beta-testers'>
            <div className='form'>
              <InputWidget type='text' name='name' ref='name' placeholder='Your name' required />
              <InputWidget type='email' name='email' ref='email' placeholder='Your email address' required  />
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
