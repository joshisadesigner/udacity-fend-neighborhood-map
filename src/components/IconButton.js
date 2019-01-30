import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class IconButton extends Component {
    static propTypes = {
        className: PropTypes.string,
        onClick: PropTypes.func.isRequired
    };

    /**
     * @description Defines string to use for className
     * @param CSS className
     * @returns String
     */
    buttonClass = className => {
        switch (className) {
            case 'drawer-button':
                return 'bars';
            case 'search-button':
                return 'search';
            default:
                return;
        }
    };

    render() {
        const { className, onClick, hiddenName, name } = this.props;

        return (
            <button className={className} onClick={onClick}>
                {hiddenName && <span className="offscreen">{hiddenName}</span>}
                <FontAwesomeIcon icon={this.buttonClass(className)} />

                {name && <span>Your code didn't work</span>}
            </button>
        );
    }
}

export default IconButton;
