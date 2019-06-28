import React from 'react';
import PropTypes from 'prop-types';
import {
  asset, MediaPlayerState, Video, VideoControl, View,
} from 'react-vr';

class VideoTooltip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerState: new MediaPlayerState({ autoPlay: true, muted: true }),
    };
  }

  render() {
    const { tooltip, pixelsPerMeter: PPM } = this.props;
    const { playerState } = this.state;
    return (
      <View>
        <Video
          style={{
            height: tooltip.height * PPM,
            width: tooltip.width * PPM,
          }}
          source={[
            asset(tooltip.sourceChrome, { format: 'webm' }),
            asset(tooltip.sourceSafari, { format: 'mp4' }),
          ]}
          playerState={playerState}
        />
        <VideoControl
          style={{
            height: 0.2 * PPM,
            width: tooltip.width * PPM,
          }}
          fontSize={18}
          playerState={playerState}
        />
      </View>
    );
  }
}

VideoTooltip.propTypes = {
  pixelsPerMeter: PropTypes.number,
  tooltip: PropTypes.shape({
    attribution: PropTypes.string,
    attributionUri: PropTypes.string,
    height: PropTypes.number,
    rotationY: PropTypes.number,
    source: PropTypes.string,
    text: PropTypes.string,
    type: PropTypes.string,
    width: PropTypes.number,
  }).isRequired,
};

export default VideoTooltip;
