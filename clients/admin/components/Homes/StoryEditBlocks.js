'use strict';

import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Input from 'react-bootstrap/lib/Input';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import AdminLargeText from '../Widgets/LargeText';
import AdminBigImage from '../Widgets/BigImage';
import {moveToIndex} from '../../../common/Helpers';

export default class StoryEditBlocks extends React.Component {
  static propTypes = {
    blocks: React.PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state.blocks = props.blocks;
  }

  state = {
    blocks: []
  };

  onAddBlock() {
    let blockTemplate = this.refs.blockTemplate.getValue();
    this.state.blocks.push({
      template: blockTemplate,
      properties: {}
    });
    this.setState({
      blocks: this.state.blocks
    });
  }

  onReArrangeItem(index, dir) {
    let newIndex = index;
    if (dir === 'down') {
      newIndex += 1;
    } else {
      newIndex -= 1;
    }

    this.state.blocks = moveToIndex(this.state.blocks, index, newIndex);

    this.setState({
      blocks: this.state.blocks
    });
  }

  onRemoveBlock(index) {
    let newBlocks = [];
    this.state.blocks.forEach((block, idx) => {
      if (idx !== index) {
        newBlocks.push(block);
      }
    });
    this.setState({
      blocks: newBlocks
    });
  }

  getSortingButtons(index) {
    let upButton = null;
    let downButton = null;

    if (index > 0) {
      upButton = (
        <Button
          bsSize='small'
          onClick={(event) => {
            this.onReArrangeItem(index, 'up');
          }}
        >
          <Glyphicon glyph='arrow-up'/>
        </Button>
      );
    }

    if (index < this.state.blocks.length - 1) {
      downButton = (
        <Button
          bsSize='small'
          onClick={(event) => {
            this.onReArrangeItem(index, 'down');
          }}
        >
          <Glyphicon glyph='arrow-down'/>
        </Button>
      );
    }

    return (
      <ButtonGroup>
        {upButton}
        {downButton}
      </ButtonGroup>
    );
  }

  getBlockHeader(item, index) {
    let header = (
      <div>
        <span>{index + 1} {item.template}</span>
        <div className='pull-right'>
          {this.getSortingButtons(index)}
          <Button
            bsStyle='danger'
            bsSize='small'
            onClick={(event) => {
              this.onRemoveBlock(index);
            }}
          >
            Remove
          </Button>
        </div>
      </div>
    );
    return header;
  }

  getBigImage(item, index) {
    let primary = null;
    let secondary = null;

    return (
      <Panel header={this.getBlockHeader(item, index)} key={index}>
        <AdminBigImage {...item.properties}>
        </AdminBigImage>
      </Panel>
    );
  }

  getContentBlock(item, index) {
    return (
      <Panel header={this.getBlockHeader(item, index)} key={index}>
        Content block
      </Panel>
    );
  }

  getGallery(item, index) {
    return (
      <Panel header={this.getBlockHeader(item, index)} key={index}>
        Gallery block
      </Panel>
    );
  }

  render() {
    return (
      <div className='edit-story'>
        <Input label='Add Block' wrapperClassName='addWrapper'>
          <Row>
            <Col md={6} sm={6}>
              <Input
                type='select'
                ref='blockTemplate'
              >
                <option value=''>Choose template to use</option>
                <option value='BigImage'>Big Image</option>
                <option value='ContentBlock'>Content Block</option>
                <option value='Gallery'>Gallery</option>
              </Input>
            </Col>
            <Col md={6} sm={6}>
              <Button
                bsStyle='success'
                onClick={this.onAddBlock.bind(this)}
              >
                Add
              </Button>
            </Col>
          </Row>
        </Input>
        {
          this.state.blocks.map((item, index) => {
            let method = `get${item.template}`;

            if (typeof this[method] === 'function') {
              return this[method](item, index);
            }

            console.warn(`No method ${method} defined, cannot get story block with type ${item.template}`);
          })
        }
      </div>
    );
  }
}
