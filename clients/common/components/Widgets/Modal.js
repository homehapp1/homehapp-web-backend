'use strict';

import React from 'react';
import DOMManipulator from '../../DOMManipulator';

class Modal extends React.Component {
  constructor() {
    super();
    this.removeModal = this.removeModal.bind(this);
    this.jailGuard = this.jailGuard.bind(this);
    this.body = null;
  }

  componentDidMount() {
    this.refs.modal.getDOMNode().addEventListener('click', this.removeModal, false);
    this.refs.content.getDOMNode().addEventListener('click', this.jailGuard, true);

    this.body = new DOMManipulator(document.getElementsByTagName('body')[0]);
    this.body.addClass('no-scroll');
  }

  componentWillUnmount() {
    console.log('Modal.componentWillUnmount');
    this.refs.modal.getDOMNode().removeEventListener('click', this.removeModal, false);
    this.refs.content.getDOMNode().removeEventListener('click', this.jailGuard, true);

    if (this.body.getByClass('modal-wrapper').length <= 1) {
      this.body.removeClass('no-scroll');
    }
  }

  removeModal(e) {
    let node = this.refs.modal.getDOMNode().parentNode;
    React.unmountComponentAtNode(node);
    this.componentWillUnmount();
    node.removeChild(node);
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  jailGuard(e) {
    e.stopPropagation();
  }

  render() {
    return (
      <div className='modal-wrapper' ref='modal'>
        <div className='modal-close'></div>
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
