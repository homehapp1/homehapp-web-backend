import React from 'react';

import Columns from '../../../common/components/Widgets/Columns';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';

import ContactStore from '../../stores/ContactStore';
import ContactActions from '../../actions/ContactActions';
let debug = require('debug')('HomeContact');

export default class HomeContact extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired,
    context: React.PropTypes.object,
    onClose:  React.PropTypes.func
  }

  static contextTypes = {
    router: React.PropTypes.func,
    onClose: () => {
      debug('Default onclose');
    }
  };

  constructor() {
    super();
    this.sendRequest = this.sendRequest.bind(this);
    this.storeListener = this.onContactStoreChange.bind(this);
    this.sent = false;
  }

  state = {
    error: null,
    contact: null
  }

  componentDidMount() {
    ContactStore.listen(this.storeListener);
  }

  componentWillUnmount() {
    ContactStore.unlisten(this.storeListener);
  }

  onContactStoreChange(state) {
    debug('onContactStoreChange', state);
    this.setState(state);
  }

  getContactType() {
    let details = React.findDOMNode(this.refs.subTypeDetails);
    let viewing = React.findDOMNode(this.refs.subTypeViewing);
    if (viewing && viewing.checked) {
      return viewing.value;
    }
    if (details && details.checked) {
      return details.value;
    }
    return null;
  }

  sendRequest(event) {
    event.preventDefault();
    event.stopPropagation();

    let contactType = this.getContactType();
    let agent = this.props.home.agents[0] || null;

    let props = {
      sender: {
        name: React.findDOMNode(this.refs.name).value,
        email: React.findDOMNode(this.refs.email).value
      },
      type: 'email',
      subType: contactType,
      message: React.findDOMNode(this.refs.message).value,
      agent: agent,
      home: this.props.home.id,
      tags: ['contact', 'email', `home:${this.props.home.id}`]
    };

    if (!props.sender.name) {
      return this.setState({
        error: {
          message: 'Name is required'
        }
      });
    }

    if (!props.sender.email) {
      return this.setState({
        error: {
          message: 'Email is required'
        }
      });
    }
    ContactActions.createItem(props);
  }

  handleErrorState() {
    if (!this.state.error) {
      return null;
    }

    return (
      <p className='error'>{this.state.error.message}</p>
    );
  }

  render() {
    if (this.props.context) {
      this.context = this.props.context;
    }

    let error = this.handleErrorState();

    if (this.state.contact) {
      if (typeof this.props.onClose === 'function') {
        setTimeout(() => {
          this.props.onClose();
        }, 3000);
      }
      return (
        <ContentBlock className='home contact-form'>
          <h2>Your message was received</h2>
          <p className='centered'>
            We thank you for your message and will get back at you promptly!
          </p>
        </ContentBlock>
      );
    }
    debug('home', this.props.home);

    return (
      <ContentBlock className='home contact-form'>
        <h2>Home details</h2>
        {error}
        <form method='post' onSubmit={this.sendRequest}>
          <div className='form'>
            <label className='control'>
              <input
                type='text'
                name='name'
                placeholder='Your name'
                ref='name'
                required
              />
            </label>

            <label className='control'>
              <input
                type='email'
                name='email'
                placeholder='myname@example.com'
                required
                ref='email'
              />
            </label>

            <Columns cols={2} className='control-group'>
              <label className='control radio'>
                <input type='radio' name='subType' value='Details requested' ref='subTypeDetails' defaultChecked /> Request details
              </label>
              <label className='control radio'>
                <input type='radio' name='subType' value='Arrange viewing' ref='subTypeViewing' /> Arrange viewing
              </label>
            </Columns>

            <label className='control'>
              <textarea name='message' ref='message' placeholder='Type your message here'></textarea>
            </label>
          </div>
          <div className='buttons'>
            <input type='submit' className='button' value='Send message' />
          </div>
        </form>
      </ContentBlock>
    );
  }
}
