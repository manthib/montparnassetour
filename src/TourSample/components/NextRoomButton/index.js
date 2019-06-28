import React from 'react';
import PropTypes from 'prop-types';
import {
  Animated, Image, Text, View, VrButton, VrSoundEffects,
} from 'react-vr';
import { Easing } from 'react-native';

import LoadingSpinner from '../LoadingSpinner';

/**
 * NavButton is activated either by selecting or by prolonged hovering.
 * On hover, a text label appears, and a fill-circle exapnds around the button.
 * Once selected, the button disappears and a loading spinner takes its place.
 *
 * When using with CylinderLayer, set pixelsPerMeter to convert units, otherise
 * set translateZ to specify distance between camera and button.
 */
class NextRoomButton extends React.Component {
  constructor(props) {
    super(props);
    // innerWidth is image diameter, outerWidth is diameter of gaze-and-fill ring,
    // so initial border is half the different between the two.
    const PPM = props.pixelsPerMeter;
    this.ringWidth = 0.025 * PPM;
    this.initialBorderWidth = (props.outerWidth * PPM - props.innerWidth * PPM) / 2
      - this.ringWidth;
    this.state = {
      borderWidthAnim: new Animated.Value(this.initialBorderWidth),
      hasFocus: false,
      lastTimeoutId: 0,
    };
  }

  componentWillUnmount() {
    const { lastTimeoutId } = this.state;
    if (lastTimeoutId) {
      clearTimeout(lastTimeoutId);
    }
  }

  startFill() {
    const { delay } = this.props;
    const { borderWidthAnim } = this.state;
    Animated.timing(borderWidthAnim, {
      toValue: this.ringWidth / 2,
      easing: Easing.linear,
      duration: delay,
    }).start();
  }

  removeFill() {
    const { borderWidthAnim } = this.state;
    borderWidthAnim.stopAnimation();
    borderWidthAnim.setValue(this.initialBorderWidth);
  }

  selected() {
    // Disable focus once button is selected.
    this.setState({ hasFocus: false });
    const { onInput } = this.props;
    onInput();
  }

  render() {
    // Set alpha channel to zero for 'no color' to make a transparent view.
    const transparent = 'rgba(255, 255, 255, 0.0)';
    const fillColor = 'rgba(255, 255, 255, 0.8)';

    const {
      pixelsPerMeter: PPM, source, rotateY, translateX, translateZ, outerWidth,
      isLoading, onClickSound, delay, onEnterSound, onExitSound, onLongClickSound,
      height, innerWidth, pixelsPerMeter, textLabel,
    } = this.props;

    const { lastTimeoutId } = this.state;
    const { hasFocus, borderWidthAnim } = this.state;

    return (
      <VrButton
        style={{
          // Use 'row' so label gets placed to right of the button.
          flexDirection: 'row',
          layoutOrigin: [0.5, 0.5],
          position: 'absolute',
          transform: [
            { rotateY },
            { translateX },
            { translateZ },
          ],
        }}
        ignoreLongClick
        onClick={() => this.selected()}
        onEnter={() => {
          if (!isLoading) {
            this.setState({ hasFocus: true });
            // Remember id, so we can remove this timeout if cusor exits.
            const id = setTimeout(() => {
              // Play click sound on gaze timeout. Audio was loaded by VrButton.
              VrSoundEffects.play(onClickSound);
              this.selected();
            }, delay);
            this.setState({ lastTimeoutId: id });
            this.startFill();
          }
        }}
        onExit={() => {
          this.setState({ hasFocus: false });
          clearTimeout(lastTimeoutId);
          this.state.lastTimeoutId = 0;
          this.removeFill();
        }}
        onClickSound={onClickSound}
        onEnterSound={onEnterSound}
        onExitSound={onExitSound}
        onLongClickSound={onLongClickSound}
      >
        <View
          style={{
            // Make ring, using rounded borders, which appears on hover.
            alignItems: 'center',
            backgroundColor: transparent,
            borderColor: hasFocus ? 'white' : transparent,
            borderRadius: outerWidth / 2 * PPM,
            borderWidth: this.ringWidth,
            height: outerWidth * PPM,
            justifyContent: 'center',
            width: outerWidth * PPM,
          }}
        >
          {!isLoading
          && (
            <View>
              <Animated.View
                style={{
                  // This view has a border that appears on hover to fill the space
                  // between the ring and the image. Animation decreases the border
                  // width for a gaze-and-fill effect.
                  backgroundColor: transparent,
                  borderColor: hasFocus ? fillColor : transparent,
                  borderRadius: outerWidth / 2 * PPM,
                  borderWidth: borderWidthAnim,
                  height: outerWidth * PPM - this.ringWidth * 2,
                  position: 'absolute',
                  // Position directly on top of the above view.
                  transform: [
                    { translateX: -this.initialBorderWidth },
                    { translateY: this.initialBorderWidth },
                  ],
                  width: outerWidth * PPM - this.ringWidth * 2,
                }}
              />
              <Image
                style={{
                  height: innerWidth * PPM,
                  width: innerWidth * PPM,
                }}
                source={source}
              />
            </View>
          )}
          {isLoading && <LoadingSpinner pixelsPerMeter={PPM} />}
        </View>
        {hasFocus
        && (
          <Text
            style={{
              backgroundColor: 'white',
              color: '#e63b0d',
              fontSize: height * PPM * 0.7,
              height: height * PPM,
              marginLeft: 0.05 * PPM,
              marginTop: (outerWidth - innerWidth) / 2 * PPM,
              padding: 0.1 * pixelsPerMeter,
              left: outerWidth * pixelsPerMeter + 0.05 * PPM,
              textAlign: 'center',
              textAlignVertical: 'auto',
            }}
          >
            {textLabel}
          </Text>
        )}
      </VrButton>
    );
  }
}

NextRoomButton.propTypes = {
  isLoading: PropTypes.bool,
  onEnterSound: PropTypes.shape({
    uri: PropTypes.string,
  }),
  onExitSound: PropTypes.shape({
    uri: PropTypes.string,
  }),
  onLongClickSound: PropTypes.shape({
    uri: PropTypes.string,
  }),
  onClickSound: PropTypes.shape({
    uri: PropTypes.string,
  }),
  pixelsPerMeter: PropTypes.number,
  rotateY: PropTypes.number,
  translateX: PropTypes.number,
  translateZ: PropTypes.number,
  height: PropTypes.number,
  outerWidth: PropTypes.number,
  delay: PropTypes.number,
  innerWidth: PropTypes.number,
  textLabel: PropTypes.string,
  source: PropTypes.shape({
    uri: PropTypes.string,
  }).isRequired,
  onInput: PropTypes.func,
};

NextRoomButton.defaultProps = {
  delay: 2000,
  height: 0.3,
  innerWidth: 0.3,
  isLoading: false,
  outerWidth: 0.5,
  onInput: null,
  pixelsPerMeter: 1,
  rotateY: 0,
  textLabel: 'go',
  translateX: 0,
  translateZ: 0,
};

export default NextRoomButton;
