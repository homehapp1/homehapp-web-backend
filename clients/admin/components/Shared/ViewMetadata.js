import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import InputWidget from '../Widgets/Input';

let debug = require('../../../common/debugger')('ViewMetadata');

export default class ViewMetadata extends React.Component {
  static propTypes = {
    object: React.PropTypes.object.isRequired
  }

  createdBy() {
    if (!this.props.object.createdBy) {
      return null;
    }

    return (
      <InputWidget
        type='text'
        label='Created by'
        defaultValue={this.props.object.createdBy.name}
        readOnly
        />
    );
  }

  updatedBy() {
    if (!this.props.object.updatedBy) {
      return null;
    }

    return (
      <InputWidget
        type='text'
        label='Updated by'
        defaultValue={this.props.object.updatedBy.name}
        readOnly
        />
    );
  }

  render() {
    if (!this.props.object) {
      return null;
    }
    debug('Metadata object', this.props.object);

    return (
      <Row>
        <Col>
          <Panel header='Editing statistics'>
            {this.createdBy()}
            <InputWidget
              type='text'
              label='Created at'
              defaultValue={this.props.object.createdAt.toString()}
              readOnly
              />
            {this.updatedBy()}
            <InputWidget
              type='text'
              label='Last updated at'
              defaultValue={this.props.object.updatedAt.toString()}
              readOnly
              />
          </Panel>
        </Col>
      </Row>
    );
  }
}
