'use strict';

import React from 'react';
import Input from 'react-bootstrap/lib/Input';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import AdminContentBlock from '../Widgets/ContentBlock';
import AdminBigImage from '../Widgets/BigImage';
import AdminContentImage from '../Widgets/ContentImage';
import AdminBigVideo from '../Widgets/BigVideo';
import AdminGallery from '../Widgets/Gallery';
import AdminLargeText from '../Widgets/LargeText';
import {moveToIndex} from '../../../common/Helpers';

let debug = require('debug')('StoryEditBlocks');

export default class StoryEditBlocks extends React.Component {
  static propTypes = {
    blocks: React.PropTypes.array.isRequired,
    parent: React.PropTypes.object
  };
  static defaultProps = {
    parent: null
  }

  constructor(props) {
    super(props);
    this.state.blocks = props.blocks;
    this.iterator = 0;
    //console.log('StoryEditBlocks', props);
  }

  state = {
    blocks: []
  }

  componentDidMount() {
    //console.log('StoryEditBlocks:componentDidMount');
  }

  componentWillUnmount() {
  }

  getBlocks() {
    let updatedBlocks = this.state.blocks;
    debug('this.state.blocks', this.state.blocks, this.refs);
    this.state.blocks.map((item, index) => {
      debug('Read block', index);
      if (typeof this.refs[`block${index}`] === 'undefined') {
        return null;
      }
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
    try {
      this.refs.blockTemplate.getInputDOMNode().value = '';
    } catch (error) {
      debug('Failed to set the option to empty after the template was selected');
    }
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
      <AdminGallery {...item.properties} ref={'block' + index} parent={this.props.parent} />
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
    this.iterator++;
    debug('Iteration', this.iterator, this.state.blocks[1].properties, this.state.blocks[2].properties);
    return (
      <div className='edit-story'>
        {
          this.state.blocks.map((item, index) => {
            let method = `get${item.template}`;

            if (typeof this[method] === 'function') {
              let editor = this[method](item, index);
              return (
                <Panel
                  key={`b-${index}-${this.iterator}`}
                  header={this.getBlockHeader(item, index)}
                >
                  {editor}
                </Panel>
              );
            }

            console.warn(`No method ${method} defined, cannot get story block with type ${item.template}`);
          })
        }
        <hr />
        <Panel header='Add a new block'>
          <Input
            type='select'
            name='blockTemplate'
            ref='blockTemplate'
            onChange={this.onAddBlock.bind(this)}
          >
            <option value=''>Choose template to use</option>
            <option value='BigImage'>Big Image</option>
            <option value='BigVideo'>Video block</option>
            <option value='ContentBlock'>Content Block</option>
            <option value='ContentImage'>Content Image</option>
            <option value='Gallery'>Gallery</option>
          </Input>
        </Panel>
      </div>
    );
  }
}
