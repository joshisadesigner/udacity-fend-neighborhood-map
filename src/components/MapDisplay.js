import React, { Component } from 'react';
import { InfoWindow, Marker, Map, GoogleApiWrapper } from 'google-maps-react';

const MAP_KEY = 'AIzaSyAVSL9eG92K3W19jt0uIpoxW_lZGPdxfJs';

class MapDisplay extends Component {
    state = {
        map: null,
        markers: [],
        markerProps: [],
        activeMarker: {},
        activeMarkerProps: {},
        showingInfoWindow: false
    };

    componentdidMount = () => {};

    onMarkerClick = (props, marker, e) =>
        this.setState({
            activeMarker: marker,
            activeMarkerProps: props,
            showingInfoWindow: true
        });

    closeInfoWindow = () => {
        if (this.state.showingInfoWindow) {
            this.setState({
                activeMarker: {},
                activeMarkerProps: {},
                showingInfoWindow: false
            });
        }
    };

    mapReady = (props, map) => {
        this.setState({ map });
        this.updateMarkers(this.props.locations);
    };

    updateMarkers = locations => {
        if (!locations) return;

        let markerProps = [];
        let markers = locations.map((location, index) => {
            let mProps = {
                key: index,
                index,
                name: location.name,
                url: location.url,
                location: location.location
            };

            markerProps.push(mProps);

            return {
                location: location.location
            };
        });

        this.setState({ markers, markerProps });
    };

    createMarker = (lat, lng) => <Marker position={{ lat: lat, lng: lng }} />;

    render = () => {
        const style = {
            width: '100%',
            heigth: '100%'
        };

        const center = {
            lat: this.props.lat,
            lng: this.props.lng
        };

        let amProps = this.state.activeMarkerProps;

        return (
            <Map
                role="application"
                aria-label="map"
                onReady={this.mapReady}
                google={this.props.google}
                zoom={this.props.zoom}
                style={style}
                initialCenter={center}
                onClick={this.closeInfoWindow}
                mapTypeControl={false}
            >
                {this.state.markers.map((location, index) => (
                    <Marker
                        key={index}
                        position={location.location}
                        animation={this.props.google.maps.Animation.DROP}
                        onClick={this.onMarkerClick}
                        name={this.state.markerProps[index].name}
                        url={this.state.markerProps[index].url}
                    />
                ))}
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.closeInfoWindow}
                >
                    <div>
                        <h4>{amProps.name}</h4>
                        <p>{amProps.url}</p>
                    </div>
                </InfoWindow>
            </Map>
        );
    };
}

export default GoogleApiWrapper({ apiKey: MAP_KEY })(MapDisplay);
