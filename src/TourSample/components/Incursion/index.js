import React from 'react';
import PropTypes from 'prop-types';
import { Animated, Image, VrButton } from 'react-vr';

import Tooltip from './components/Tooltip';

/**
 * On hover the InfoButton fades in a Tooltip component, and then fades it out
 * when the cursor leaves both the button and the Tooltip.
 *
 * When using with CylinderLayer, set pixelsPerMeter to convert units, otherise
 * set translateZ to specify distance between camera and button.
 */
class Incursion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opacityAnim: new Animated.Value(0),
    };
  }

  fadeIn() {
    const { fadeIn } = this.props;
    const { opacityAnim } = this.state;
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: fadeIn,
    }).start();
  }

  fadeOut() {
    const { fadeOut } = this.props;
    const { opacityAnim } = this.state;
    Animated.timing(opacityAnim, {
      toValue: 0,
      duration: fadeOut,
    }).start();
  }

  render() {
    const {
      pixelsPerMeter: PPM, source, tooltip, rotateY, translateX, translateZ, onClickSound,
      onEnterSound, onExitSound, onLongClickSound,
    } = this.props;

    const { opacityAnim } = this.state;

    return (
      <VrButton
        style={{
          layoutOrigin: [0.5, 0.5, 0],
          position: 'absolute',
          transform: [
            { rotateY },
            { translateX },
            { translateZ },
          ],
        }}
        ignoreLongClick
        onExit={() => {
          this.fadeOut();
        }}
        onClickSound={onClickSound}
        onEnterSound={onEnterSound}
        onExitSound={onExitSound}
        onLongClickSound={onLongClickSound}
      >
        <Image
          style={{
            height: 0.3 * PPM,
            width: 0.3 * PPM,
            flexDirection: 'row',
          }}
          onEnter={() => {
            this.fadeIn();
          }}
          source={source}
        >
          <Animated.View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              opacity: opacityAnim,
              paddingLeft: 0.4 * PPM,
            }}
            billboarding="on"
          >
            <Tooltip pixelsPerMeter={PPM} tooltip={tooltip} />
          </Animated.View>
        </Image>
      </VrButton>
    );
  }
}

Incursion.propTypes = {
  fadeIn: PropTypes.number,
  fadeOut: PropTypes.number,
  onEnterSound: PropTypes.shape({
    uri: PropTypes.string,
  }).isRequired,
  onExitSound: PropTypes.func,
  onLongClickSound: PropTypes.func,
  onClickSound: PropTypes.func,
  pixelsPerMeter: PropTypes.number,
  rotateY: PropTypes.number,
  translateX: PropTypes.number,
  translateZ: PropTypes.number,
  source: PropTypes.shape({
    uri: PropTypes.string,
  }).isRequired,
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

Incursion.defaultProps = {
  fadeIn: 500,
  fadeOut: 500,
  pixelsPerMeter: 1,
  rotateY: 0,
  translateX: 0,
  translateZ: 0,
};

export default Incursion;
