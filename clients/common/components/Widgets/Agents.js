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
          <ul>
            {
              this.props.agents.map((agent) => {
                debug('Agent', agent);
                let image = {
                  url: agent.mainImage.url,
                  alt: agent.mainImage.alt || agent.name,
                  variant: 'masked',
                  applySize: true
                };
                return (
                  <li>
                    <Image {...image} />
                    {agent.name}
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
