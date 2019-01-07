import React, { Component } from 'react';
import { Map, GoogleApiWrapper } from 'google-maps-react';

const MAP_KEY = 'AIzaSyAVSL9eG92K3W19jt0uIpoxW_lZGPdxfJs';

class MapDisplay extends Component {
    state = {
        map: null
    };

    componentdidMount = () => {};

    mapReady = (props, map) => {
        this.setState({ map });
    };

    render = () => {
        const style = {
            width: '100%',
            heigth: '100%'
        };

        const center = {
            lat: this.props.lat,
            lng: this.props.lng
        };

        return (
            <Map
                role="application"
                aria-label="map"
                onReady={this.mapReady}
                google={this.props.google}
                zoom={this.props.zoom}
                style={style}
                initialCenter={center}
                onclick={this.closeInfoWindow}
            />
        );
    };
}

export default GoogleApiWrapper({ apiKey: MAP_KEY })(MapDisplay);
