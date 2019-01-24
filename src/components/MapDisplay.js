import React, { Component } from 'react';
import { InfoWindow, Map, GoogleApiWrapper } from 'google-maps-react';
import Marker from './Marker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFoursquare } from '@fortawesome/free-brands-svg-icons';

const MAP_KEY = 'AIzaSyAVSL9eG92K3W19jt0uIpoxW_lZGPdxfJs';
const FQ_CLIENT = 'SKTI3V3SYKOFYXRZ4DZOWF0VZY042TFGWY4VPF224ROTIICZ';
const FQ_SECRET = 'TUQKX2TKJRN2D1G5RKBCCQQBIZUWC4UDA1RTVUS4EHUHGH2D';
const FQ_VERSION = '20180115';

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

    getBusinessInfo = (props, data) => {
        return data.response.venues.filter(
            item =>
                item.name.includes(props.name) || props.name.includes(item.name)
        );
    };

    onMarkerClick = (props, marker, e) => {
        let url = `https://api.foursquare.com/v2/venues/search?client_id=${FQ_CLIENT}&client_secret=${FQ_SECRET}&v=${FQ_VERSION}&radius=100&ll=${
            props.position.lat
        },${props.position.lng}&llAcc=100`;
        let headers = new Headers();
        let request = new Request(url, {
            method: 'GET',
            headers
        });

        let activeMarkerProps;

        fetch(request)
            .then(response => response.json())
            .then(result => {
                let restaurant = this.getBusinessInfo(props, result);
                activeMarkerProps = {
                    ...props,
                    foursquare: restaurant[0]
                };

                if (activeMarkerProps.foursquare) {
                    let url = `https://api.foursquare.com/v2/venues/${
                        restaurant[0].id
                    }/photos?client_id=${FQ_CLIENT}&client_secret=${FQ_SECRET}&v=${FQ_VERSION}`;
                    fetch(url)
                        .then(response => response.json())
                        .then(result => {
                            activeMarkerProps = {
                                ...activeMarkerProps,
                                images: result.response.photos,
                                animation: '1'
                            };

                            this.setState({
                                showingInfoWindow: true,
                                activeMarker: marker,
                                activeMarkerProps
                            });
                        });
                } else {
                    activeMarkerProps = {
                        ...activeMarkerProps,
                        animation: '1'
                    };

                    this.setState({
                        showingInfoWindow: true,
                        activeMarker: marker,
                        activeMarkerProps
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

    setAnimation = markerName => {
        if (markerName === this.state.activeMarkerProps.name) {
            console.log(
                markerName + ' / EQUAL / ' + this.state.activeMarkerProps.name
            );
            return '1';
        } else {
            return '2';
        }
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

        console.log('Rendering...');
        console.log(amProps);

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
                        onClick={this.onMarkerClick}
                        name={this.state.markerProps[index].name}
                        url={this.state.markerProps[index].url}
                        animation={this.setAnimation(
                            this.state.markerProps[index].name
                        )}
                    />
                ))}
                <InfoWindow
                    marker={this.state.activeMarker}
                    visible={this.state.showingInfoWindow}
                    onClose={this.closeInfoWindow}
                >
                    <div>
                        {amProps && amProps.name ? <h4>{amProps.name}</h4> : ''}
                        {amProps && amProps.url ? <p><a className="marker-info-url" href={amProps.url} target="_blank" rel="noopener noreferrer">Restaurant website</a></p> : ''}
                        {amProps && amProps.images ? (
                            <figure className='img-marker'>
                                    <figcaption>Image from foursquare.</figcaption>
                                <img
                                    alt={amProps.name}
                                    src={
                                        amProps.images.items[0].prefix +
                                        'cap100' +
                                        amProps.images.items[0].suffix
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
