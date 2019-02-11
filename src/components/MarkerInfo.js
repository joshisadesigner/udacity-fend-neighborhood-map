import React, { Component } from 'react';
import { InfoWindow } from 'google-maps-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFoursquare } from '@fortawesome/free-brands-svg-icons';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';

class MarkerInfo extends Component {
    isvisible = name => {
        if (name === this.props.activeMarker.name) {
            return true;
        }
    };

    /**
     * @description Create an array of Font Awesome star icons
     * @param Numeric
     * @returns Array
     */
    ratingStars = r => {
        let stars = [];
        for (let i = 0; i < r; i++) {
            if (r - i > 1) {
                stars.push(<FontAwesomeIcon icon={faStar} key={i} />);
            } else {
                stars.push(<FontAwesomeIcon icon={faStarHalfAlt} key={i} />);
            }
        }
        return stars;
    };

    render() {
        const {
            name,
            index,
            activeMarker,
            activeMarker: { index: activeIndex },
            activeMarker: { name: activeName }
        } = this.props;

        return (
            <InfoWindow {...this.props} visible={name === activeName && index === activeIndex }>
                <div>
                    {activeMarker.name && <h4>{activeMarker.name}</h4>}
                    {activeMarker.rating && (
                        <p className="item-rate">
                            {activeMarker.rating}
                            {this.ratingStars(activeMarker.rating)}
                        </p>
                    )}
                    {activeMarker.url && (
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
                    )}
                    {activeMarker.bestPhoto && (
                        <figure className="img-marker">
                            <figcaption>Image from foursquare.</figcaption>
                            <img
                                alt={'Image of ' + activeMarker.name + ' from foursquare.'}
                                src={
                                    activeMarker.bestPhoto.prefix + '100' +
                                    activeMarker.bestPhoto.suffix
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
