import React from 'react';
import { Link } from 'react-router';

import HomeListStore from '../../stores/HomeListStore';
import HomeStore from '../../stores/HomeStore';
import Loading from '../../../common/components/Widgets/Loading';

import Table from 'react-bootstrap/lib/Table';
import Button from 'react-bootstrap/lib/Button';
import Row from 'react-bootstrap/lib/Row';
import Nav from 'react-bootstrap/lib/Nav';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';

import { setPageTitle } from '../../../common/Helpers';
import DOMManipulator from '../../../common/DOMManipulator';
// import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';

let debug = require('debug')('HomesIndex');

class HomesIndex extends React.Component {
  static propTypes = {
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.homes = null;
    this.iterator = 0;
    this.storeListener = this.onChange.bind(this);
  }

  state = {
    homes: HomeListStore.fetchHomes(),
    error: null
  }

  componentDidMount() {
    setPageTitle('Homes');
    HomeListStore.listen(this.storeListener);
    HomeListStore.fetchHomes();
    this.container = new DOMManipulator(this.refs.container);
  }

  componentWillUnmount() {
    HomeListStore.unlisten(this.storeListener);
  }

  onChange(state) {
    debug('onChange', state);
    debug('StateChange');
    for (let home of state.homes) {
      debug('Home', home.homeTitle, home.metadata.score);
    }
    this.setState({
      homes: state.homes,
      error: state.error
    });
  }

  sortHomes() {
    this.homes.sort((a, b) => {
      if (a.metadata.score > b.metadata.score) {
        return -1;
      }

      if (a.metadata.score < b.metadata.score) {
        return 1;
      }

      if (a.metadata.createdAt > b.metadata.createdAt) {
        return -1;
      }

      if (a.metadata.createdAt < b.metadata.createdAt) {
        return 1;
      }

      return 0;
    });
  }

  movePosition(index, dir) {
    if (typeof this.homes[index - dir] !== 'undefined') {
      let tmp = this.homes[index];
      this.homes[index] = this.homes[index - dir];
      this.homes[index - dir] = tmp;
      this.homes.map((home, index) => {
        home.metadata.score = this.homes.length - index;
      });
      this.forceUpdate();

      setTimeout(() => {
        debug('timeout phase 1');
        let node = React.findDOMNode(this.refs.container);
        if (!node) {
          return null;
        }
        let rows = node.getElementsByClassName('sortable');
        rows[index].setAttribute('data-flash', 'data-flash');
        rows[index - dir].setAttribute('data-flash', 'data-flash');

        setTimeout(() => {
          debug('timeout phase 2');
          rows[index].removeAttribute('data-flash');
          rows[index - dir].removeAttribute('data-flash');
        }, 2000);
      }, 100);
    }
  }

  onSave() {
    let scores = {};
    for (let home of this.homes) {
      // Do a minimal update
      let homeProps = {
        id: home.id,
        metadata: home.metadata
      };
      HomeStore.updateItem(homeProps);
      scores[home.metadata.score] = home.homeTitle;
    }
    debug(scores);
  }

  handleErrorState() {
    return (
      <div className='error'>
        {this.state.error.message}
      </div>
    );
  }

  handleLoadingState() {
    return (
      <Loading>
        Loading homes...
      </Loading>
    );
  }

  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }

    if (HomeListStore.isLoading() || !this.state.homes) {
      return this.handleLoadingState();
    }
    debug(this.state.homes);

    this.homes = this.homes || this.state.homes;
    this.sortHomes();
    this.iterator++;

    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className='navigation-title'>
            Homes
          </h2>
          <p>There are {this.homes.length} homes in the system currently.</p>
          <ul>
            <li><Link to='homeCreate'><i className='fa fa-home'></i> Create a new home</Link></li>
          </ul>
        </Nav>
        <Row>
          <h1><i className='fa fa-home'></i> {this.homes.length} homes</h1>
          <Table className='flashable' ref='container'>
            <thead>
              <tr>
                <th>Title</th>
                <th>Neighborhood</th>
                <th>Story blocks</th>
                <th>Enabled</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {this.homes.map((home, i) => {
                debug('Home', home.homeTitle, home.metadata.score);
                let neighborhood = null;
                if (home.location.neighborhood) {
                  neighborhood = (
                    <Link
                      to='neighborhoodEdit'
                      params={{id: home.location.neighborhood.id}}>
                      {home.location.neighborhood.title}
                    </Link>
                  );
                }
                let upClass = ['fa', 'fa-chevron-circle-up'];
                let downClass = ['fa', 'fa-chevron-circle-down'];

                if (!i) {
                  upClass.push('disabled');
                }

                if (i === this.homes.length - 1) {
                  downClass.push('disabled');
                }

                let enabled = null;
                if (home.story.enabled) {
                  enabled = (
                    <span>yes</span>
                  );
                }

                return (
                  <tr key={`home-${i}-${this.iterator}`} className='sortable'>
                    <td>
                      <Link
                        to='homeEdit'
                        params={{id: home.id}}>
                        {home.homeTitle}
                      </Link>
                    </td>
                    <td>
                      {neighborhood}
                    </td>
                    <td>{home.story.blocks.length}</td>
                    <td>{enabled}</td>
                    <td className='sort-actions'>
                      <i className={upClass.join(' ')} onClick={() => {
                        this.movePosition(i, 1);
                      }}></i>
                      <i className={downClass.join(' ')} onClick={() => {
                        this.movePosition(i, -1);
                      }}></i>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th></th>
                <th><Button bsStyle='primary' onClick={this.onSave.bind(this)}>Save order</Button></th>
              </tr>
            </tfoot>
          </Table>
        </Row>
      </SubNavigationWrapper>
    );
  }
}

export default HomesIndex;
