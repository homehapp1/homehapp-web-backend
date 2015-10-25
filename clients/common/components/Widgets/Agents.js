import React from 'react';
import Image from './Image';

export default class Agent extends React.Component {
  static propTypes = {
    title: React.PropTypes.string,
    phone: React.PropTypes.string,
    email: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    image: React.PropTypes.object
  };

  render() {
    if (!this.props.image || !this.props.image.url) {
      this.props.image = {
        url: 'v1440690786/contentMockup/agent-template.jpg',
        alt: this.props.name
      };
    }

    let image = {
      src: this.props.image.url,
      alt: this.props.image.alt || this.props.name,
      variant: 'masked',
      applySize: true
    };

    let callTo = `callto:${this.props.phone}`;
    let mailTo = `mailto:${this.props.email}`;

    return (
      <div className='widget agents pattern'>
        <div className='width-wrapper'>
          <h2>For more information and viewings</h2>
          <ul>
            {
              this.props.agents.map((agent) => {
                return (
                  <li>{agent.name}</li>
                );
              })
            }
          </ul>
        </div>
      </div>
    );
  }
}
