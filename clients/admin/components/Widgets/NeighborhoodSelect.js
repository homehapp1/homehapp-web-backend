import React from 'react';
import Input from 'react-bootstrap/lib/Input';
import NeighborhoodListStore from '../../stores/NeighborhoodListStore';
let debug = require('../../../common/debugger')('NeighborhoodSelect');

export default class NeighborhoodSelect extends React.Component {
  static propTypes = {
    selected: React.PropTypes.oneOfType([
      React.PropTypes.null,
      React.PropTypes.object
    ])
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
    this.selected = null;
    this.updateSelected = this.updateSelected.bind(this);
  }

  state = {
    error: null,
    neighborhoods: []
  };

  componentDidMount() {
    NeighborhoodListStore.listen(this.storeListener);
    debug('NeighborhoodListStore', NeighborhoodListStore);
    NeighborhoodListStore.fetchNeighborhoods();
  }

  componentWillUnmount() {
    NeighborhoodListStore.unlisten(this.storeListener);
  }

  onChange(state) {
    debug('state', state, NeighborhoodListStore.getState());
    this.setState({
      error: NeighborhoodListStore.getState().error,
      neighborhoods: NeighborhoodListStore.getNeighborhood()
    });
  }

  isSelected(neighborhood) {
    return !!(this.props.selected && String(this.props.selected.id) === String(neighborhood.id));
  }

  getValue() {
    if (this.selected) {
      debug('getValue', this.selected.id);
      return this.selected.id;
    }
    return null;
  }

  updateSelected() {
    let selected = this.refs.neighborhoodSelect.getValue();
    debug('Got value', selected);
    this.selected = null;
    for (let neighborhood of this.neighborhoods) {
      if (neighborhood.id === selected) {
        this.selected = neighborhood;
      }
    }
    debug('Set selected', this.selected);
  }

  render() {
    this.neighborhoods = [
      {
        id: '',
        title: ''
      }
    ];
    let selected = '';

    if (this.props.selected) {
      this.neighborhoods.push(this.props.selected);
      selected = this.props.selected.id;
    }

    for (let neighborhood of this.state.neighborhoods) {
      if (this.neighborhoods.indexOf(neighborhood) === -1) {
        this.neighborhoods.push(neighborhood);
      }
    }

    return (
      <Input
        type='select'
        ref='neighborhoodSelect'
        label='Neighborhood'
        defaultValue={selected}
        onChange={this.updateSelected}>
        {this.neighborhoods.map((neighborhood, index) => {
          let opts = {
            value: neighborhood.id
          };
          return (
            <option {...opts} key={index}>{neighborhood.title}</option>
          );
        })}
      </Input>
    );
  }
}
