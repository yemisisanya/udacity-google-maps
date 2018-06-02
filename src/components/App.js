import React, { Component } from 'react';
import '../App.css';
import { GoogleApiWrapper } from 'google-maps-react'
import MapContainer from './MapContainer'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';


class App extends Component {
  render() {
    return (
      <div>
        <MapContainer google={this.props.google} />
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyChZPizXo_3sk70Cm4yveOd0YfQtuxc7As',
})(App)