import React from 'react';
import { setFullHeight } from '../../Helpers';
import DOMManipulator from '../../DOMManipulator';

export default class Modal extends React.Component {
  static propTypes = {
    children: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.object
    ]).isRequired,
    onclose: React.PropTypes.func,
    className: React.PropTypes.string
  }

  static defaultProps = {
    onclose: function() {
      console.log('default modal onclose');
    }
  }

  constructor() {
    super();
    this.removeModal = this.removeModal.bind(this);
    this.body = null;
  }

  componentDidMount() {
    React.findDOMNode(this.refs.modal).addEventListener('click', this.removeModal, false);
    React.findDOMNode(this.refs.modal).addEventListener('touch', this.removeModal, false);

    React.findDOMNode(this.refs.close).addEventListener('click', this.removeModal, true);
    React.findDOMNode(this.refs.close).addEventListener('touchstart', this.removeModal, true);

    this.body = new DOMManipulator(document.getElementsByTagName('body')[0]);
    this.body.addClass('no-scroll');
    setFullHeight();
  }

  componentWillUnmount() {
    if (this.refs.modal) {
      React.findDOMNode(this.refs.modal).removeEventListener('click', this.removeModal, false);
      React.findDOMNode(this.refs.modal).removeEventListener('touch', this.removeModal, false);
    }

    if (this.refs.close) {
      React.findDOMNode(this.refs.close).removeEventListener('click', this.removeModal, true);
      React.findDOMNode(this.refs.close).removeEventListener('touchstart', this.removeModal, true);
    }

    if (this.body.getByClass('modal-wrapper').length <= 1) {
      this.body.removeClass('no-scroll');
    }
  }

  removeModal(e) {
    let target = e.target;

    while (target.parentNode.tagName.toLowerCase() !== 'body') {
      if (target.className.match(/modal\-content/)) {
        return true;
      }
      target = target.parentNode;
    }

    this.props.onclose();

    let node = React.findDOMNode(this.refs.modal);
    React.unmountComponentAtNode(node);
    this.componentWillUnmount();
    node.parentNode.removeChild(node);
    e.preventDefault();
    e.stopPropagation();
    return false;
  }

  closeModal() {
    React.findDOMNode(this.refs.close).click();
  }

  render() {
    let classes = ['modal-wrapper'];
    if (this.props.className) {
      classes.push(this.props.className);
    }

    return (
      <div className={classes.join(' ')} ref='modal'>
        <div className='modal-close'><i className='fa fa-close' ref='close'></i></div>
        <div className='modal-container'>
          <div className='modal-content' ref='content'>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
