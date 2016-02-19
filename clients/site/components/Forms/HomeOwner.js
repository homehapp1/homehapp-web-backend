import React from 'react';

import Columns from '../../../common/components/Widgets/Columns';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';

import ContactStore from '../../stores/ContactStore';
import ContactActions from '../../actions/ContactActions';
let debug = require('debug')('HomeContact');

export default class HomeContact extends React.Component {
  static propTypes = {
    context: React.PropTypes.object,
    onClose:  React.PropTypes.func
  }

  static contextTypes = {
    router: React.PropTypes.func,
    onClose: null
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

    let props = {
      sender: {
        name: React.findDOMNode(this.refs.name).value,
        email: React.findDOMNode(this.refs.email).value
      },
      type: 'email',
      subType: contactType,
      message: React.findDOMNode(this.refs.message).value,
      tags: ['contact', 'email', contactType]
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
    return (
      <ContentBlock className='contact-form'>
        <h2>Contact us concering your home</h2>
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
                <input type='radio' name='subType' value='let' ref='subTypeDetails' defaultChecked /> Home to let
              </label>
              <label className='control radio'>
                <input type='radio' name='subType' value='sell' ref='subTypeViewing' /> Home for sale
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
