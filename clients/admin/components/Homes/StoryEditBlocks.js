'use strict';

import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Input from 'react-bootstrap/lib/Input';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import AdminContentBlock from '../Widgets/ContentBlock';
import AdminBigImage from '../Widgets/BigImage';
import AdminContentImage from '../Widgets/ContentImage';
import AdminBigVideo from '../Widgets/BigVideo';
import AdminGallery from '../Widgets/Gallery';
import AdminLargeText from '../Widgets/LargeText';
import {moveToIndex} from '../../../common/Helpers';

export default class StoryEditBlocks extends React.Component {
  static propTypes = {
    blocks: React.PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state.blocks = props.blocks;
    //console.log('StoryEditBlocks', props);
  }

  componentDidMount() {
    //console.log('StoryEditBlocks:componentDidMount');
  }

  componentWillUnmount() {
  }

  state = {
    blocks: []
  };

  getBlocks() {
    let updatedBlocks = this.state.blocks;
    this.state.blocks.map((item, index) => {
      let newProps = this.refs[`block${index}`].getValues();
      updatedBlocks[index].properties = newProps;
    });

    this.setState({
      blocks: updatedBlocks
    });

    return updatedBlocks;
  }

  onAddBlock() {
    let blockTemplate = this.refs.blockTemplate.getValue();
    if (!blockTemplate) {
      return;
    }
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
          onClick={() => {
            this.onReArrangeItem(index, 'up');
          }}
        >
          <i className='fa fa-arrow-up'></i>
        </Button>
      );
    }

    if (index < this.state.blocks.length - 1) {
      downButton = (
        <Button
          bsSize='small'
          onClick={() => {
            this.onReArrangeItem(index, 'down');
          }}
        >
          <i className='fa fa-arrow-down'></i>
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
            onClick={() => {
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
    return (
      <AdminBigImage {...item.properties} ref={'block' + index} />
    );
  }

  getContentImage(item, index) {
    return (
      <AdminContentImage {...item.properties} ref={'block' + index} />
    );
  }

  getContentBlock(item, index) {
    return (
      <AdminContentBlock {...item.properties} ref={'block' + index} />
    );
  }

  getGallery(item, index) {
    return (
      <AdminGallery {...item.properties} ref={'block' + index} />
    );
  }

  getBigVideo(item, index) {
    return (
      <AdminBigVideo {...item.properties} ref={'block' + index} />
    );
  }

  getLargeText(item, index) {
    return (
      <AdminLargeText {...item.properties} ref={'block' + index} />
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
                name='blockTemplate'
                ref='blockTemplate'
              >
                <option value=''>Choose template to use</option>
                <option value='BigImage'>Big Image</option>
                <option value='BigVideo'>Big Video</option>
                <option value='ContentBlock'>Content Block</option>
                <option value='ContentImage'>Content Image</option>
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
              let editor = this[method](item, index);
              return (
                <Panel
                  key={'b-' + index}
                  header={this.getBlockHeader(item, index)}
                >
                  {editor}
                </Panel>
              );
            }

            console.warn(`No method ${method} defined, cannot get story block with type ${item.template}`);
          })
        }
      </div>
    );
  }
}
