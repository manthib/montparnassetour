import React from 'react';
import PropTypes from 'prop-types';
import { asset, Image, Text } from 'react-vr';

const ImageTooltip = (props) => {
  const { tooltip, pixelsPerMeter: PPM } = props;

  const fontSize = {
    attrib: 0.05 * PPM,
  };

  return (
    <Image
      style={{
        borderColor: '#777879',
        borderWidth: 0.01 * PPM,
        height: tooltip.height * PPM,
        justifyContent: 'flex-end',
        width: tooltip.width * PPM,
      }}
      source={asset(tooltip.source)}
    >
      {tooltip.attribution
      && (
        <Text
          style={{
            color: '#e63b0d',
            fontSize: fontSize.attrib,
            right: 0.02 * PPM,
            textAlign: 'right',
            textAlignVertical: 'bottom',
          }}
        >
          {tooltip.attribution}
        </Text>
      )}
    </Image>
  );
};

ImageTooltip.propTypes = {
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

export default ImageTooltip;
