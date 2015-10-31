import React from 'react';
import { Link } from 'react-router';
import Image from './Image';
import Modal from './Modal';
import HomeContact from '../../../site/components/Home/HomeContact';

let debug = require('debug')('Agent');

export default class Agent extends React.Component {
  static propTypes = {
    home: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.null
    ]),
    agents: React.PropTypes.array.isRequired,
    contactUrl: React.PropTypes.string,
    className: React.PropTypes.string
  }

  static defaultProps = {
    contactUrl: null,
    home: null,
    className: null
  }

  componentDidMount() {
    this.bindContactForm();
  }

  componentWillUnmount() {
    this.unbindContactForm();
  }

  bindContactForm() {
    if (!this.refs.contact) {
      return null;
    }
    this.onClick = this.onClick.bind(this);
    let node = React.findDOMNode(this.refs.contact);
    node.addEventListener('click', this.onClick, true);
    node.addEventListener('touch', this.onClick, true);
  }

  unbindContactForm() {
    if (!this.refs.contact) {
      return null;
    }
    this.onClick = this.onClick.bind(this);
    let node = React.findDOMNode(this.refs.contact);
    node.removeEventListener('click', this.onClick, true);
    node.removeEventListener('touch', this.onClick, true);
  }

  onClick(event) {
    let link = document.getElementById('contactFormLink');
    if (!link) {
      debug('No contact form link found elsewhere');
      return true;
    }
    let e = new Event('click', {
      target: link
    });
    debug('link click', event, e);
    link.dispatchEvent(event);
    event.preventDefault();
    event.stopPropagation();
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

    // Create the modal
    React.render(this.modal, document.getElementById('modals'));

    return false;
  }

  getFormLink() {
    if (!this.props.home) {
      return null;
    }

    return (
      <p className='centered email'>
        <Link to='homeForm' params={{slug: this.props.home.slug}} onClick={this.displayForm.bind(this)}>Contact us</Link>
      </p>
    );
  }

  render() {
    let classes = ['widget', 'agents', 'pattern'];
    if (this.props.className) {
      classes.push(this.props.className);
    }

    return (
      <div className={classes.join(' ')} id='agentsList'>
        <div className='width-wrapper'>
          <h2>For more information and viewings</h2>
          <ul className='agents-list'>
            {
              this.props.agents.map((agent, index) => {
                debug('Agent', agent);
                let phone = null;

                agent.contactNumber = '+358 50 5958435';

                if (agent.contactNumber) {
                  let number = agent.contactNumber.replace(/[^\+0-9]/g, '');
                  phone = (
                    <p className='phone has-icon'>
                      <span className='label'>
                        <a href={`callto:${number}`}>{agent.contactNumber}</a>
                      </span>
                    </p>
                  );
                }

                let image = {
                  url: agent.mainImage.url,
                  alt: agent.mainImage.alt || agent.name,
                  variant: 'masked',
                  applySize: true
                };

                return (
                  <li className='agent' key={`agent-${index}`}>
                    <p className='title'>{agent.title}</p>
                    <h3>{agent.name}</h3>
                    <Image {...image} className='photo' />
                    {phone}
                    <p className='email has-icon'>
                      <span className='label'>
                        <Link to='homeForm' params={{slug: this.props.home.slug}} onClick={this.displayForm.bind(this)}>
                          Request details
                        </Link>
                      </span>
                    </p>
                  </li>
                );
              })
            }
          </ul>
          {this.getFormLink()}
        </div>
      </div>
    );
  }
}
