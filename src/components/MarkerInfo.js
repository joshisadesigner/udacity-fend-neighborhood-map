import React, { Component } from 'react';
import { InfoWindow } from 'google-maps-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFoursquare } from '@fortawesome/free-brands-svg-icons';

class MarkerInfo extends Component {
    render() {
        const { activeMarker, visible, onClose, ...props } = this.props;

        return (
            <InfoWindow
                {...props}
                marker={activeMarker}
                visible={visible}
                onClose={onClose}
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
        );
    }
}
export default MarkerInfo;
