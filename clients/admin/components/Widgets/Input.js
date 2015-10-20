import React from 'react';
import Input from 'react-bootstrap/lib/Input';
import Alert from 'react-bootstrap/lib/Alert';
let debug = require('debug')('InputWidget');

export default class InputWidget extends Input {
  static propTypes = {
    ...Input.propTypes,
    validate: React.PropTypes.func
  }

  constructor(props) {
    super(props);
    this.pristine = true;
    this.valid = true;
    this.inputChanged = this.inputChanged.bind(this);
    this.message = null;
  }

  state = {
    error: null
  }

  componentDidMount() {
    if (super.componentDidMount) {
      super.componentDidMount();
    }

    debug('componentDidMount');
    this.inputs = this.bindEvents();
  }

  componentWillReceiveProps() {
    if (super.componentWillReceiveProps) {
      super.componentWillReceiveProps();
    }

    debug('componentWillReceiveProps');
    this.inputs = this.bindEvents();
  }

  componentWillUpdate() {
    if (super.componentWillUpdate) {
      super.componentWillUpdate();
    }

    debug('componentWillUpdate');
    this.inputs = this.bindEvents();
  }

  setAsInvalid(inputs) {
    for (let input of inputs) {
      input.className += ' invalid';
    }
  }

  setAsValid(inputs) {
    for (let input of inputs) {
      input.className += ' valid';
    }
  }

  checkRequired(inputs, value) {
    let valid = true;

    if (this.props.required && !value) {
      valid = false;
      debug('isRequired', valid);
    }
    if (!valid) {
      this.setAsInvalid(inputs);
      this.setState({error: 'Required'});
    }
    return valid;
  }

  checkPattern(inputs, value) {
    let valid = true;
    for (let input of inputs) {
      if (!input.pattern) {
        continue;
      }

      let regexp = new RegExp(`^${input.pattern}$`);
      if (!value.match(regexp)) {
        valid = false;
      }
    }

    // Mark each input (there should be only one, but...)
    if (!valid) {
      this.setAsInvalid(inputs);
      this.message = 'Pattern match failed';
      this.setState({error: this.message});
    }

    return valid;
  }

  isInputValid(inputs, value) {
    let valid = true;

    if (typeof this.props.validate === 'function') {
      try {
        valid = this.props.validate(value);

        // Allow returning false (but a thrown error is preferred)
        if (!valid) {
          this.message = 'Validation failed';
          this.setState({error: this.message});
        }
      } catch (error) {
        this.setAsInvalid(inputs);
        this.message = error.toString();
        this.setState({error: this.message});
        valid = false;
      }
    }
    return valid;
  }

  inputChanged() {
    debug('Input changed');
    // Mark the input as touched
    let inputs = this.getInputs();
    this.pristine = false;
    for (let input of inputs) {
      input.className = input.className.replace(/\bpristine\b/g, 'dirty');

      // Remove the previous validation status
      input.className = input.className.replace(/ ?\b(in)?valid\b/g, '');
    }

    // Get the input value given by the react-bootstrap Input
    let value = this.getValue();
    this.isValid();
    this.forceUpdate();
  }

  getInputs() {
    // Skip wrappers
    if (!this.props.type) {
      return null;
    }

    let container = React.findDOMNode(this.refs.container);
    let inputs = [];
    let l = container.getElementsByTagName('input');
    for (let input of l) {
      inputs.push(input);
    }

    l = container.getElementsByTagName('select');
    for (let input of l) {
      inputs.push(input);
    }

    l = container.getElementsByTagName('textarea');
    for (let input of l) {
      inputs.push(input);
    }
    return inputs;
  }

  bindEvents() {
    let inputs = this.getInputs();
    // Rebind change events to all inputs
    for (let input of inputs) {
      input.removeEventListener('change', this.inputChanged);
      input.addEventListener('change', this.inputChanged);
      input.removeEventListener('blur', this.inputChanged);
      input.addEventListener('blur', this.inputChanged);
      if (!input.className.match(/(dirty|pristine)/)) {
        input.className += ' pristine';
      }
    }
  }

  // A method for checking the validity status from
  isValid() {
    let inputs = this.getInputs();
    let value = this.getValue();

    if (!this.checkRequired(inputs, value)) {
      return false;
    }

    if (!this.checkPattern(inputs, value)) {
      return false;
    }

    if (!this.isInputValid(inputs, value)) {
      return false;
    }

    // Remove any pending error
    this.setState({error: null});
    this.setAsValid(inputs);
    return true;
  }

  render() {
    let render = super.render();
    let validationMessage = null;
    let classes = ['input-wrapper'];

    if (this.pristine) {
      classes.push('pristine');
    } else {
      classes.push('dirty');
      this.props.hasFeedback = true;
    }

    if (this.valid && !this.state.error) {
      classes.push('valid');
    } else {
      classes.push('invalid');
    }

    if (this.state.error) {
      debug('Got error', this.state.error);
      // validationMessage = (<span className='help-inline has-error'>{this.state.error}</span>);
      validationMessage = (
        <div className='help-inline has-error'>
          <Alert bsStyle='danger' bsSize='small' closeLabel='×'>{this.state.error}</Alert>
        </div>
      );
      classes.push('has-error');
    }

    return (
      <div className={classes.join(' ')} ref='container'>
        {render}
        {validationMessage}
      </div>
    );
  }
}
