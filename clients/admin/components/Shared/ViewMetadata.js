import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Well from 'react-bootstrap/lib/Well';
import Button from 'react-bootstrap/lib/Button';
import InputWidget from '../Widgets/Input';

let debug = require('../../../common/debugger')('ViewMetadata');

export default class ViewMetadata extends React.Component {
  static propTypes = {
    object: React.PropTypes.object.isRequired,
    store: React.PropTypes.object,
    actions: React.PropTypes.object
  }

  static defaultProps = {
    store: null,
    actions: null
  }

  constructor() {
    super();
    this.storeListener = this.onStoreChange.bind(this);
  }

  componentDidMount() {
    if (this.props.store && typeof this.props.store.listen === 'function') {
      this.props.store.listen(this.storeListener);
    } else {
      debug('No store provided for this object, use readonly mode');
    }
  }

  componentWillUnmount() {
    if (this.props.store && typeof this.props.store.unlisten === 'function') {
      this.props.store.unlisten(this.storeListener);
    }
  }

  onStoreChange(store) {
    this.setState(store);
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

  onSave() {
    let data = {
      id: this.props.object.id,
      metadata: {
        description: this.refs.description.getValue()
      }
    };

    this.saveMetadata(data);
  }

  saveMetadata(data) {
    if (typeof this.props.actions.updateItem === 'function') {
      debug('Default save metadata called with data', data);
      this.props.actions.updateItem(data);
    } else {
      debug('No actions provided, cannot save');
    }
  }

  render() {
    if (!this.props.object) {
      return null;
    }
    debug('Metadata object', this.props.object);

    let save = null;

    if (this.props.object.id && this.props.actions) {
      save = (
        <Well>
          <Row>
            <Col md={6}>
              <Button bsStyle='success' accessKey='s' onClick={this.onSave.bind(this)}>Save</Button>
            </Col>
          </Row>
        </Well>
      );
    }

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
          <Panel header='Description'>
            <InputWidget
              type='textarea'
              label='Meta description'
              ref='description'
              defaultValue={this.props.object.metadata.description}
              readOnly={(this.props.store) ? false : true}
              placeholder='A brief description of the object'
              />
          </Panel>
          {save}
        </Col>
      </Row>
    );
  }
}
