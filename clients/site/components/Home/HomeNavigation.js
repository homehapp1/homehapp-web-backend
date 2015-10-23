import React from 'react';
import { Link } from 'react-router';

import ContentNavigation from '../Header/ContentNavigation';
import HomeContact from './HomeContact';
import Modal from '../../../common/components/Widgets/Modal';
import DOMManipulator from '../../../common/DOMManipulator';

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

    setTimeout(function() {
      navi.addClass('animate');
    });
  }

  createModal() {
    return (
      <Modal className='white with-overflow contact-form'>
        <HomeContact home={this.props.home} context={this.context} />
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
    debug('getStoryLink', this.context.router);
    let currentRoutes = this.context.router.getCurrentRoutes();
    debug('currentRoutes', currentRoutes);
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

  render() {
    let todo = function() {
      console.info('Implement phone calling');
    };
    debug('this.props.router', this.props.router);

    return (
      <ContentNavigation>
        <ul ref='navi'>
          {this.getStoryLink()}
          {this.getDetailsLink()}
          <li className='phone'>
            <a href='#' onClick={todo}><i className='fa fa-phone'></i></a>
          </li>
          <li className='contact'>
            <Link ref='contact' to='homeForm' params={{slug: this.props.home.slug}}><i className='fa fa-envelope-o'></i></Link>
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
