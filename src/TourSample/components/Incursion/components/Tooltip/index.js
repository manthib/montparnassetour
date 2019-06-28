import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-vr';


import ImageTooltip from './components/ImageTooltip';
import PanelImageTooltip from './components/PanelImageTooltip';
import TextBlockTooltip from './components/TextBlockTooltip';
import VideoTooltip from './components/VideoTooltip';

/**
 * Tooltip encapsulates the different tooltip types used with the InfoButton
 * and renders either an image, image with text overlay, or text block.
 *
 * When using with CylinderLayer, set pixelsPerMeter to convert units, otherise
 * set translateZ to specify distance between camera and tooltip.
 */
const Tooltip = (props) => {
  const { tooltip, pixelsPerMeter: PPM } = props;

  switch (tooltip.type) {
  case 'image':
    return <ImageTooltip tooltip={tooltip} pixelsPerMeter={PPM} />;
  case 'panelimage':
    return <PanelImageTooltip tooltip={tooltip} pixelsPerMeter={PPM} />;
  case 'textblock':
    return <TextBlockTooltip tooltip={tooltip} pixelsPerMeter={PPM} />;
  case 'video':
    return <VideoTooltip tooltip={tooltip} pixelsPerMeter={PPM} />;
  default:
    return <Text style={{ backgroundColor: 'red' }}>Missing Tooltip</Text>;
  }
};

Tooltip.propTypes = {
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

Tooltip.defaultProps = {
  pixelsPerMeter: 1,
};

export default Tooltip;
