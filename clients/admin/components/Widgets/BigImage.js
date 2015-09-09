'use strict';

import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Table from 'react-bootstrap/lib/Table';
import Input from 'react-bootstrap/lib/Input';
import BigImage from '../../../common/components/Widgets/BigImage';

export default class AdminBigImage extends BigImage {
  onFormChange(event) {

  }

  render() {
    return (
      <Row>
        <Col md={10} sm={10}>
          <Table>
            <thead>
              <tr>
                <th>Property</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Title</th>
                <td>
                  <Input
                    type='text'
                    ref='title'
                    placeholder='Title (optional)'
                    defaultValue={this.props.title}
                    onChange={this.onFormChange.bind(this)}
                  />
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    );
  }
}
