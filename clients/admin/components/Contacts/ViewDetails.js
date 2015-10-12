/*global window */
'use strict';

import React from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';
import HomeStore from '../../stores/HomeStore';
import HomeActions from '../../actions/HomeActions';
import UploadArea from '../../../common/components/UploadArea';
import UploadAreaUtils from '../../../common/components/UploadArea/utils';
import { randomNumericId, merge } from '../../../common/Helpers';
import ImageList from '../Widgets/ImageList';
import NeighborhoodSelect from '../Widgets/NeighborhoodSelect';
import ApplicationStore from '../../../common/stores/ApplicationStore';
import EditDetails from '../Shared/EditDetails';

let debug = require('../../../common/debugger')('HomesEditDetails');

export default class ContactsViewDetails extends React.Component {
  render() {
    return (
      <Row>
        <h1>Contact request</h1>
        <p>@TODO</p>
      </Row>
    );
  }
}
