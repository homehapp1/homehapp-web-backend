import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import AgentListActions from '../../actions/AgentListActions';

export default class AgentsListItem extends React.Component {
  static propTypes = {
    item: React.PropTypes.object.isRequired,
    onSelected: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
  }

  onEdit() {
    this.props.onSelected(this.props.item);
  }

  onDelete() {
    AgentListActions.removeItem(this.props.item.id);
  }

  render() {
    let agencyName = 'Not set';
    if (this.props.item.agency && this.props.item.agency.title) {
      agencyName = this.props.item.agency.title;
    }
    return (
      <tr className='agentItem'>
        <td>
          {this.props.item.rname}
        </td>
        <td>
          {agencyName}
        </td>
        <td>
          <Button
            bsStyle='primary'
            bsSize='medium'
            onClick={this.onEdit.bind(this)}>
            Edit
          </Button>
          <Button
            bsStyle='danger'
            bsSize='medium'
            onClick={this.onDelete.bind(this)}>
            Delete
          </Button>
        </td>
      </tr>
    );
  }
}
