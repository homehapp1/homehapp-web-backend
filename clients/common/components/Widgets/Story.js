'use strict';

import React from 'react';
import { Link } from 'react-router';

// Widgets
import Agent from './Agent';
import BigImage from './BigImage';
import Columns from './Columns';
import ContentBlock from './ContentBlock';
import ContentImage from './ContentImage';
import Gallery from './Gallery';
import Icon from './Icon';
import LargeText from './LargeText';
import Map from './Map';
import Neighborhood from './Neighborhood';
import Separator from './Separator';

export default class Story extends React.Component {
  static propTypes = {
    blocks: React.PropTypes.array.isRequired
  };

  getAgent(item, index) {
    return (<Agent {...item.properties} key={index} />);
  }

  getBigImage(item, index) {
    let primary = null;
    let secondary = null;

    // Is this the primary title?
    if (item.properties.isPageTitle || !index) {
      primary = (<h1>{item.properties.title}</h1>);
    } else {
      primary = (<h2>{item.properties.title}</h2>);
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
        </LargeText>
        {secondary}
      </BigImage>
    );
  }

  getGallery(item, index) {
    return (<Gallery {...item.properties} key={index} />);
  }

  getMap(item, index) {
    let content = null;

    if (item.contentBlock) {
      content = item.properties.contentBlock;
    } else {
      content = (
        <div className='content-wrapper'>
          <h2>{item.properties.label}</h2>
          {item.properties.content}
        </div>
      );
    }

    return (
      <Map {...item.properties} key={index}>
        {content}
      </Map>
    );
  }

  getNeighborhood(item, index) {
    return (
      <Neighborhood {...item.properties} key={index} />
    );
  }

  getContentBlock(item, index) {
    let content = null;

    if (item.properties.quote) {
      content = (
        <blockquote className='content-wrapper'>{item.properties.content}</blockquote>
      );
    } else {
      content = (
        <div className='content-wrapper'>{item.properties.content}</div>
      );
    }

    return (
      <ContentBlock {...item.properties} key={index}>
        {content}
      </ContentBlock>
    );
  }

  getContentImage(item, index) {
    let title = (item.properties.title) ? (<h2>{item.properties.title}</h2>) : null;
    let content = (item.properties.description) ? (<div className='content'>{item.properties.description}</div>) : null;

    return (
      <ContentImage image={item.properties.image} imageAlign={item.properties.imageAlign}>
        {title}
        {content}
      </ContentImage>
    );
  }

  getDetails(item, index) {
    return (
      <ContentBlock key={index} className='details-view'>
        <h2>Property details</h2>
        <Columns cols={2}>
          <div className='left'>
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
          <div className='right'>
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
      <ContentBlock key={index} className='icon-list pattern'>
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
                <div className='icon-wrapper'>
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
              return this[method](item, index);
            }

            console.warn(`No method ${method} defined, cannot get story block with type ${item.template}`);
          })
        }
      </div>
    );
  }
}
