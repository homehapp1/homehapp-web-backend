import React from 'react';
import Image from './Image';

let debug = require('debug')('Agent');

export default class Agent extends React.Component {
  static propTypes = {
    agents: React.PropTypes.array.isRequired,
    contactUrl: React.PropTypes.string
  }

  static defaultProps = {
    contactUrl: null
  }

  render() {
    // if (!this.props.image || !this.props.image.url) {
    //   this.props.image = {
    //     url: 'v1440690786/contentMockup/agent-template.jpg',
    //     alt: this.props.name
    //   };
    // }
    return (
      <div className='widget agents pattern'>
        <div className='width-wrapper'>
          <h2>For more information and viewings</h2>
          <ul className='agents-list'>
            {
              this.props.agents.map((agent, index) => {
                debug('Agent', agent);
                let phone = null;
                let email = null;

                if (agent.contactNumber) {
                  let number = agent.contactNumber.replace(/[^\+0-9]/, '');
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
                    <p className='email'>{email}</p>
                  </li>
                );
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}
