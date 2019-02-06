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
        lat: 52.366274,
        lng: 4.8852947,
        zoom: 14,
        all: locations,
        filtered: locations,
        markers: [],
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
        this.setState({
            selectedIndex: -1,
            filtered: this.filterLocations(this.state.all, queryEntry),
            filteredMarkers: this.filterMarkers(this.state.markers, queryEntry)
        });
    };

    filterLocations = (locations, query) => {
        return locations.filter(location =>
            location.name.toLowerCase().includes(query.toLowerCase())
        );
    };

    filterMarkers = (markers, query) => {
        return markers.filter(marker => {
            
        let markerName = marker.props.name.toLowerCase();
        let qry = query.toLowerCase();

        console.log(markerName, qry)
            return markerName.includes(qry)
        });
    }

    listDrawerToggle = () => {
        this.setState({
            open: !this.state.open
        });
    };

    listDrawerItemClick = (index, location) => {
        this.setState({
            selectedIndex: index
            // open: !this.state.open
        });
        // this.onMarkerClick(location.marker.props, location.marker.marker);
    };

    getBusinessInfo = (props, data) => {
        return data.response.venues.filter(
            item =>
                item.name.includes(props.name) || props.name.includes(item.name)
        );
    };

    onMarkerClick = (props, marker, e) => {
        this.closeInfoWindow();

        console.log('props: ');
        console.log(props);

        console.log('marker :');
        console.log(marker);

        let url = `https://api.foursquare.com/v2/venues/search?client_id=${FQ_CLIENT}&client_secret=${FQ_SECRET}&v=${FQ_VERSION}&radius=100&ll=${
            props.position.lat
        },${props.position.lng}&llAcc=100`;
        let headers = new Headers();
        let request = new Request(url, {
            method: 'GET',
            headers
        });

        let cMarker = marker;

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
                                showingInfoWindow: true,
                                activeMarker: cMarker
                            });
                        });
                } else {
                    this.setState({
                        showingInfoWindow: true,
                        activeMarker: cMarker
                    });
                }
            });
    };

    closeInfoWindow = () => {
        if (this.state.showingInfoWindow) {
            this.setState({
                showingInfoWindow: false,
                activeMarker: {},
                activeMarkerProps: {}
            });
        }
    };

    markersArray = markerRef => {
        this.setState({
            markers: markerRef
        })
    };

    render() {
        console.log(this.state.filtered);
        console.log(this.state.markers);
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
                    selectedIndex={this.state.selectedIndex}
                    activeMarker={this.state.activeMarker}
                    closeInfoWindow={this.closeInfoWindow}
                    onMarkerClick={this.onMarkerClick}
                    showingInfoWindow={this.state.showingInfoWindow}
                    markersArray={this.markersArray}
                />
            </div>
        );
    }
}

export default App;
