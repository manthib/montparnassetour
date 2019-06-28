import React from 'react';
import PropTypes from 'prop-types';
import {
  asset, Image, Text, View,
} from 'react-vr';

const PanelImageTooltip = (props) => {
  const { tooltip, pixelsPerMeter: PPM } = props;
  const fontSize = {
    attrib: 0.05 * PPM,
    text: 0.1 * PPM,
    title: 0.15 * PPM,
  };
  const margin = 0.05 * PPM;
  const titleOpacity = 0.60;

  return (
    <View
      style={{
        borderColor: '#777879',
        borderWidth: 0.01 * PPM,
      }}
    >
      <Image
        style={{
          height: tooltip.height * PPM,
          width: tooltip.width * PPM,
          justifyContent: 'flex-end',
        }}
        source={asset(tooltip.source)}
      >

        {tooltip.title
        && (
          <View>
            <View
              style={{
                backgroundColor: 'black',
                // Lower this transparent view so it appears behind the title.
                bottom: -fontSize.title - margin,
                height: fontSize.title + margin,
                opacity: titleOpacity,
                position: 'relative',
              }}
            />
            <Text
              style={{
                color: '#e63b0d',
                fontSize: fontSize.title,
                flex: 1,
                height: fontSize.title + margin,
                marginLeft: margin,
                marginRight: margin,
                textAlignVertical: 'bottom',
              }}
            >
              {tooltip.title}
            </Text>
          </View>
        )}
      </Image>

      <View
        style={{
          backgroundColor: 'black',
          // Place attribution in bottom margin.
          paddingBottom: tooltip.attribution ? 0 : margin,
          paddingLeft: margin,
          paddingRight: margin,
          paddingTop: 0,
          width: tooltip.width * PPM,
        }}
      >
        <Text
          style={{
            color: '#e63b0d',
            fontSize: fontSize.text,
            textAlignVertical: 'center',
          }}
        >
          {tooltip.text}
        </Text>
        {tooltip.attribution
        && (
          <Text
            style={{
              fontSize: fontSize.attrib,
              right: -margin + 0.02 * PPM,
              textAlign: 'right',
            }}
          >
            {tooltip.attribution}
          </Text>
        )}
      </View>
    </View>
  );
};

PanelImageTooltip.propTypes = {
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

export default PanelImageTooltip;
