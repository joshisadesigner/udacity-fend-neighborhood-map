import React from 'react';
import { Marker as GoogleMarker } from 'google-maps-react';
import MarkerInfo from './MarkerInfo';

export default class Marker extends React.Component {
    componentDidUpdate(prevProps) {
        if (this.props.animation !== prevProps.animation) {
            this.marker &&
                this.marker.marker.setAnimation(this.props.animation);
        }
    }

    render() {
        return (
            <div>
                {this.marker && (
                    <MarkerInfo {...this.props} marker={this.marker.marker} />
                )}
                <GoogleMarker
                    {...this.props}
                    ref={ref => (this.marker = ref)}
                />
            </div>
        );
    }
}
