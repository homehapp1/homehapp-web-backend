import React from 'react';
import { Link } from 'react-router';

// Widgets
import Agents from '../Widgets/Agents';
import BigImage from '../Widgets/BigImage';
import BigVideo from '../Widgets/BigVideo';
import Columns from '../Widgets/Columns';
import ContentBlock from '../Widgets/ContentBlock';
import ContentImage from '../Widgets/ContentImage';
import Gallery from '../Widgets/Gallery';
import Icon from '../Widgets/Icon';
import LargeText from '../Widgets/LargeText';
import Map from '../Widgets/Map';
import Neighborhood from '../Widgets/Neighborhood';
import Separator from '../Widgets/Separator';

let debug = require('../../../common/debugger')('StoryLayout');

export default class StoryLayout extends React.Component {
  static propTypes = {
    blocks: React.PropTypes.array.isRequired
  };

  getAgents(item, index) {
    return (<Agents {...item.properties} key={index} />);
  }

  getBigImage(item, index) {
    debug('getBigImage', item.properties);
    let primary = null;
    let secondary = null;
    let description = null;

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
    return (
      <ContentBlock key={index} className='details-view'>
        <h2>Home details</h2>
        <Columns cols={2}>
          <div className='first'>
            <h3>Accommodation</h3>
            <ul>
              <li>Room list</li>
              <li>lorem ipsum</li>
            </ul>
            <h3>Type</h3>
            <ul>
              <li>Apartment</li>
            </ul>
            <h3>Plot holding type</h3>
            <ul>
              <li>Own</li>
            </ul>
          </div>
          <div className='second'>
            <h3>Amenities</h3>
            <ul>
              <li>List of amenities</li>
              <li>lorem ipsum</li>
            </ul>
            <h3>Construction finished</h3>
            <ul>
              <li>1850</li>
            </ul>
            <h3>Recent renovations</h3>
            <ul>
              <li>Full renovation, 2011</li>
            </ul>
          </div>
        </Columns>
      </ContentBlock>
    );
  }

  getIconList(item, index) {
    return (
      <ContentBlock className='icon-list pattern' key={index}>
        <Columns cols={item.properties.icons.length}>
          {
            item.properties.icons.map((col, ind) => {
              let label = (
                <span>
                  <Icon type={col.icon} className='large' />
                  <span className='label'>{col.label}</span>
                </span>
              );

              if (col.to) {
                link = (
                  <Link to={col.to} params={col.params}>
                    {label}}
                  </Link>
                );
              }

              return (
                <div className='icon-wrapper' key={ind}>
                  {label}
                </div>
              );
            })
          }
        </Columns>
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
          this.props.blocks.map((item, index) => {
            let method = `get${item.template}`;

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
