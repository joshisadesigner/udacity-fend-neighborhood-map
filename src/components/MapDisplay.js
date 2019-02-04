import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import Marker from './Marker';
import { InfoWindow } from 'google-maps-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFoursquare } from '@fortawesome/free-brands-svg-icons';

const MAP_KEY = 'AIzaSyAVSL9eG92K3W19jt0uIpoxW_lZGPdxfJs';

class MapDisplay extends Component {
    state = {
        map: null
    };

    mapReady = (props, map) => {
        this.setState({ map });
    };

    setAnimation = markerName => {
        if (markerName === this.props.activeMarker.name) {
            return '1';
        } else {
            return '2';
        }
    };

    render = () => {
        const {
            onMarkerClick,
            google,
            zoom,
            locations,
            lat,
            lng,
            closeInfoWindow,
            showingInfoWindow,
            activeMarker
        } = this.props;

        const style = {
            width: '100%',
            heigth: '100%'
        };

        const center = {
            lat: lat,
            lng: lng
        };

        return (
            <Map
                role="application"
                aria-label="map"
                onReady={this.mapReady}
                google={google}
                zoom={zoom}
                style={style}
                initialCenter={center}
                onClick={closeInfoWindow}
                mapTypeControl={false}
                className="content"
            >
                {locations.map(({ location, name, url }, index) => (
                    <Marker
                        key={index}
                        position={location}
                        onClick={onMarkerClick}
                        name={name}
                        url={url}
                        animation={this.setAnimation(name)}
                    />
                ))}

                <InfoWindow
                    marker={activeMarker}
                    visible={showingInfoWindow}
                    onClose={closeInfoWindow}
                >
                    <div>
                        {activeMarker && activeMarker.name ? (
                            <h4>{activeMarker.name}</h4>
                        ) : (
                            ''
                        )}
                        {activeMarker && activeMarker.url ? (
                            <p>
                                <a
                                    className="marker-info-url"
                                    href={activeMarker.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Restaurant website
                                </a>
                            </p>
                        ) : (
                            ''
                        )}
                        {activeMarker && activeMarker.images ? (
                            <figure className="img-marker">
                                <figcaption>Image from foursquare.</figcaption>
                                <img
                                    alt={activeMarker.name}
                                    src={
                                        activeMarker.images.items[0].prefix +
                                        'cap100' +
                                        activeMarker.images.items[0].suffix
                                    }
                                />
                                <FontAwesomeIcon icon={faFoursquare} />
                            </figure>
                        ) : (
                            ''
                        )}
                    </div>
                </InfoWindow>
            </Map>
        );
    };
}

export default GoogleApiWrapper({ apiKey: MAP_KEY })(MapDisplay);
