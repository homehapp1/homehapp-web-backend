'use strict';

import React from 'react';

import Columns from '../../../common/components/Widgets/Columns';
import ContentBlock from '../../../common/components/Widgets/ContentBlock';

import ContactStore from '../../stores/ContactStore';
import ContactActions from '../../actions/ContactActions';
let debug = require('debug')('HomeContact');

export default class HomeContact extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired,
    context: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.func
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

  componentWillReceiveProps(props) {
    debug('componentWillReceiveProps', props);
    if (props.home) {
      this.setState({
        currentAttributes: props.home.attributes || {},
        images: props.home.images || []
      });
    }
  }

  onContactStoreChange(state) {
    debug('onContactStoreChange', state);
    this.setState(state);
  }

  sendRequest(event) {
    event.preventDefault();
    event.stopPropagation();

    let contactType = (React.findDOMNode(this.refs.typeDetails)).checked ? (React.findDOMNode(this.refs.typeDetails)).value : (React.findDOMNode(this.refs.typeViewing)).value;
    let agent = this.props.home.agents[0] || null;

    let props = {
      sender: {
        name: React.findDOMNode(this.refs.name).value,
        email: React.findDOMNode(this.refs.email).value
      },
      type: contactType,
      message: React.findDOMNode(this.refs.message).value,
      agent: agent,
      tags: ['contact', 'email', `home:${this.props.home.id}`]
    };
    debug('props', props);
    let rval = ContactActions.createItem(props);
    debug('sendRequest', rval);
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
    let terms = '/404';

    if (this.props.context) {
      this.context = this.props.context;
    }

    if (this.context && this.context.router) {
      terms = this.context.router.makeHref('contentTerms');
    }

    let error = this.handleErrorState();

    if (this.state.contact) {
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
      <ContentBlock className='home contact-form'>
        <h2>Home details</h2>
        {error}
        <form method='post' onSubmit={this.sendRequest}>
          <div className='form'>
            <label className='control'>
              <span className='label'>
                Name
              </span>
              <input
                type='text'
                name='name'
                placeholder='Your name'
                ref='name'
                required
                defaultValue='Arttu Manninen'
              />
            </label>

            <label className='control'>
              <span className='label'>
                Email
              </span>
              <input
                type='email'
                name='email'
                placeholder='myname@example.com'
                required
                ref='email'
                defaultValue='arttu@kaktus.cc'
              />
            </label>

            <span className='label'>
              Type of enquiry
            </span>
            <Columns cols={2} className='control-group'>
              <label className='control radio'>
                <input type='radio' name='type' value='Details requested' ref='typeDetails' defaultChecked /> Request details
              </label>
              <label className='control radio'>
                <input type='radio' name='type' value='Arrange viewing' ref='typeViewing' /> Arrange viewing
              </label>
            </Columns>

            <label className='control'>
              <span className='label'>
                Message
              </span>
              <textarea name='message' ref='message' defaultValue='Lorem ipsum'></textarea>
            </label>
          </div>
          <div className='buttons'>
            <input type='submit' className='button' value='Send message' />
          </div>
          <p className='fineprint'>
            By submitting this form you accept our <a href={terms}>Terms of use</a>
          </p>
        </form>
      </ContentBlock>
    );
  }
}
