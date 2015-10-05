'use strict';

import React from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Nav from 'react-bootstrap/lib/Nav';
import SubNavigationWrapper from '../Navigation/SubNavigationWrapper';
// import NavItemLink from 'react-router-bootstrap/lib/NavItemLink';

class AgentsIndex extends React.Component {
  static propTypes = {
    agents: React.PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <SubNavigationWrapper>
        <Nav sidebar>
          <h2 className="navigation-title">
            Agents
          </h2>
          <p>There are {this.props.agents.length} agents in the system currently.</p>
          <ul>
            <li><Link to='agentCreate'><i className='fa fa-agent'></i> Create a new agent</Link></li>
          </ul>
        </Nav>
        <Row>
          <h1><i className='fa fa-agent'></i> {this.props.agents.length} agents</h1>

          <ul>
            {this.props.agents.map((agent, i) => {
              return (
                <li key={i}>
                  <Link
                    to="agentEdit"
                    params={{id: agent.id}}>
                    {agent.agentTitle}
                  </Link>
                </li>
              );
            })}
          </ul>

        </Row>
      </SubNavigationWrapper>
    );
  }
}

export default AgentsIndex;
