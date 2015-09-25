'use strict';

import React from 'react';
import { Link } from 'react-router';

// import Columns from '../../../common/components/Widgets/Columns';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import Icon from '../../../common/components/Widgets/Icon';
import PartnersForm from './Form';
import Modal from '../../../common/components/Widgets/Modal';

import DOMManipulator from '../../../common/DOMManipulator';

export default class ContentPartners extends React.Component {
  constructor() {
    super();
    this.displayForm = this.displayForm.bind(this);
  }

  componentDidMount() {
    console.log('button', this.refs);
    this.button = new DOMManipulator(this.refs.button);
    this.button.addEvent('click', this.displayForm, true);
  }

  componentWillUnmount() {
    this.button.removeEvent('click', this.displayForm, true);
  }

  createModal() {
    return (
      <Modal className='white with-overflow contact-form'>
        <PartnersForm />
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

  render() {
    return (
      <ContentBlock className='padded' align='left' valign='top'>
        <div className='center'>
          <Icon type='clipboard' className='large' />
        </div>
        <h1>Partners</h1>
        <h3>Who we are</h3>
        <p>Homehapp is...</p>
        <h3>We are looking for</h3>
        <p>We are looking for partners</p>
        <h3>What we offer</h3>
        <p>What we offer to our partners</p>
        <p className='call-to-action'>
          <Link className='button transparent' to='partnersContact' ref='button'>Get in contact & share us your details</Link>
        </p>
      </ContentBlock>
    );
  }
}
