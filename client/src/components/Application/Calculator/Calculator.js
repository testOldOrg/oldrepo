import React, { Component } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { Card, CardBody } from 'reactstrap'
import { Button } from 'reactstrap'
import { Form, Label, Input } from 'reactstrap'
import { request } from '../../../api/api.js'

export default class Calculator
  extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first: {latitude: '', longitude: ''},
      second: {latitude: '', longitude: ''},
      distance: 0
    };

    this.update_input = this.update_input.bind(this);
    this.calculate_distance = this.calculate_distance.bind(this);
  }

  update_input(id, field, value) {
    let temp = Object.assign({}, this.state[id]);
    temp[field] = value;
    this.setState({[id]: temp});
  }

  parse_location_info(location) {
    let temp = Object.assign({}, location);
    temp['latitude'] = parseFloat(temp['latitude']);
    temp['longitude'] = parseFloat(temp['longitude']);

    return temp;
  }

  calculate_distance() {
    const body = {
      'type'        : 'distance',
      'version'     : '4',
      'origin'      : this.parse_location_info(this.state.first),
      'destination' : this.parse_location_info(this.state.second),
      'units'       : this.props.unit
    };

    request(body, 'distance').then(
      (response) => {
        this.setState({distance: response.distance});
      }
    );
  }

  create_input_fields(title, id) {
    let hoc_update = (e) => {this.update_input(id, e.target.name, e.target.value)};
    return (
      <Form inline>
              <Col md={4} lg={2}>
                <Label>{title}</Label>
              </Col>
              <Col sm={6} md={4} lg={4}>
                <Input name='latitude' onChange={hoc_update} value={this.state[id]['latitude']}
                       style={{width: "100%"}} placeholder="Latitude"/>
              </Col>
              <Col sm={6} md={4} lg={4}>
                <Input name='longitude' onChange={hoc_update} value={this.state[id]['longitude']}
                       style={{width: "100%"}} placeholder="Longitude"/>
              </Col>
      </Form>
      );
  }

  render() {
    return (
      <Container>
          {this.create_input_fields('Origin', 'first')}
          {this.create_input_fields('Destination', 'second')}

          <Card>
            <CardBody>
              <Row>
                <Col md={6}>
                  <Button onClick={this.calculate_distance}>Calculate</Button>
                </Col>
                <Col md={6}>
                  {this.state.distance} {this.props.unit}
                </Col>
              </Row>
            </CardBody>
          </Card>
      </Container>
    )
  }
}