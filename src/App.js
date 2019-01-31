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
    faUtensilsAlt
} from '@fortawesome/pro-solid-svg-icons';

library.add(
    faSearch,
    faBars,
    faStar,
    faStarHalfAlt,
    faUtensilsAlt,
    faFoursquare
);

class App extends Component {
    state = {
        lat: 52.366274,
        lng: 4.8852947,
        zoom: 14,
        all: locations,
        filtered: locations,
        open: false
    };

    componentDidMount = () => {
        this.setState({
            ...this.state,
            filtered: this.filterLocations(this.state.all, '')
        });
        console.log('componentDidMount fired!');
    };

    queryUpdate = queryEntry => {
        this.setState({
            ...this.state,
            selectedIndex: null,
            filtered: this.filterLocations(this.state.all, queryEntry)
        });
    };

    filterLocations = (locations, query) => {
        return locations.filter(location =>
            location.name.toLowerCase().includes(query.toLowerCase())
        );
    };

    toggleListDrawer = () => {
        this.setState({
            open: !this.state.open
        });
    };

    render() {
        return (
            <div className="App">
                {console.log(this.state.filtered)}
                <ListDrawer
                    locations={this.state.filtered}
                    open={this.state.open}
                    toggleDrawer={this.toggleListDrawer}
                    filterLocations={this.queryUpdate}
                />
                <MapDisplay
                    lat={this.state.lat}
                    lng={this.state.lng}
                    zoom={this.state.zoom}
                    locations={this.state.filtered}
                />
            </div>
        );
    }
}

export default App;
