import React, { Component } from 'react';
import locations from './data/locations.json';
import MapDisplay from './components/MapDisplay';
import './App.css';

class App extends Component {
    state = {
        lat: 52.366274,
        lng: 4.8852947,
        zoom: 14,
        all: locations
    };

    render() {
        return (
            <div className="App">
                <div className="drawer">
                    <h1 className="drawer_title">Amsterdam Restaurants</h1>
                </div>
                <div className="content">
                    <MapDisplay
                        lat={this.state.lat}
                        lng={this.state.lng}
                        zoom={this.state.zoom}
                        locations={this.state.all}
                    />
                </div>
            </div>
        );
    }
}

export default App;
