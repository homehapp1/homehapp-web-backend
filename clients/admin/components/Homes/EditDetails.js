'use strict';

import React from 'react';
import { Link } from 'react-router';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Input from 'react-bootstrap/lib/Input';
import Button from 'react-bootstrap/lib/Button';
import Well from 'react-bootstrap/lib/Well';

let debug = require('../../../common/debugger')('HomesEditDetails');
const countries = require('../../../common/lib/Countries').forSelect();

class HomesEditDetails extends React.Component {
  static propTypes = {
    home: React.PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
  }

  state = {
    currentAttributes: this.props.home.attributes
  }

  onFormChange(event) {
    let {type, target} = event;
    // TODO: Validation could be done here
    //debug('onFormChange', event, type, target);
    //this.props.home.facilities = this.refs.facilities.getValue().split("\n");
  }

  onSave() {
    debug('save');
  }

  onRemoveAttributeClicked(index) {
    let newAttributes = [];
    this.state.currentAttributes.forEach((item, idx) => {
      if (idx !== index) {
        newAttributes.push(item);
      }
    });
    this.setState({currentAttributes: newAttributes});
  }

  onAddAttributeClicked(event) {
    this.state.currentAttributes.push({name: '', value: ''});
    this.setState({currentAttributes: this.state.currentAttributes});
  }

  renderAttributeRow(index, attr, isLast) {
    let actions = (
      <Col md={2}>
        <Button
          bsStyle='danger'
          bsSize='small'
          onClick={(event) => this.onRemoveAttributeClicked(index)}>
          -
        </Button>
      </Col>
    );
    if (isLast) {
      actions = (
        <Col md={2}>
          <Button
            bsStyle='danger'
            bsSize='small'
            onClick={(event) => this.onRemoveAttributeClicked(index)}>
            -
          </Button>
          <Button
            bsStyle='success'
            bsSize='small'
            ref='addAttributeButton'
            onClick={this.onAddAttributeClicked.bind(this)}>
            +
          </Button>
        </Col>
      );
    }
    return (
      <Row key={'attribute-' + index + '-' + attr.name}>
        <Col md={4}>
          <Input
            type='select'
            addonBefore='Name'
            placeholder='Select Attribute'
            name={'attributes[' + index + '][name]'}
            defaultValue={attr.name}>
            <option value=''>Select Attribute</option>
            <option value='floor'>Floor</option>
            <option value='rooms'>Rooms</option>
            <option value='elevator'>Elevator</option>
          </Input>
        </Col>
        <Col md={4}>
          <Input
            type='text'
            addonBefore='Value'
            name={'attributes[' + index + '][value]'}
            defaultValue={attr.value}
          />
        </Col>
        {actions}
      </Row>
    );
  }

  render() {
    let countrySelections = countries.map((country) => {
      return (
        <option
          value={country.value}
          key={'locCountry-' + country.value}>
          {country.label}
        </option>
      );
    });

    let lat, lon = '';
    if (this.props.home.location.coordinates.length) {
      lat = this.props.home.location.coordinates[0];
      lon = this.props.home.location.coordinates[1];
    }

    return (
      <Row>
        <form method='POST'>
          <Col md={10} sm={10}>
            <Panel header='Common'>
              <Input
                type='text'
                label='Title'
                placeholder='Title (optional)'
                defaultValue={this.props.home.title}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='textarea'
                label='Description'
                placeholder='Write description'
                defaultValue={this.props.home.description}
                onChange={this.onFormChange.bind(this)}
              />
            </Panel>
            <Panel header='Location'>
              <Input
                type='text'
                label='Street Address'
                placeholder='ie. Kauppakartanonkuja 3 B'
                defaultValue={this.props.home.location.address.street}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                label='Apartment'
                placeholder='ie. 22'
                defaultValue={this.props.home.location.address.apartment}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                label='City'
                placeholder='ie. Helsinki'
                defaultValue={this.props.home.location.address.city}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='select'
                label='Country'
                placeholder='Select Country'
                defaultValue={this.props.home.location.address.country}
                onChange={this.onFormChange.bind(this)}>
                <option value=''>Select country</option>
                {countrySelections}
              </Input>

              <Input
                label='Coordinates'
                help='Optional coordinates for the home' wrapperClassName='wrapper'>
                <Row>
                  <Col xs={6}>
                    <Input
                      type='text'
                      addonBefore='Latitude:'
                      defaultValue={lat}
                    />
                  </Col>
                  <Col xs={6}>
                    <Input
                      type='text'
                      addonBefore='Longitude:'
                      defaultValue={lon}
                    />
                  </Col>
                </Row>
              </Input>
            </Panel>
            <Panel header='Costs'>
              <Input
                type='select'
                label='Currency'
                placeholder='Select Applied Currency'
                defaultValue={this.props.home.costs.currency}
                onChange={this.onFormChange.bind(this)}>
                <option value='EUR'>Euro</option>
                <option value='GBP'>British Pounds</option>
                <option value='SUD'>US Dollars</option>
              </Input>
              <Input
                type='text'
                label='Dept Free Price'
                placeholder='(optional)'
                defaultValue={this.props.home.costs.deptFreePrice}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                label='Selling Price'
                placeholder='(optional)'
                defaultValue={this.props.home.costs.sellingPrice}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                label='Square meter Price'
                placeholder='(optional)'
                defaultValue={this.props.home.costs.squarePrice}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                label='Real estate Tax (per year)'
                placeholder='(optional)'
                defaultValue={this.props.home.costs.realEstateTaxPerYear}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                label='Electrict Charge (per month)'
                placeholder='(optional)'
                defaultValue={this.props.home.costs.electricChargePerMonth}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='text'
                label='Water charge (per month)'
                placeholder='(optional)'
                defaultValue={this.props.home.costs.waterChargePerMonth}
                onChange={this.onFormChange.bind(this)}
              />
              <Input
                type='select'
                label='Currency'
                placeholder='Water charge type'
                defaultValue={this.props.home.costs.waterChargePerType}
                onChange={this.onFormChange.bind(this)}>
                <option value='person'>Per Person</option>
                <option value='household'>Per Household</option>
              </Input>
            </Panel>
            <Panel header='Amenities'>
              <Input
                type='textarea'
                label='Input Amenities (one per line)'
                placeholder='(optional)'
                defaultValue={this.props.home.amenities.join(`\n`)}
                onChange={this.onFormChange.bind(this)}
              />
            </Panel>
            <Panel header='Facilities'>
              <Input
                type='textarea'
                ref='facilities'
                label='Input Facilities (one per line)'
                placeholder='(optional)'
                defaultValue={this.props.home.facilities.join(`\n`)}
                onChange={this.onFormChange.bind(this)}
              />
            </Panel>
            <Panel header='Other Attributes'>
              {
                this.state.currentAttributes.map((attr, index) => {
                  let isLast = false;
                  if (index === this.state.currentAttributes.length - 1) {
                    isLast = true;
                  }
                  return this.renderAttributeRow(index, attr, isLast);
                })
              }
            </Panel>
            <Well>
              <Row>
                <Col md={6}>
                  <Button bsStyle='success' onClick={this.onSave.bind(this)}>Save</Button>
                </Col>
                <Col md={6} pullRight>
                  <Button bsStyle='danger' className='pull-right'>Delete</Button>
                </Col>
              </Row>
            </Well>
          </Col>
        </form>
      </Row>
    );
  }
}

export default HomesEditDetails;
