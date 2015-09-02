'use strict';

import React from 'react';

class Pager extends React.Component {
  static propTypes = {
    onchange: React.PropTypes.func.isRequired,
    onclose: React.PropTypes.func
  };

  constructor() {
    super();
    this.onclick = this.onclick.bind(this);
    this.onkeyb = this.onkeyb.bind(this);
  }

  componentDidMount() {
    this.prev = this.refs.prev.getDOMNode();
    this.next = this.refs.next.getDOMNode();
    this.pager = this.refs.pager.getDOMNode();

    this.prev.addEventListener('click', this.onclick, true);
    this.prev.addEventListener('touchstart', this.onclick, true);
    this.next.addEventListener('click', this.onclick, true);
    this.next.addEventListener('touchstart', this.onclick, true);

    this.pager.addEventListener('keydown', this.onkeyb, true);
    this.pager.focus();
  }

  componentWillUnmount() {
    this.prev.removeEventListener('click', this.onclick, true);
    this.prev.removeEventListener('touchstart', this.onclick, true);
    this.next.removeEventListener('click', this.onclick, true);
    this.next.removeEventListener('touchstart', this.onclick, true);
    this.pager.removeEventListener('keydown', this.onkeyb, true);
  }

  onclick(e) {
    e.preventDefault();
    let dir = (e.target.className.match(/\bnext\b/)) ? 1 : -1;
    this.props.onchange(dir);
  }

  onkeyb(e) {
    switch (e.keyCode) {
      case 27:
        // Handle closing somehow
        if (typeof this.props.onclose === 'function') {
          this.props.onclose();
        }
        break;

      case 37:
        this.props.onchange(-1);
        break;

      case 39:
        this.props.onchange(1);
        break;
    }
  }

  render() {
    return (
      <div className='pager' ref='pager' tabIndex='-1'>
        <a className='prev fa fa-angle-left' ref='prev'></a>
        <a className='next fa fa-angle-right' ref='next'></a>
      </div>
    );
  }
}

export default Pager;
