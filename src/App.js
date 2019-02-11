import React, { Component } from 'react';
import MapDisplay from './components/MapDisplay';
import ListDrawer from './components/ListDrawer';
import { foursquareVenues, venueDetails } from './components/foursquareVenues';

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
        venues: [],
        filtered: [],
        activeMarker: {},
        open: false,
        selectedIndex: -1,
        show: false
    };

    /**
     * @description Sets filtered state with all restaurants when the application is loaded
     * @paramn none
     * @returns State
     */
    componentDidMount = () => {
        foursquareVenues(`${this.state.lat},${this.state.lng}`)
            .then(res => {
                this.setState({
                    venues: res,
                    filtered: this.filterLocations(res, '')
                });
            })
            .catch(error => {
                this.setState({
                    show: true
                });
            });
    };

    componentWillUnmount = () => {
        window.clearTimeout(this.state.timeout);
    };

    showMessage = () => {
        this.setState({ show: true });
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
            markerActive.index = index;

            this.setState({
                activeMarker: markerActive,
                selectedIndex: index
            });
        });
    };

    render() {
        const { filtered } = this.state;

        return (
            <div className="App">
                {this.state.show ? (
                    <div className="message_error">
                        <h2>
                            Sorry! We were unable to load restaurants at this
                            moment, please try again later
                        </h2>
                    </div>
                ) : (
                    ''
                )}
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
                />
            </div>
        );
    }
}

export default App;
