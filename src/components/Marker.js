import React from 'react';
import { Marker as GoogleMarker } from 'google-maps-react';

export default class Marker extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.animation !== prevProps.animation) {
            this.marker &&
                this.marker.marker.setAnimation(this.props.animation);
        }
    }

    componentDidMount() {
        this.props.onRef(this);
    }

    render() {
        return (
            <GoogleMarker {...this.props} ref={ref => (this.marker = ref)} />
        );
    }
}
