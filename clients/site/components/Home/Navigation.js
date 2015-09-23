'use strict';

import React from 'react';
import { Link } from 'react-router';

import ContentNavigation from '../Header/ContentNavigation';
import HomeContact from './HomeContact';
import Modal from '../../../common/components/Widgets/Modal';

export default class HomeNavigation extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired
  };

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
    console.log('display form');
    this.modal = this.createModal();
    this.modalContainer = null;
    this.preloaded = {};
    console.log('modal', this.modal);

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

  render() {
    let todo = function() {
      alert('@TODO');
    };

    return (
      <ContentNavigation>
        <ul>
          <li>
            <a href='#' onClick={todo}><i className='fa fa-phone'></i></a>
          </li>
          <li>
            <Link ref='contact' to='homeForm' params={{slug: this.props.home.slug}}><i className='fa fa-envelope-o'></i></Link>
          </li>
          <li>
            <a ref='facebook' target='_blank'><i className='fa fa-facebook-square'></i></a>
          </li>
          <li>
            <a ref='twitter' target='_blank'><i className='fa fa-twitter'></i></a>
          </li>
        </ul>
      </ContentNavigation>
    );
  }
}
