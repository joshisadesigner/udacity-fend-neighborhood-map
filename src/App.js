import React, { Component } from 'react';
import locations from './data/locations.json';
import MapDisplay from './components/MapDisplay';
import IconButton from './components/IconButton';
import './styles/main.scss';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
        all: locations
    };

    onClick = () => {
        alert('it works!');
    };

    render() {
        return (
            <div className="App">
                <div className="drawer">
                    <div className="search">
                        <input type="text" placeholder="Search" />
                        <IconButton
                            className="search-button"
                            onClick={this.onClick}
                        />
                    </div>
                    <IconButton
                        className="drawer-button"
                        onClick={this.onClick}
                    />
                    <div className="list">
                        <ul>
                            <li className="item">
                                <button className="item-button">
                                    <div className="item-icon">
                                        <FontAwesomeIcon icon={faUtensilsAlt} />
                                    </div>
                                    <div>
                                        <h4 className="item-name">
                                            Ciel Bleu Restaurant
                                        </h4>
                                        <p className="item-rate">
                                            4.7
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon
                                                icon={faStarHalfAlt}
                                            />
                                        </p>
                                    </div>
                                </button>
                            </li>
                            <li className="item">
                                <button className="item-button">
                                    <div className="item-icon">
                                        <FontAwesomeIcon icon={faUtensilsAlt} />
                                    </div>
                                    <div>
                                        <h4 className="item-name">
                                            Restaurant Zest - Craft Beer &amp;
                                            Food
                                        </h4>
                                        <p className="item-rate">
                                            4.7
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon icon={faStar} />
                                            <FontAwesomeIcon
                                                icon={faStarHalfAlt}
                                            />
                                        </p>
                                    </div>
                                </button>
                            </li>
                        </ul>
                    </div>
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
