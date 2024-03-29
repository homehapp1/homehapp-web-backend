import React from 'react';
import InputWidget from '../Widgets/Input';
import NeighborhoodListStore from '../../stores/NeighborhoodListStore';

let debug = require('debug')('NeighborhoodSelect');

export default class NeighborhoodSelect extends React.Component {
  static propTypes = {
    selected: React.PropTypes.oneOfType([
      React.PropTypes.null,
      React.PropTypes.object
    ]),
    onChange: React.PropTypes.func
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
    this.selected = null;
  }

  state = {
    error: null,
    neighborhoods: []
  }

  componentDidMount() {
    NeighborhoodListStore.listen(this.storeListener);

    setTimeout(() => {
      NeighborhoodListStore.fetchItems();
    }, 100);
  }

  componentWillUnmount() {
    NeighborhoodListStore.unlisten(this.storeListener);
  }

  onChange(state) {
    debug('onChange', state);
    this.setState({
      neighborhoods: NeighborhoodListStore.getState().items
    });
  }

  isSelected(neighborhood) {
    return !!(this.props.selected && String(this.props.selected.id) === String(neighborhood.id));
  }

  getValue() {
    if (this.selected) {
      return this.selected.id;
    }
    return null;
  }

  updateSelected() {
    let selected = this.refs.neighborhoodSelect.getValue();
    this.selected = null;
    for (let neighborhood of this.state.neighborhoods) {
      if (neighborhood.id === selected) {
        this.selected = neighborhood;
        if (typeof this.props.onChange === 'function') {
          this.props.onChange(neighborhood);
        }
        break;
      }
    }
  }

  render() {
    let neighborhoods = [
      {
        id: '',
        title: 'Select one (optional)'
      }
    ];
    let selected = null;

    if (this.props.selected) {
      neighborhoods.push(this.props.selected);
      selected = this.props.selected.id;
    }

    for (let neighborhood of this.state.neighborhoods) {
      if (neighborhoods.indexOf(neighborhood) === -1) {
        neighborhoods.push(neighborhood);
      }
    }

    return (
      <InputWidget
        type='select'
        ref='neighborhoodSelect'
        label='Neighborhood'
        defaultValue={selected}
        onChange={this.updateSelected.bind(this)}>
        {neighborhoods.map((neighborhood, index) => {
          let opts = {
            value: neighborhood.id
          };
          return (
            <option {...opts} key={'nhs-' + index}>{neighborhood.title}</option>
          );
        })}
      </InputWidget>
    );
  }
}
