import React, { Component } from 'react';
import locations from './data/locations.json';
import MapDisplay from './components/MapDisplay';
import ListDrawer from './components/ListDrawer';

import './styles/main.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faFoursquare } from '@fortawesome/free-brands-svg-icons';
import {
    faSearch,
    faBars,
    faStar,
    faStarHalfAlt,
    faUtensilsAlt,
} from '@fortawesome/pro-solid-svg-icons';

library.add(faSearch, faBars, faStar, faStarHalfAlt, faUtensilsAlt, faFoursquare );

class App extends Component {
    state = {
        lat: 52.366274,
        lng: 4.8852947,
        zoom: 14,
        all: locations,
        open: false
    };

    toggleListDrawer = () => {
        this.setState({
            open: !this.state.open
        })
    };

    render() {
        return (
            <div className="App">
                <ListDrawer 
                    locations={this.state.all}
                    open={this.state.open}
                    toggleDrawer={this.toggleListDrawer}
                />
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
