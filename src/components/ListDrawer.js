import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from './IconButton';
import {
    faStar,
    faStarHalfAlt,
    faUtensilsAlt
} from '@fortawesome/pro-solid-svg-icons';

class ListDrawer extends Component {
    state = {
        open: false,
        query: ''
    };

    queryUpdate = queryEntry => {
        this.setState({ query: queryEntry });
    };

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

    render = () => {
        const { locations } = this.props;

        return (
            <div className={'drawer' + (this.props.open ? ' open' : '')}>
                <IconButton
                    hiddenName="Drawer"
                    className="drawer-button"
                    onClick={this.props.toggleDrawer}
                />
                <div className="search">
                    <label for="search" className="offscreen">
                        Search:
                    </label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Search"
                        tabIndex={this.props.open ? '0' : '-1'}
                    />
                    <IconButton
                        offscreenName="true"
                        hiddenName="Search"
                        className="search-button"
                        onClick={this.queryUpdate}
                    />
                </div>
                <div className="list">
                    <ul>
                        {locations.map((location, index) => (
                            <li className="item" key={index}>
                                <button
                                    className="item-button"
                                    tabIndex={this.props.open ? '0' : '-1'}
                                >
                                    <div className="item-icon">
                                        <FontAwesomeIcon icon={faUtensilsAlt} />
                                    </div>
                                    <div>
                                        <h4 className="item-name">
                                            {location.name}
                                        </h4>
                                        <p className="item-rate">
                                            {location.rating}
                                            {this.ratingStars(location.rating)}
                                        </p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };
}

export default ListDrawer;
