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

const FQ_CLIENT = 'SKTI3V3SYKOFYXRZ4DZOWF0VZY042TFGWY4VPF224ROTIICZ';
const FQ_SECRET = 'TUQKX2TKJRN2D1G5RKBCCQQBIZUWC4UDA1RTVUS4EHUHGH2D';
const FQ_VERSION = '20180115';

class App extends Component {
    state = {
        lat: 52.3728097,
        lng: 4.8751014,
        zoom: 13,
        all: locations,
        filtered: locations,
        activeMarker: {},
        open: false,
        selectedIndex: -1,
        showingInfoWindow: false
    };

    componentDidMount = () => {
        this.setState({
            filtered: this.filterLocations(this.state.all, '')
        });
    };

    queryUpdate = queryEntry => {
        this.closeInfoWindow();

        this.setState({
            selectedIndex: -1,
            filtered: this.filterLocations(this.state.all, queryEntry)
        });
    };

    filterLocations = (locations, query) => {
        return locations.filter(location =>
            location.name.toLowerCase().includes(query.toLowerCase())
        );
    };

    listDrawerToggle = () => {
        this.setState({
            open: !this.state.open
        });
    };

    listDrawerItemClick = index => {
        this.showInfoWindow(index);
    };

    getBusinessInfo = (props, data) => {
        return data.response.venues.filter(
            item =>
                item.name.includes(props.name) || props.name.includes(item.name)
        );
    };

    closeInfoWindow = () => {
        let aMarker = { visible: false };
        this.setState({
            showingInfoWindow: false,
            activeMarker: aMarker,
            selectedIndex: -1
        });
    };

    showInfoWindow = (index, e) => {
        this.closeInfoWindow();

        let props = this.state.filtered[index];

        let url = `https://api.foursquare.com/v2/venues/search?client_id=${FQ_CLIENT}&client_secret=${FQ_SECRET}&v=${FQ_VERSION}&radius=100&ll=${
            props.location.lat
        },${props.location.lng}&llAcc=100`;
        let headers = new Headers();
        let request = new Request(url, {
            method: 'GET',
            headers
        });

        let cMarker = props;

        fetch(request)
            .then(response => response.json())
            .then(result => {
                let restaurant = this.getBusinessInfo(props, result);

                cMarker.foursquare = restaurant[0];

                if (cMarker.foursquare) {
                    let url = `https://api.foursquare.com/v2/venues/${
                        restaurant[0].id
                    }/photos?client_id=${FQ_CLIENT}&client_secret=${FQ_SECRET}&v=${FQ_VERSION}`;
                    fetch(url)
                        .then(response => response.json())
                        .then(result => {
                            cMarker.images = result.response.photos;

                            this.setState({
                                activeMarker: cMarker,
                                selectedIndex: index
                            });
                        });
                } else {
                    this.setState({
                        activeMarker: cMarker,
                        selectedIndex: index
                    });
                }
            });
    };

    render() {
        return (
            <div className="App">
                <ListDrawer
                    locations={this.state.filtered}
                    open={this.state.open}
                    toggleDrawer={this.listDrawerToggle}
                    filterLocations={this.queryUpdate}
                    listDrawerItemClick={this.listDrawerItemClick}
                    selectedIndex={this.state.selectedIndex}
                />
                <MapDisplay
                    lat={this.state.lat}
                    lng={this.state.lng}
                    zoom={this.state.zoom}
                    locations={this.state.filtered}
                    activeMarker={this.state.activeMarker}
                    closeInfoWindow={this.closeInfoWindow}
                    showInfoWindow={this.showInfoWindow}
                />
            </div>
        );
    }
}

export default App;
