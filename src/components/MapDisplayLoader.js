import React, { Component } from 'react';

class MapDisplayLoader extends Component {
    state = {
        show: false,
        timeout: 0
    };

    componentDidMount = () => {
        let timeout = window.setTimeout(this.showMessage, 1000);
        this.setState({ timeout });
    };

    componentWillUnmount = () => {
        window.clearTimeout(this.state.timeout);
    };

    showMessage = () => {
        this.setState({ show: true });
    };

    render = () => {
        return (
            <div>
                {this.state.show ? (
                    <div className="loader">
                        <div className="loader-message">
                            <h1>Error loading map</h1>
                            <p>
                                could not load map control due to a network
                                error.
                                <br />
                                Try again when you're online.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="loader">
                            <div className="loader-rings">
                                <div />
                                <div />
                                <div />
                                <div />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };
}

export default MapDisplayLoader;
