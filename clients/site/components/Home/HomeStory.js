import React from 'react';

import HomeNavigation from './HomeNavigation';
import StoryBlocks from './StoryBlocks';
import StoryLayout from '../../../common/components/Layout/StoryLayout';
import { setPageTitle } from '../../../common/Helpers';

// let debug = require('debug')('HomeStory');

export default class HomeStory extends StoryBlocks {
  static propTypes = {
    home: React.PropTypes.object.isRequired
  }

  componentDidMount() {
    setPageTitle(this.props.home.homeTitle);
  }

  componentWillUnmount() {
    setPageTitle();
  }

  render() {
    // Create a copy of the blocks array
    let blocks = [].concat(this.props.home.story.blocks);
    blocks = this.prependBlocks(blocks, this.props.home);
    blocks = this.appendBlocks(blocks, this.props.home);

    return (
      <div className='home-view'>
        <HomeNavigation home={this.props.home} />
        <StoryLayout blocks={blocks} />
      </div>
    );
  }
}
