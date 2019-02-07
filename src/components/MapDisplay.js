import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';
import Marker from './Marker';

const MAP_KEY = 'AIzaSyAVSL9eG92K3W19jt0uIpoxW_lZGPdxfJs';

class MapDisplay extends Component {
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

    onMarkerClick = index => () => {
        const { showInfoWindow } = this.props;
        showInfoWindow(index);
    };

    render = () => {
        const {
            activeMarker,
            closeInfoWindow,
            showInfoWindow,
            google,
            lat,
            lng,
            locations,
            zoom
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
                {locations.map(({ location, name, url, visible }, index) => (
                    <Marker
                        key={index}
                        position={location}
                        onClick={this.onMarkerClick(index)}
                        name={name}
                        url={url}
                        animation={this.setAnimation(name)}
                        visible={visible}
                        activeMarker={activeMarker}
                        showInfoWindow={showInfoWindow}
                    />
                ))}
            </Map>
        );
    };
}

export default GoogleApiWrapper({ apiKey: MAP_KEY })(MapDisplay);
