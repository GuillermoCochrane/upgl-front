import React from 'react';
import PropTypes from "prop-types";

const VideoPlayer = ({ videoSrc, posterImage, isAutoPlay = false, isLoop = false, isMuted = false, controlsList }) => {
  return (
    <video
      src={videoSrc}
      autoPlay={isAutoPlay}
      loop={isLoop}
      muted={isMuted}
      poster={posterImage}
      controls
      controlsList={controlsList}
    >
      Tu navegador no admite el elemento <code>video</code>.
    </video>
  );
};

VideoPlayer.propTypes = {
  videoSrc: PropTypes.string.isRequired,
  posterImage: PropTypes.string,
  isAutoPlay: PropTypes.bool,
  isLoop: PropTypes.bool,
  isMuted: PropTypes.bool,
  controlsList: PropTypes.string,
};

export default VideoPlayer;