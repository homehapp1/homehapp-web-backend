import React from 'react';
import Input from 'react-bootstrap/lib/Input';
import Alert from 'react-bootstrap/lib/Alert';
let debug = require('debug')('InputWidget');

export default class InputWidget extends Input {
  static propTypes = {
    ...Input.propTypes,
    validate: React.PropTypes.func,
    type: React.PropTypes.string,
    hasFeedback: React.PropTypes.bool,
    required: React.PropTypes.bool,
    defaultValue: React.PropTypes.oneOfType([
      React.PropTypes.null,
      React.PropTypes.bool,
      React.PropTypes.number,
      React.PropTypes.string,
      React.PropTypes.array,
      React.PropTypes.object
    ]),
    value: React.PropTypes.oneOfType([
      React.PropTypes.null,
      React.PropTypes.bool,
      React.PropTypes.number,
      React.PropTypes.string,
      React.PropTypes.array,
      React.PropTypes.object
    ]),
    pattern: React.PropTypes.string,
    patternError: React.PropTypes.string
  }

  constructor(props) {
    super(props);
    this.pristine = true;
    this.valid = true;
    this.inputChanged = this.inputChanged.bind(this);
    this.message = null;
    this.initialValue = null;
  }

  state = {
    error: null
  }

  componentDidMount() {
    if (super.componentDidMount) {
      super.componentDidMount();
    }
    if (typeof this.props.defaultValue !== 'undefined') {
      this.initialValue = this.props.defaultValue;
    } else if (typeof this.props.value !== 'undefined') {
      this.initialValue = this.props.value;
    } else {
      this.initialValue = null;
    }
    this.bindEvents();
  }

  componentWillReceiveProps() {
    if (super.componentWillReceiveProps) {
      super.componentWillReceiveProps();
    }

    this.inputs = this.bindEvents();
  }

  componentWillUpdate() {
    if (super.componentWillUpdate) {
      super.componentWillUpdate();
    }

    this.inputs = this.bindEvents();
  }

  getValue() {
    let value = super.getValue();
    // @TODO: act as a nice little middleware and format the returned type
    // with a preformatter
    return value;
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

  // Validate email address
  validateEmailInput(value) {
    if (value.match(/^[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&\'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i)) {
      return true;
    }
    throw new Error('Not a valid email address');
  }

  validateNumberInput(value) {
    let number = Number(value);
    if (isNaN(number)) {
      throw new Error('Not a valid number');
    }
    return true;
  }

  checkByType(inputs, value) {
    let type = this.props.type.toString();
    let method = `validate${type.substr(0, 1).toUpperCase()}${type.substr(1)}Input`;

    // Check if there is a validator for the used input type
    if (typeof this[method] !== 'function') {
      return true;
    }

    try {
      this[method](value);
    } catch (error) {
      this.setAsInvalid(inputs);
      this.setState({error: error.toString()});
      return false;
    }

    return true;
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
      this.message = this.props.patternError || 'Pattern match failed';
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
    if (this.initialValue === this.getValue()) {
      return null;
    }

    // Mark the input as touched
    let inputs = this.getInputs();
    this.pristine = false;
    for (let input of inputs) {
      input.className = input.className.replace(/\bpristine\b/g, 'dirty');

      // Remove the previous validation status
      input.className = input.className.replace(/ ?\b(in)?valid\b/g, '');
    }

    // Validate
    this.isValid();
    this.forceUpdate();
  }

  getInputs() {
    // Skip wrappers
    if (!this.props.type) {
      return [];
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

    if (!this.checkByType(inputs, value)) {
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
