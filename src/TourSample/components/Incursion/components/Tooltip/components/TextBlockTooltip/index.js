import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-vr';

const TextBlockTooltip = (props) => {
  const { tooltip, pixelsPerMeter: PPM } = props;

  const fontSize = {
    attrib: 0.05 * PPM,
    text: 0.1 * PPM,
    title: 0.15 * PPM,
  };

  return (
    <View
      style={{
        backgroundColor: 'black',
        padding: 0.1 * PPM,
      }}
    >
      <Text
        style={{
          color: '#e63b0d',
          fontSize: fontSize.title,
          width: tooltip.width * PPM,
        }}
      >
        {tooltip.title}
      </Text>
      {tooltip.title
      && (
        <View
          style={{
            // If we have a title, make thin line to separate title and text.
            backgroundColor: '#777879',
            height: 0.01 * PPM,
            width: tooltip.width * PPM,
          }}
        />
      )}
      <Text
        style={{
          color: '#e63b0d',
          fontSize: fontSize.text,
          width: tooltip.width * PPM,
        }}
      >
        {tooltip.text}
      </Text>
      {tooltip.attribution
      && (
        <Text
          style={{
            color: '#e63b0d',
            fontSize: fontSize.attrib,
            right: 0.02 * PPM,
            textAlign: 'right',
          }}
        >
          {tooltip.attribution}
        </Text>
      )}
    </View>
  );
};

TextBlockTooltip.propTypes = {
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

export default TextBlockTooltip;
