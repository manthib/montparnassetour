import React from 'react';
import {
  AppRegistry, asset, Pano, Sound, View, CylindricalPanel,
} from 'react-vr';
import PropTypes from 'prop-types';

import Incursion from './components/Incursion';
import NextRoomButton from './components/NextRoomButton';
import LoadingSpinner from './components/LoadingSpinner';

// Web VR is only able to support a maxiumum texture resolution of 4096 px
const MAX_TEXTURE_WIDTH = 4096;
const MAX_TEXTURE_HEIGHT = 720;
// Cylinder is a 2D surface a fixed distance from the camera.
// It uses pixes instead of meters for positioning components.
// pixels = degrees/360 * density, negative to rotate in expected direction.
const degreesToPixels = degrees => -(degrees / 360) * MAX_TEXTURE_WIDTH;
// PPM = 1/(2*PI*Radius) * density. Radius of cylinder is 3 meters.
const PPM = 1 / (2 * Math.PI * 3) * MAX_TEXTURE_WIDTH;

/**
 * ReactVR component that allows a simple tour using linked 360 photos.
 * Tour includes nav buttons, activated by gaze-and-fill or direct selection,
 * that move between tour locations and info buttons that display tooltips with
 * text and/or images. Tooltip data and photo URLs are read from a JSON file.
 */
class TourSample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      locationId: null,
      nextLocationId: null,
    };
  }

  componentDidMount() {
    const { tourSource } = this.props;
    fetch(asset(tourSource).uri)
      .then(response => response.json())
      .then((responseData) => {
        this.init(responseData);
      })
      .done();
  }

  init(tourConfig) {
    // Initialize the tour based on data file.
    this.setState({
      data: tourConfig,
      locationId: null,
      nextLocationId: tourConfig.firstPhotoId,
    });
  }

  render() {
    const { data, locationId, nextLocationId } = this.state;

    if (!data) {
      return null;
    }

    const { soundEffects } = data;
    const { ambient } = soundEffects;

    const photoData = (locationId && data.photos[locationId]) || null;
    const tooltips = (photoData && photoData.tooltips) || null;
    const rotation = data.firstPhotoRotation + ((photoData && photoData.rotationOffset) || 0);
    const isLoading = nextLocationId !== locationId;

    return (
      <View>
        <View style={{ transform: [{ rotateY: rotation }] }}>
          {ambient
            && (
              <Sound
              // Background audio that plays throughout the tour.
                source={asset(ambient.uri)}
                autoPlay
                loop={ambient.loop}
                volume={ambient.volume}
              />
            )}
          <Pano
            // Place pano in world, and by using position absolute it does not
            // contribute to the layout of other views.
            style={{
              position: 'absolute',
              tintColor: isLoading ? 'grey' : 'white',
            }}
            onLoad={() => {
              this.setState({
                // Now that ths new photo is loaded, update the locationId.
                locationId: nextLocationId,
              });
            }}
            source={asset(data.photos[nextLocationId].uri)}
          />
          <CylindricalPanel
            layer={{
              width: MAX_TEXTURE_WIDTH,
              height: MAX_TEXTURE_HEIGHT,
              density: MAX_TEXTURE_WIDTH,
            }}
            style={{ position: 'absolute' }}
          >
            <View
              style={{
                // View covering the cyldiner. Center so contents appear in middle of cylinder.
                alignItems: 'center',
                justifyContent: 'center',
                width: MAX_TEXTURE_WIDTH,
                height: MAX_TEXTURE_HEIGHT,
              }}
            >
              {/*
              Need container view, else using absolute position on buttons
              removes them from cylinder
              */}
              <View>
                {tooltips
                  && tooltips.map((tooltip) => {
                    // Iterate through items related to this location, creating either
                    // info buttons, which show tooltip on hover, or nav buttons, which
                    // change the current location in the tour.
                    if (tooltip.type) {
                      return (
                        <Incursion
                          key={tooltip.id}
                          onEnterSound={asset(soundEffects.navButton.onEnter.uri)}
                          pixelsPerMeter={PPM}
                          source={asset('info_icon.png')}
                          tooltip={tooltip}
                          translateX={degreesToPixels(tooltip.rotationY)}
                        />
                      );
                    }
                    return (
                      <NextRoomButton
                        key={tooltip.linkedPhotoId}
                        isLoading={isLoading}
                        onClickSound={asset(soundEffects.navButton.onClick.uri)}
                        onEnterSound={asset(soundEffects.navButton.onEnter.uri)}
                        onInput={() => {
                          // Update nextLocationId, not locationId, so tooltips match
                          // the currently visible pano; pano will update locationId
                          // after loading the new image.
                          this.setState({
                            nextLocationId: tooltip.linkedPhotoId,
                          });
                        }}
                        pixelsPerMeter={PPM}
                        source={asset(data.nav_icon)}
                        textLabel={tooltip.text}
                        translateX={degreesToPixels(tooltip.rotationY)}
                      />
                    );
                  })}
                {locationId == null
                  // Show a spinner while first pano is loading.
                  && (
                    <LoadingSpinner
                      style={{ layoutOrigin: [0.5, 0.5] }}
                      pixelsPerMeter={PPM}
                      // Undo the rotation so spinner is centered
                      translateX={degreesToPixels(rotation) * -1}
                    />
                  )}
              </View>
            </View>
          </CylindricalPanel>
        </View>
      </View>
    );
  }
}

TourSample.propTypes = {
  tourSource: PropTypes.string,
  onEnterSound: PropTypes.shape({
    uri: PropTypes.string,
  }),
  source: PropTypes.shape({
    uri: PropTypes.string,
  }),
  tooltip: PropTypes.shape({
    id: PropTypes.string,
    attribution: PropTypes.string,
    attributionUri: PropTypes.string,
    height: PropTypes.number,
    rotationY: PropTypes.number,
    source: PropTypes.string,
    text: PropTypes.string,
    type: PropTypes.string,
    width: PropTypes.number,
  }),
};

TourSample.defaultProps = {
  tourSource: 'tourOfTheChester.json',
};

// Name used to create module, via reactNativeContext.createRootView('TourSample')
AppRegistry.registerComponent('TourSample', () => TourSample);

export default TourSample;
