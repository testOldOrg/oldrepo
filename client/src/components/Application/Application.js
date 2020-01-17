import React, {Component} from 'react';
import {Col, Container, Row} from 'reactstrap';

import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import {earthRadius} from '../Constants';

const MAX_BOUNDS = [
    [-90, -180],
    [90, 180]
];
const DEFAULT_MAP_CENTER = [0, 0];
const MIN_ZOOM = 1;
const MAX_ZOOM = 17;
const MAP_STYLE_LENGTH = 500;
const ZOOM_INCREMENT = 2;


export default class Application extends Component {
  constructor(props) {
    super(props);

    this.updatePlanOption = this.updatePlanOption.bind(this);
    this.updateClientSetting = this.updateClientSetting.bind(this);
    this.addMarker = this.addMarker.bind(this);
    this.setZoom = this.setZoom.bind(this);
    this.clearCenter = this.clearCenter.bind(this);
    this.zoomToMarker = this.zoomToMarker.bind(this);

    this.state = {
      planOptions: {
        units: {'miles': earthRadius['miles']},
        activeUnit: 'miles'
      },
      markerPosition: null,
      mapCenter: DEFAULT_MAP_CENTER,
      mapZoom: MIN_ZOOM,
    };
  }

  render() {
    return (
        <div className='application-width'>
          {this.props.errorMessage}
          <Container>
            <Row>
              <Col sm="12" md={{size: 6, offset: 3}}>
                {this.renderLeafletMap()}
              </Col>
            </Row>
          </Container>
        </div>
    );
  }

  updateClientSetting(field, value) {
    let newSettings = Object.assign({}, this.state.planOptions);
    newSettings[field] = value;
    this.props.modify('clientSettings', newSettings);
  }

  updatePlanOption(option, value) {
    let optionsCopy = Object.assign({}, this.state.planOptions);
    optionsCopy[option] = value;
    this.setState({'planOptions': optionsCopy});
  }

  renderLeafletMap() {
    let markerPosition = '';
    if (this.state.markerPosition) {
      markerPosition = this.state.markerPosition.lat.toFixed(2) + ', ' + this.state.markerPosition.lng.toFixed(2);
    }
    return (
        <Map center={this.state.mapCenter}
             zoom={this.state.mapZoom}
             minZoom={MIN_ZOOM}
             maxZoom={MAX_ZOOM}
             maxBounds={MAX_BOUNDS}
             onClick={this.addMarker}
             onZoom={this.setZoom}
             onMove={this.clearCenter}
             style={{height: MAP_STYLE_LENGTH, maxWidth: MAP_STYLE_LENGTH}}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                     attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {this.getMarker(markerPosition, this.state.markerPosition)}
        </Map>
    )
  }

  getMarker(bodyJSX, position) {
    if (position) {
      return (
          <Marker position={position} icon={this.markerIcon()}
                  onClick={this.zoomToMarker}>
            <Popup offset={[0, -18]} className="font-weight-bold">{bodyJSX}</Popup>
          </Marker>
      );
    }
  }

  addMarker(e) {
    this.setState({markerPosition: e.latlng});
  }

  zoomToMarker(e) {
    this.setState({mapCenter: this.state.markerPosition, mapZoom: this.state.mapZoom + ZOOM_INCREMENT});
    e.target.openPopup();
  }

  setZoom(e) {
    this.setState({mapZoom: e.target.getZoom()});
  }

  clearCenter(e) {
    if (this.state.mapCenter) {
      this.setState({mapCenter: null});
    }
  }

  markerIcon() {
    // react-leaflet does not currently handle default marker icons correctly,
    // so we must create our own
    return L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconAnchor: [12, 40]  // for proper placement
    })
  }
}
