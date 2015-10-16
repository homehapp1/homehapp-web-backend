'use strict';

import React from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Table from 'react-bootstrap/lib/Table';
import ListItem from './ListItem';
import CreateEdit from './CreateEdit';

export default class AgentsList extends React.Component {
  static propTypes = {
    items: React.PropTypes.array.isRequired
  }

  state = {
    underEdit: null
  }

  constructor(props) {
    super(props);
  }

  onItemSelected(item) {
    console.log('onItemSelected', item);
    this.setState({
      underEdit: item
    });
  }

  onItemSaved() {
    window.location.reload();
  }

  render() {
    let editorBlock = null;

    if (this.state.underEdit) {
      editorBlock = (
        <Panel bsStyle='info' header='Edit Agent'>
          <CreateEdit
            model={this.state.underEdit}
            onSave={this.onItemSaved.bind(this)}
            onCancel={() => {
              this.setState({underEdit: null});
            }}
          />
        </Panel>
      );
    }

    return (
      <Row>
        <h1><i className='fa fa-user'></i> {this.props.items.length} agents</h1>

        <Table striped hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Agency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {this.props.items.map((item, i) => {
              return (
                <ListItem
                  key={item.id}
                  item={item}
                  onSelected={this.onItemSelected.bind(this)} />
              );
            })}
          </tbody>
        </Table>

        {editorBlock}

      </Row>
    );
  }
}
