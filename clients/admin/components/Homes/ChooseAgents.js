

import React from 'react';
import AgentListStore from '../../stores/AgentListStore';
import Loading from '../../../common/components/Widgets/Loading';
let debug = require('debug')('ChooseAgents');

import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import HomeActions from '../../actions/HomeActions';

import Image from '../../../common/components/Widgets/Image';

export default class ChooseAgents extends React.Component {
  static propTypes = {
    home: React.PropTypes.object,
    params: React.PropTypes.object
  }

  constructor(props) {
    super(props);
    this.storeListener = this.onChange.bind(this);
    this.agents = {};
  }

  state = {
    error: null,
    agents: AgentListStore.getState().items
  }

  componentDidMount() {
    AgentListStore.listen(this.storeListener);
    // See that the dispatcher is called only when the previous
    // dispatcher has had the time to finish
    setTimeout(() => {
      if (!AgentListStore.getState().items.length) {
        try {
          AgentListStore.fetchItems();
        } catch (error) {
          console.error('Failed to get the agents list', error.message);
        }
      }
    });
  }

  componentWillUnmount() {
    AgentListStore.unlisten(this.storeListener);
  }

  onChange(state) {
    debug('onChange', state);
    this.setState({
      error: AgentListStore.getState().error,
      agents: AgentListStore.getState().items
    });
  }

  onFormChange(event) {
    debug('Event', event, event.target, event.target.checked);
    let id = event.target.value;
    if (typeof this.agents[id] === 'undefined') {
      return true;
    }

    let checked = event.target.checked;
    let target = event.target;

    setTimeout(() => {
      target.checked = checked;
      if (checked) {
        debug(target.parentNode.className);
        target.parentNode.parentNode.className += ' selected';
      } else {
        target.parentNode.parentNode.className = target.parentNode.parentNode.className.replace(/ ?selected/g, '');
      }
    });
  }

  addAgent(agent) {
    if (!this.isAgentSelected(agent)) {
      this.props.home.agents.push(agent);
    }
    return true;
  }

  removeAgent(agent) {
    let index = this.indexOfAgent(agent);
    debug('Remove agent', agent, index);
    if (index !== -1) {
      this.props.home.agents.splice(index, 1);
    }
  }

  handlePendingState() {
    return (
      <Loading>
        <h3>Loading agents...</h3>
      </Loading>
    );
  }

  handleErrorState() {
    return (
      <div className='homes-error'>
        <h3>Error loading agents!</h3>
        <p>{this.state.error.message}</p>
      </div>
    );
  }

  onSave() {
    debug('Saving agent list', this.refs);
    let agents = [];
    for (let key in this.refs) {
      debug('Ref', key);
      let node = React.findDOMNode(this.refs[key]);
      if (node.checked && typeof this.agents[node.value] !== 'undefined') {
        agents.push(this.agents[node.value].id);
      }
    }
    let homeProps = {
      id: this.props.home.id,
      agents: agents
    };
    debug('Update props', homeProps);
    return HomeActions.updateItem(homeProps);
  }

  indexOfAgent(agent) {
    debug('indexOfAgent', this.props.home, agent);
    if (!this.props.home.agents || !this.props.home.agents.length) {
      return -1;
    }

    for (let i in this.props.home.agents) {
      let a = this.props.home.agents[i];
      debug('Check', agent, a);
      if (agent.id === a.id) {
        debug('Agent is selected', agent, i);
        return i;
      }
    }
    return -1;
  }

  isAgentSelected(agent) {
    return !(this.indexOfAgent(agent) === -1);
  }

  render() {
    if (this.state.error) {
      return this.handleErrorState();
    }

    if (AgentListStore.isLoading()) {
      debug('Pending...');
      return this.handlePendingState();
    }

    let agents = [].concat(this.state.agents);

    return (
      <Row>
        <form method='POST' id='agentSelector' className='clearfix'>
          <Col md={10} sm={10}>
            <Panel header='Choose the agents'>
              <ul className='choose-agent'>
                {
                  agents.map((agent, index) => {
                    this.agents[agent.id] = agent;
                    let image = agent.mainImage;
                    let agency = null;
                    let classes = ['agent'];
                    let selected = this.isAgentSelected(agent);

                    if (selected) {
                      classes.push('selected');
                    }

                    let inputProps = {
                      type: 'checkbox',
                      value: agent.id,
                      ref: `agent${index}`,
                      checked: selected,
                      onChange: this.onFormChange.bind(this)
                    };

                    return (
                      <li className={classes.join(' ')} key={`agent-${index}`}>
                        <label>
                          <Image {...image} width={100} height={100} mode='fill' applySize />
                          <p className='name'>{agent.rname}</p>
                          {agency}
                          <input {...inputProps} />
                      </label>
                      </li>
                    );
                  })
                }
              </ul>
            </Panel>
            <Well>
              <Row>
                <Col md={6}>
                  <Button bsStyle='success' accessKey='s' onClick={this.onSave.bind(this)}>Save</Button>
                </Col>
              </Row>
            </Well>
          </Col>
        </form>
      </Row>
    );
  }
}
