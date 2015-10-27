import React from 'react';
import { setFullHeight } from '../../Helpers';
import ContentBlock from './ContentBlock';
import Icon from './Icon';

let debug = require('debug')('Attachments');

export default class Attachments extends React.Component {
  static propTypes = {
    attachments: React.PropTypes.array,
    className: React.PropTypes.string
  }

  static defaultProps = {
    attachments: [],
    className: null
  }

  render() {
    if (!this.props.attachments.length) {
      debug('No attachments provided for Attachments widget');
      return null;
    }

    let classes = ['attachments', 'pattern'];

    if (this.props.className) {
      classes.push(this.props.className);
    }

    return (
      <ContentBlock className={classes.join(' ')}>
        {
          this.props.attachments.map((attachment, index) => {
            return (
              <div className='attachment' key={`Attachments-attachment-${index}`}>
                <a target='_blank' href={attachment.url}>
                  <Icon type={attachment.type} className='large' />
                  <span className='label'>{attachment.label}</span>
                </a>
              </div>
            );
          })
        }
      </ContentBlock>
    );
  }
}
