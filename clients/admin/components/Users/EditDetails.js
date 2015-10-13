'use strict';

import React from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import UserStore from '../../stores/UserStore';
import UserActions from '../../actions/UserActions';
import { merge, createNotification } from '../../../common/Helpers';
import EditDetails from '../Shared/EditDetails';

let debug = require('../../../common/debugger')('UsersEditDetails');

export default class UsersEditDetails extends EditDetails {
  static propTypes = {
    user: React.PropTypes.object.isRequired,
    context: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.func
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onUserStoreChange.bind(this);
    debug('Constructor', this);
  }

  state = {
    error: null
  }

  componentDidMount() {
    UserStore.listen(this.storeListener);
  }

  componentWillUnmount() {
    UserStore.unlisten(this.storeListener);
  }

  onUserStoreChange(state) {
    debug('onUserStoreChange', state);
    this.setState(state);
  }

  onFormChange(/*event*/) {
    // let {type, target} = event;
    // TODO: Validation could be done here
    //debug('onFormChange', event, type, target);
    //this.props.user.facilities = this.refs.facilities.getValue().split("\n");
  }

  verifyPassword(userProps) {
    let password = this.refs.password.getValue();

    // User exists, no password change requested
    if (userProps.id && !password) {
      return true;
    }

    if (password !== this.refs.password2.getValue()) {
      createNotification({
        message: 'Password mismatch',
        type: 'danger',
        duration: 5
      });
      return false;
    }

    if (password.length < 8) {
      createNotification({
        message: 'Please use at least 8 characters for your password',
        type: 'danger',
        duration: 5
      });
      return false;
    }
    userProps.password = password;
    return true;
  }

  onSave() {
    debug('Save');

    let id = null;
    if (this.props.user) {
      id = this.props.user.id;
    }

    let userProps = {
      id: id,
      firstname: this.refs.firstname.getValue(),
      lastname: this.refs.lastname.getValue(),
      username: this.refs.username.getValue(),
      email: this.refs.email.getValue().toLowerCase()
    };

    if (!this.verifyPassword(userProps)) {
      debug('Password verification failed');
      return null;
    }

    debug('userProps', userProps);
    this.saveUser(userProps);
  }

  saveUser(userProps) {
    debug('saveUser', userProps);
    if (userProps.id) {
      return UserActions.updateItem(userProps);
    }
    return UserActions.createItem(userProps);
  }

  onCancel() {
    React.findDOMNode(this.refs.userDetailsForm).reset();
  }

  render() {
    this.handleErrorState();
    if (UserStore.isLoading()) {
      this.handlePendingState();
    }
    let user = merge({
      firstname: null,
      lastname: null,
      email: null,
      password: null,
      username: null
    }, this.props.user || {});

    let deleteLink = null;
    if (this.props.user) {
      deleteLink = (<Link to='userDelete' params={{id: this.props.user.id}} className='pull-right btn btn-danger btn-preview'>Delete</Link>);
    }
    debug('Render', user);
    //debug('Neighborhood of this user', this.props.userLocation.neighborhood);

    return (
      <Row>
        <form name='userDetails' ref='userDetailsForm' method='POST'>
          <Col md={10} sm={10}>
            <Panel header='Common'>
              <Input
                type='text'
                ref='firstname'
                label='Firstname'
                placeholder='Firstname'
                required
                defaultValue={user.firstname}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                ref='lastname'
                label='Lastname'
                placeholder='Lastname'
                required
                defaultValue={user.lastname}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='email'
                ref='email'
                label='Email'
                placeholder='myname@example.co.uk'
                required
                defaultValue={user.email}
                onChange={this.onFormChange.bind(this)}
              />
            </Panel>
            <Panel header='Login credentials'>
              <Input
                type='email'
                ref='username'
                label='Username'
                placeholder='myname@example.co.uk'
                defaultValue={user.username}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='password'
                ref='password'
                label='Password'
                placeholder='My very strong and secret password'
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='password'
                ref='password2'
                label='Retype the password'
                placeholder='Retype your password'
                onChange={this.onFormChange.bind(this)}
              />
            </Panel>
            <Well>
              <Row>
                <Col md={6}>
                  <Button bsStyle='success' accessKey='s' onClick={this.onSave.bind(this)}>Save</Button>
                </Col>
                <Col md={6} pullRight>
                  {deleteLink}
                </Col>
              </Row>
            </Well>
          </Col>
        </form>
      </Row>
    );
  }
}
