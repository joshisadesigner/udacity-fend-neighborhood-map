import React, { Component } from 'react';
import locations from './data/locations.json';
import MapDisplay from './components/MapDisplay';
import ListDrawer from './components/ListDrawer';
import {
    FS_CLIENT,
    FS_SECRET,
    FS_VERSION,
    FS_URL,
    FS_R,
    FS_A
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

/*

https://api.foursquare.com/v2/venues/search?client_id=SKTI3V3SYKOFYXRZ4DZOWF0VZY042TFGWY4VPF224ROTIICZ&client_secret=UQKX2TKJRN2D1G5RKBCCQQBIZUWC4UDA1RTVUS4EHUHGH2D&v=20180115&radius=100&ll=52.3728097,4.8751014&llAcc=100

https://api.foursquare.com/v2/venues/search?client_id=SKTI3V3SYKOFYXRZ4DZOWF0VZY042TFGWY4VPF224ROTIICZ&client_secret=UQKX2TKJRN2D1G5RKBCCQQBIZUWC4UDA1RTVUS4EHUHGH2D&v=20180115&radius=100&ll=52.3728097,4.8751014

https://api.foursquare.com/v2/venues/search?categoryId=4d4b7105d754a06374d81259&near=amsterdam&limit=50

venues/search?client_id=SKTI3V3SYKOFYXRZ4DZOWF0VZY042TFGWY4VPF224ROTIICZ&client_secret=UQKX2TKJRN2D1G5RKBCCQQBIZUWC4UDA1RTVUS4EHUHGH2D&v=20180115&ll=52.3728097,4.8751014&ne=52.3840327,4.8758075&sw=52.3567711,4.9050327

*/
class App extends Component {
    state = {
        lat: 52.3728097,
        lng: 4.8751014,
        zoom: 13,
        all: locations,
        filtered: locations,
        activeMarker: {},
        open: false,
        selectedIndex: -1
    };

    /**
     * @description Sets filtered state with all restaurants when the application is loaded
     * @paramn none
     * @returns State
     */
    componentDidMount = () => {
        this.setState({
            filtered: this.filterLocations(this.state.all, '')
        });
        this.getApiInfo(this.state.all);
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
            filtered: this.filterLocations(this.state.all, queryEntry)
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
        let url = `${FS_URL}search?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=${FS_VERSION}&radius=${FS_R}&ll=${
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
        fetch(request)
            .then(response => {
                if (!response.ok) {
                    throw response;
                } else return response.json();
            })
            .then(result => {
                let venue = this.getBusinessInfo(location, result);
                console.log(venue[0]);
                return venue[0];
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
        let request = this.buildRequest(props.location);
        // console.log('request ', request);

        // temp variable to store props and add info
        let cMarker = props;

        fetch(request)
            .then(response => response.json())
            .then(result => {
                let restaurant = this.getBusinessInfo(props, result);

                // add foursquare data to temp variable
                cMarker.foursquare = restaurant[0];

                if (cMarker.foursquare) {
                    let url = `${FS_URL}${
                        restaurant[0].id
                    }/photos?client_id=${FS_CLIENT}&client_secret=${FS_SECRET}&v=${FS_VERSION}`;
                    fetch(url)
                        .then(response => {
                            if (!response.ok) {
                                throw response;
                            } else return response.json();
                        })
                        .then(result => {
                            // add foursquare image to temp variable
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
