import React from 'react';

// Widgets
import Agents from '../Widgets/Agents';
import Attachments from '../Widgets/Attachments';
import BigImage from '../Widgets/BigImage';
import BigVideo from '../Widgets/BigVideo';
import ContentBlock from '../Widgets/ContentBlock';
import ContentImage from '../Widgets/ContentImage';
import Gallery from '../Widgets/Gallery';
import HTMLContent from '../Widgets/HTMLContent';
import LargeText from '../Widgets/LargeText';
import Map from '../Widgets/Map';
import Markdown from '../Widgets/Markdown';
import Neighborhood from '../Widgets/Neighborhood';
import Separator from '../Widgets/Separator';

let debug = require('../../../common/debugger')('StoryLayout');

export default class StoryLayout extends React.Component {
  static propTypes = {
    blocks: React.PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.blocks = this.validatedBlocks(props.blocks);;
  }

  validatedBlocks(blocks) {
    let validated = [];

    for (let block of blocks) {
      if (!block || !block.template || !block.properties) {
        continue;
      }
      validated.push(block);
    }
    return validated;
  }

  setZ(item, index) {
    item.properties.zIndex = -1 * (this.blocks.length - index);
  }

  getPrevTemplate(index) {
    if (!index) {
      return null;
    }

    return this.blocks[index - 1].template;
  }

  getPrevTemplateClass(index) {
    return 'prev-' + this.normalizeTemplateName(this.getPrevTemplate(index));
  }

  getNextTemplate(index) {
    if (index >= this.blocks.length - 1) {
      return null;
    }

    return this.blocks[index + 1].template;
  }

  getNextTemplateClass(index) {
    return 'next-' + this.normalizeTemplateName(this.getNextTemplate(index));
  }

  setClasses(item, index) {
    if (!index || index >= this.blocks.length - 1) {
      return null;
    }

    let prev = this.getPrevTemplateClass(index);
    let next = this.getNextTemplateClass(index);

    if (!item.properties.className) {
      item.properties.className = '';
    }

    item.properties.className += ` ${prev} ${next}`;
  }

  normalizeTemplateName(name) {
    return name.replace(/([A-Z])/g, function(match, char, index) {
      if (!index) {
        return char.toLowerCase();
      }

      return `-${char.toLowerCase()}`;
    });
  }

  getAgents(item, index) {
    return (<Agents {...item.properties} key={index} />);
  }

  getAttachments(item, index) {
    return (
      <Attachments {...item.properties} key={`AttachmentsWidget-${index}`} />
    );
  }

  getBigImage(item, index) {
    debug('getBigImage', item.properties);
    let primary = null;
    let secondary = null;
    let description = null;
    this.setZ(item, index);

    if (!item.properties.image) {
      console.warn('Tried to display a BigImage without any image', item);
      return null;
    }

    if (item.properties.description) {
      description = (
        <p>{item.properties.description}</p>
      );
    }

    // Is this the primary title?
    if (item.properties.isPageTitle || !index) {
      primary = (<h1>{item.properties.title}</h1>);
    } else {
      primary = (<h2 className='block-title'>{item.properties.title}</h2>);
    }

    if (item.properties.secondary) {
      secondary = (
        <div className='secondary'>{item.properties.secondary}</div>
      );
    }

    return (
      <BigImage {...item.properties} key={index}>
        <LargeText align={item.properties.align} valign={item.properties.valign}>
          {primary}
          {description}
        </LargeText>
        {secondary}
      </BigImage>
    );
  }

  getBigVideo(item, index) {
    debug('getBigVideo', item, index);
    let primary = null;
    let secondary = null;
    let description = null;
    this.setZ(item, index);

    // Is this the primary title?
    if (item.properties.isPageTitle || !index) {
      primary = (<h1>{item.properties.title}</h1>);
    } else {
      primary = (<h2 className='block-title'>{item.properties.title}</h2>);
    }

    if (item.properties.description) {
      description = (
        <p>{item.properties.description}</p>
      );
    }

    if (item.properties.secondary) {
      secondary = (
        <div className='secondary'>{item.properties.secondary}</div>
      );
    }

    return (
      <BigVideo {...item.properties} key={index}>
        <LargeText align={item.properties.align} valign={item.properties.valign}>
          {primary}
          {description}
        </LargeText>
        {secondary}
      </BigVideo>
    );
  }

  getGallery(item, index) {
    debug('getGallery', item.properties);
    return (<Gallery {...item.properties} key={index} />);
  }

  getHTMLContent(item, index) {
    debug('getHTMLContent', item.properties);
    return (<HTMLContent {...item.properties} key={index} />);
  }

  getMap(item, index) {
    debug('getMap', item.properties);
    let content = null;

    if (item.contentBlock) {
      content = item.properties.contentBlock;
    } else if (item.properties.label || item.properties.content) {
      content = (
        <div className='content-wrapper' key={index}>
          <h3>{item.properties.label}</h3>
          {item.properties.content}
        </div>
      );
    }

    if (!content) {
      return (
        <Map {...item.properties} key={index} />
      );
    }

    return (
      <Map {...item.properties} key={index}>
        {content}
      </Map>
    );
  }

  getNeighborhood(item, index) {
    debug('getNeighborhood', item.properties);
    return (
      <Neighborhood {...item.properties} key={index} />
    );
  }

  getContentBlock(item, index) {
    debug('getContentBlock', item.properties);
    let content = null;
    let title = null;

    if (item.properties.title) {
      title = (<h2>{item.properties.title}</h2>);
    }

    if (item.properties.quote) {
      content = (
        <blockquote className='content-wrapper'>
          {title}
          {item.properties.content}
        </blockquote>
      );
    } else {
      content = (
        <div className='content-wrapper'>
          {title}
          {item.properties.content}
        </div>
      );
    }

    return (
      <ContentBlock {...item.properties} key={index} className='text-block'>
        {content}
      </ContentBlock>
    );
  }

  getContentImage(item, index) {
    debug('getContentImage', item.properties);
    if (!item.properties.image) {
      console.warn('Tried to display a getContentImage without any image', item);
      return null;
    }
    let title = (item.properties.title) ? (<h3>{item.properties.title}</h3>) : null;
    let content = (item.properties.description) ? (<div className='content'>{item.properties.description}</div>) : null;

    return (
      <ContentImage image={item.properties.image} imageAlign={item.properties.imageAlign} key={index}>
        {title}
        {content}
      </ContentImage>
    );
  }

  getDetails(item, index) {
    if (!item.properties.home) {
      console.warn('No home delivered to getDetails, return null', item);
      return null;
    }

    let home = item.properties.home;
    let details = null;
    if (home.properties) {
      details = home.properties;
    }
    if (!details && home.amenities && Array.isArray(home.amenities)) {
      details = home.amenities.join(`\n* `);
    }

    if (!details) {
      return null;
    }

    debug('use details', details);
    return (
      <ContentBlock key={index} className='details-view'>
        <h2>Home details</h2>
        <Markdown className='auto-columns'>{details}</Markdown>
      </ContentBlock>
    );
  }

  getSeparator(item, index) {
    return (<Separator {...item.properties} key={index} />);
  }

  render() {
    return (
      <div className='story'>
        {
          this.blocks.map((item, index) => {
            if (!item || !item.template) {
              return null;
            }

            let method = `get${item.template}`;
            this.setClasses(item, index);

            if (typeof this[method] === 'function') {
              debug('Render with', method);
              return this[method](item, index);
            }

            console.warn(`No method ${method} defined, cannot get story block with type ${item.template}`);
          })
        }
      </div>
    );
  }
}
