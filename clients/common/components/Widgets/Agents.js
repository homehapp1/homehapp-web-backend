import React from 'react';
import { Link } from 'react-router';
import Image from './Image';

let debug = require('debug')('Agent');

export default class Agent extends React.Component {
  static propTypes = {
    home: React.PropTypes.oneOfType([
      React.PropTypes.object,
      React.PropTypes.null
    ]),
    agents: React.PropTypes.array.isRequired,
    contactUrl: React.PropTypes.string
  }

  static defaultProps = {
    contactUrl: null,
    home: null
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
      return true;
    }

    event.preventDefault();
    event.stopPropagation();
    link.click();
  }

  getFormLink() {
    if (!this.props.home) {
      return null;
    }

    return (
      <p className='centered email'>
        <Link to='homeForm' params={{slug: this.props.home.slug}} ref='contact'>Contact us</Link>
      </p>
    );
  }

  render() {
    // if (!this.props.image || !this.props.image.url) {
    //   this.props.image = {
    //     url: 'v1440690786/contentMockup/agent-template.jpg',
    //     alt: this.props.name
    //   };
    // }
    return (
      <div className='widget agents pattern' id='agentsList'>
        <div className='width-wrapper'>
          <h2>For more information and viewings</h2>
          <ul className='agents-list'>
            {
              this.props.agents.map((agent, index) => {
                debug('Agent', agent);
                let phone = null;
                let email = null;

                if (agent.contactNumber) {
                  let number = agent.contactNumber.replace(/[^\+0-9]/g, '');
                  phone = (
                    <a href={`callto:${number}`}>{agent.contactNumber}</a>
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
                    <p className='name'>{agent.name}</p>
                    <Image {...image} className='photo' />
                    <p className='phone'>{phone}</p>
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
