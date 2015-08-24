'use strict';

import React from 'react';
import DOMManipulator from '../../DOMManipulator';

class Modal extends React.Component {
  static propTypes = {
    children: React.PropTypes.object
  }

  constructor() {
    super();
    this.removeModal = this.removeModal.bind(this);
    this.body = null;
  }

  componentDidMount() {
    this.refs.modal.getDOMNode().addEventListener('click', this.removeModal, false);
    this.body = new DOMManipulator(document.getElementsByTagName('body')[0]);
    this.body.addClass('no-scroll');
  }

  componentWillUnmount() {
    if (this.refs.modal) {
      this.refs.modal.getDOMNode().removeEventListener('click', this.removeModal, false);
    }

    if (this.body.getByClass('modal-wrapper').length <= 1) {
      this.body.removeClass('no-scroll');
    }
  }

  removeModal(e) {
    for (let i = 0; i < e.path.length; i++) {
      if (e.path[i].className === 'modal-content') {
        return true;
      }
    }

    let node = this.refs.modal.getDOMNode();
    React.unmountComponentAtNode(node);
    this.componentWillUnmount();
    node.parentNode.removeChild(node);
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  render() {
    return (
      <div className='modal-wrapper' ref='modal'>
        <div className='modal-close'><i className='fa fa-close'></i></div>
        <div className='modal-container'>
          <div className='modal-content' ref='content'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
