import React, { Component } from 'react';
import locations from './data/locations.json';
import MapDisplay from './components/MapDisplay';
import ListDrawer from './components/ListDrawer';
import { foursquareVenues, venueDetails } from './components/foursquareVenues';
import {
    FS_CLIENT,
    FS_SECRET,
    FS_VERSION,
    FS_URL,
    FS_R,
    FS_A,
    FS_CAT
} from './components/apiCredentials';

import './styles/main.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faFoursquare } from '@fortawesome/free-brands-svg-icons';
import {
    faSearch,
    faBars,
    faStar,
    faStarHalfAlt,
    faUtensils
} from '@fortawesome/free-solid-svg-icons';

library.add(faSearch, faBars, faStar, faStarHalfAlt, faUtensils, faFoursquare);

class App extends Component {
    state = {
        lat: 52.3728097,
        lng: 4.8751014,
        zoom: 13,
        // all: locations,
        filtered: [],
        activeMarker: {},
        open: false,
        selectedIndex: -1,
        venues: []
    };

    /**
     * @description Sets filtered state with all restaurants when the application is loaded
     * @paramn none
     * @returns State
     */
    componentDidMount = () => {
        foursquareVenues(`${this.state.lat},${this.state.lng}`).then(res =>
            this.setState({
                venues: res,
                filtered: this.filterLocations(res, '')
            })
        );
    };

    /**
     * @description Creates new array of filtered restaurants and closes infoWindow
     * @param string
     * @returns State
     */
    queryUpdate = queryEntry => {
        this.closeInfoWindow();

        this.setState({
            selectedIndex: -1,
            filtered: this.filterLocations(this.state.venues, queryEntry)
        });
    };

    /**
     * @description creates new array based on query
     * @param   array, string
     * @returns array - filtered locations
     */
    filterLocations = (locations, query) => {
        return locations.filter(location =>
            location.name.toLowerCase().includes(query.toLowerCase())
        );
    };

    /**
     * @description sets new state to close or open the list drawer
     * @param none
     * @returns State
     */
    listDrawerToggle = () => {
        this.setState({
            open: !this.state.open
        });
    };

    /**
     * @description Calls showInfoWindow whenever a list item is click
     * @param Numeric
     * @returns Function
     */
    listDrawerItemClick = index => {
        this.showInfoWindow(index);
    };

    /**
     * @description Set states to clear selected active marker and close info window
     * @param none
     * @returns State
     */
    closeInfoWindow = () => {
        let aMarker = { visible: false };
        this.setState({
            activeMarker: aMarker,
            selectedIndex: -1
        });
    };

    buildRequest = location => {
        let url = `${FS_URL}search?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=${FS_VERSION}&categoryId=${FS_CAT}&radius=${FS_R}&ll=${
            location.lat
        },${location.lng}&llAcc=${FS_A}`;
        let headers = new Headers();
        let request = new Request(url, {
            method: 'GET',
            headers
        });
        return request;
    };

    /**
     * @description Search information for the selected restaurant
     * @param props, object
     * @returns object - Foursquare information
     */
    getBusinessInfo = (props, data) => {
        return data.response.venues.filter(
            item =>
                item.name.includes(props.name) || props.name.includes(item.name)
        );
    };

    getApiInfo = locations => {
        locations.map(location => {
            let request = this.buildRequest(location.location);
            return this.fetch(request, location);
        });
    };

    fetch = (request, location) => {
        // let venues = [];
        fetch(request)
            .then(response => {
                if (!response.ok) {
                    throw response;
                } else return response.json();
            })
            .then(result => {
                let venue = this.getBusinessInfo(location, result);
                console.log(venue);

                return venue;
            });
    };

    /**
     * @description Calls Foursquare api to generate restaurant image and information for selected marker
     * @param   Numeric, event
     * @returns new states for active marker
     */
    showInfoWindow = (index, e) => {
        // close info window set states to close any info window
        this.closeInfoWindow();

        let props = this.state.filtered[index];
        let markerActive = {};

        venueDetails(props).then(detail => {
            markerActive = detail.response.venue;

            this.setState({
                activeMarker: markerActive,
                selectedIndex: index
            });
        });
    };

    setVenues = venues => {
        this.setState({
            venues: venues
        });
    };

    render() {
        const { filtered, venues } = this.state;

        console.log(venues)
        
        return venues.length ? (
            <div className="App">
                <ListDrawer
                    locations={filtered}
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
                    locations={filtered}
                    activeMarker={this.state.activeMarker}
                    closeInfoWindow={this.closeInfoWindow}
                    showInfoWindow={this.showInfoWindow}
                    // setVenues={this.setVenues}
                />
            </div>
        ) : (
            <div>
                <div className="loader">
                    <div className="loader-rings">
                        <div />
                        <div />
                        <div />
                        <div />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
