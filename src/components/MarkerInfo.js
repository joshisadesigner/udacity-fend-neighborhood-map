import React, { Component } from 'react';
import { InfoWindow } from 'google-maps-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFoursquare } from '@fortawesome/free-brands-svg-icons';

class MarkerInfo extends Component {
    state = {
        visible: false
    };
    isVisible = () => {
        if (this.props.name === this.props.activeMarker.name) {
            console.log('name equal');
            this.setState({
                visible: true
            });
        } else {
            console.log('name different');
            this.setState({
                visible: false
            });
        }
    };

    render() {
        const { name, url, images, visible } = this.props;

        return (
            <InfoWindow {...this.props} visible={visible}>
                <div>
                    {name && <h4>{name}</h4>}
                    {url && (
                        <p>
                            <a
                                className="marker-info-url"
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Restaurant website
                            </a>
                        </p>
                    )}
                    {images && (
                        <figure className="img-marker">
                            <figcaption>Image from foursquare.</figcaption>
                            <img
                                alt={name}
                                src={
                                    images.items[0].prefix +
                                    'cap100' +
                                    images.items[0].suffix
                                }
                            />
                            <FontAwesomeIcon icon={faFoursquare} />
                        </figure>
                    )}
                </div>
            </InfoWindow>
        );
    }
}
export default MarkerInfo;
