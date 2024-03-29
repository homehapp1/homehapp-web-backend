import React from 'react';
import { Link } from 'react-router';

// import Columns from '../../../common/components/Widgets/Columns';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';
import Icon from '../../../common/components/Widgets/Icon';
import Image from '../../../common/components/Widgets/Image';
import PartnersForm from './Form';
import Modal from '../../../common/components/Widgets/Modal';

import DOMManipulator from '../../../common/DOMManipulator';
import { setPageTitle } from '../../../common/Helpers';

export default class ContentPartners extends React.Component {
  static contextTypes = {
    router: React.PropTypes.func
  };

  constructor() {
    super();
    this.displayForm = this.displayForm.bind(this);
  }

  componentDidMount() {
    this.button = new DOMManipulator(this.refs.button);
    this.button.addEvent('click', this.displayForm, true);

    setPageTitle('Become our partner');
  }

  componentWillUnmount() {
    this.button.removeEvent('click', this.displayForm, true);
  }

  createModal() {
    return (
      <Modal className='white with-overflow contact-form'>
        <PartnersForm context={this.context} />
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
    let image = {
      url: 'https://res.cloudinary.com/homehapp/image/upload/v1441014109/site/images/icons/icon_mobile_large.svg',
      alt: ''
    };
    return (
      <ContentBlock className='padded' align='left' valign='top'>
        <div className='center'>
          <Icon type='clipboard' className='large' />
        </div>
        <h1>Why Homehapp?</h1>
        <p>
          Homehapp is a platform for buyers and sellers, landlords and
          tenants, Estate agents, legal conveyancers, chartered surveyors.
          Expand your reach and increase your sales.
        </p>
        <div className='centered'>
          <Image {...image} />
        </div>
        <p className='call-to-action'>
          <Link className='button transparent' to='partnersContact' ref='button'>Get in contact & share us your details</Link>
        </p>
      </ContentBlock>
    );
  }
}
