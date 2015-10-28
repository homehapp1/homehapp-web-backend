import React from 'react';
import { Link } from 'react-router';

import ContentNavigation from '../Header/ContentNavigation';
import HomeContact from './HomeContact';
import Modal from '../../../common/components/Widgets/Modal';
import DOMManipulator from '../../../common/DOMManipulator';
import { scrollTop } from '../../../common/Helpers';

let debug = require('debug')('HomeNavigation');

export default class HomeNavigation extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired,
    router: React.PropTypes.object
  };

  static contextTypes = {
    router: React.PropTypes.func
  }

  constructor() {
    super();
    this.displayForm = this.displayForm.bind(this);
  }

  componentDidMount() {
    let fb = React.findDOMNode(this.refs.facebook);
    let tw = React.findDOMNode(this.refs.twitter);
    let em = React.findDOMNode(this.refs.contact);

    fb.href = this.facebookShareUrl();
    tw.href = this.twitterShareUrl();

    em.addEventListener('click', this.displayForm, true);

    let navi = new DOMManipulator(this.refs.navi);
    navi.addClass('init');
    let items = navi.getByTagName('li');
    for (let i = 0; i < items.length; i++) {
      items[i].attr('data-index', items.length - i - 1);
    }
    let links = navi.getByTagName('a');
    for (let link of links) {
      if (link.attr('href') === window.location.pathname) {
        link.addClass('active');
      } else {
        link.removeClass('active');
      }
    }

    this.bindPhoneToAgents();

    setTimeout(function() {
      navi.addClass('animate');
    });
  }

  componentWillUnmount() {
    this.unbindPhoneToAgents();
  }

  onPhoneClick(event) {
    let target = document.getElementById('agentsList');
    if (!target) {
      return true;
    }
    scrollTop(target.getBoundingClientRect().top, 500);
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  bindPhoneToAgents() {
    if (!this.refs.phone) {
      return null;
    }
    this.onPhoneClick = this.onPhoneClick.bind(this);

    let node = new DOMManipulator(this.refs.phone);
    node.addEvent('click', this.onPhoneClick, true);
  }

  unbindPhoneToAgents() {
    if (!this.refs.phone) {
      return null;
    }

    let node = new DOMManipulator(this.refs.phone);
    node.removeEvent('click', this.onPhoneClick, true);
  }

  modalClose() {
    let modals = document.getElementById('modals').getElementsByClassName('contact-form');
    for (let modal of modals) {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
    }
    let body = document.getElementsByTagName('body')[0];
    body.className = body.className.replace(/ ?no-scroll/g, '');
  }

  createModal() {
    return (
      <Modal className='white with-overflow contact-form'>
        <HomeContact home={this.props.home} context={this.context} onClose={this.modalClose.bind(this)} />
      </Modal>
    );
  }

  displayForm(e) {
    e.preventDefault();
    e.stopPropagation();
    this.modal = this.createModal();
    this.modalContainer = null;
    this.preloaded = {};

    // Create the modal
    React.render(this.modal, document.getElementById('modals'));

    return false;
  }

  facebookShareUrl() {
    return `https://www.facebook.com/sharer.php?u=${window.location.href}`;
  }

  twitterShareUrl() {
    return `https://www.twitter.com/share?url=${window.location.href}&via=homehapp`;
  }

  getDetailsLink() {
    let href = this.context.router.makeHref('home', {slug: this.props.home.slug});
    let className = '';

    if (this.props.home.story.enabled) {
      href = this.context.router.makeHref('homeDetails', {slug: this.props.home.slug});
    }

    return (
      <li className='details'>
        <a href={href} className={className}><i className='fa fa-info-circle'></i></a>
      </li>
    );
  }

  getStoryLink() {
    let currentRoutes = this.context.router.getCurrentRoutes();
    if (!this.props.home.story.enabled) {
      return null;
    }

    let href = this.context.router.makeHref('home', {slug: this.props.home.slug});
    let className = '';

    return (
      <li className='story'>
        <a href={href} className={className}><i className='fa fa-home'></i></a>
      </li>
    );
  }

  getPhoneLink() {
    if (!this.props.home.agents || !this.props.home.agents.length) {
      debug('No agents');
      return null;
    }

    let phone = null;

    for (let agent of this.props.home.agents) {
      debug('Check agent', agent);
      if (agent.contactNumber) {
        phone = String(agent.contactNumber).replace(/[^\+0-9]+/g, '');
        break;
      }
    }

    if (!phone) {
      debug('No phone number found on any agent');
      return null;
    }
    debug('Got number', phone);

    return (
      <li className='phone'>
        <a href={`callto:${phone}`} ref='phone'><i className='fa fa-phone'></i></a>
      </li>
    );
  }

  render() {
    return (
      <ContentNavigation>
        <ul ref='navi'>
          {this.getPhoneLink()}
          <li className='contact'>
            <Link ref='contact' to='homeForm' params={{slug: this.props.home.slug}} id='contactFormLink'><i className='fa fa-envelope-o'></i></Link>
          </li>
          <li className='facebook'>
            <a ref='facebook' target='_blank'><i className='fa fa-facebook-square'></i></a>
          </li>
          <li className='twitter'>
            <a ref='twitter' target='_blank'><i className='fa fa-twitter'></i></a>
          </li>
        </ul>
      </ContentNavigation>
    );
  }
}
