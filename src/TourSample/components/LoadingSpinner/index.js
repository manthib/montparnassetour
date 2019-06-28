import React from 'react';
import PropTypes from 'prop-types';
import { Animated, asset, Image } from 'react-vr';
import { Easing } from 'react-native';

/**
 * Displays a spinning loading indicator. Fades in after a configurable delay,
 * which looks nice and prevents spinner from appearing when loading is quick.
 *
 * When using with CylinderLayer, set pixelsPerMeter to convert units, otherise
 * set translateZ to specify distance between camera and spinner.
 */
class LoadingSpinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rotationAnim: new Animated.Value(0),
      opacityAnim: new Animated.Value(0),
    };
  }

  componentDidMount() {
    const { delay, speed } = this.props;
    const { opacityAnim } = this.state;
    Animated.timing(opacityAnim, {
      delay,
      duration: speed,
      easing: Easing.linear,
      toValue: 1,
    }).start();
    this.rotationAnimate();
  }

  rotationAnimate() {
    const { speed } = this.props;
    const { rotationAnim } = this.state;
    rotationAnim.setValue(0);
    Animated.timing(rotationAnim, {
      duration: speed,
      easing: Easing.linear,
      toValue: -360,
    }).start(status => status.finished && this.rotationAnimate());
  }

  render() {
    const {
      pixelsPerMeter: PPM, style, source, rotateY, translateX, translateZ, height, width,
    } = this.props;

    const { opacityAnim, rotationAnim } = this.state;

    return (
      <Animated.View
        style={[
          style,
          {
            opacity: opacityAnim,
            position: 'absolute',
            transform: [
              // Use rotateY and translateZ for 3D, or translateX if using pixels.
              { rotateY },
              { translateZ },
              { translateX },
              // Spin! Must be the last transform applied.
              { rotateZ: rotationAnim },
            ],
          },
        ]}
      >
        <Image
          style={{
            height: height * PPM,
            width: width * PPM,
          }}
          source={source}
        />
      </Animated.View>
    );
  }
}

LoadingSpinner.propTypes = {
  style: PropTypes.shape({
    layoutOrigin: PropTypes.arrayOf(
      PropTypes.number,
    ),
  }),
  pixelsPerMeter: PropTypes.number,
  rotateY: PropTypes.number,
  translateX: PropTypes.number,
  translateZ: PropTypes.number,
  source: PropTypes.shape({
    uri: PropTypes.string,
  }),
  height: PropTypes.number,
  width: PropTypes.number,
  delay: PropTypes.number,
  speed: PropTypes.number,
};

LoadingSpinner.defaultProps = {
  delay: 500,
  height: 0.5,
  pixelsPerMeter: 1,
  rotateY: 0,
  source: asset('circle_ramp.png'),
  speed: 1500,
  translateX: 0,
  translateZ: 0,
  width: 0.5,
};

export default LoadingSpinner;
