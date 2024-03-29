/*global window */


import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import InputWidget from '../Widgets/Input';

let debug = require('../../../common/debugger')('ContactsViewDetails');

export default class ContactsViewDetails extends React.Component {
  propTypes = {
    contact: React.PropTypes.object.isRequired,
    context: React.PropTypes.object
  }
  render() {
    debug('Render', this.props.contact);
    return (
      <Row>
        <Col md={10} sm={10}>
          <Panel header='Sender'>
            <InputWidget
              type='text'
              label='Sender name'
              readOnly
              defaultValue={this.props.contact.sender.name}
            />
            <InputWidget
              type='email'
              label='Sender email'
              readOnly
              defaultValue={this.props.contact.sender.email}
            />
          </Panel>
          <Panel header='Message'>
            <InputWidget
              type='textarea'
              readOnly
              defaultValue={this.props.contact.message}
            />
          </Panel>
        </Col>
      </Row>
    );
  }
}
