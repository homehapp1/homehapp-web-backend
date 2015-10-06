import React from 'react';
import Input from 'react-bootstrap/lib/Input';
import NeighborhoodListStore from '../../stores/NeighborhoodListStore';

let debug = require('../../../common/debugger')('NeighborhoodSelect');

export default class NeighborhoodSelect extends React.Component {
  static propTypes = {
    neighborhoods: React.PropTypes.array.isRequired,
    selected: React.PropTypes.oneOfType([
      React.PropTypes.null,
      React.PropTypes.object
    ])
  }

  constructor(props) {
    super(props);
    //this.storeListener = this.onChange.bind(this);
    this.selected = null;
  }

  // state = {
  //   error: null,
  //   neighborhoods: []
  // };

  componentDidMount() {
    // NeighborhoodListStore.listen(this.storeListener);
    // if (!NeighborhoodListStore.getState().neighborhoods.length) {
    //   NeighborhoodListStore.fetchNeighborhoods();
    // }
  }

  componentWillUnmount() {
    //NeighborhoodListStore.unlisten(this.storeListener);
  }

  // onChange(state) {
  //   debug('state', state, NeighborhoodListStore.getState());
  //   this.setState({
  //     error: NeighborhoodListStore.getState().error,
  //     neighborhoods: NeighborhoodListStore.getState().neighborhoods
  //   });
  // }

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
    for (let neighborhood of this.props.neighborhoods) {
      if (neighborhood.id === selected) {
        this.selected = neighborhood;
      }
    }
    debug('Set selected', this.selected);
  }

  render() {
    debug('render', this.props);
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

    for (let neighborhood of this.props.neighborhoods) {
      if (neighborhoods.indexOf(neighborhood) === -1) {
        neighborhoods.push(neighborhood);
      }
    }

    return (
      <Input
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
      </Input>
    );
  }
}
