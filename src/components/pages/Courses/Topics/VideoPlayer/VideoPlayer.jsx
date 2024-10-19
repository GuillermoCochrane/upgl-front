import React from 'react';
import PropTypes from "prop-types";

const VideoPlayer = ({ Data }) => {
  return (
    <video
      src={Data.src}
      autoPlay={Data.autoPlay}
      loop={Data.loop}
      muted={Data.muted}
      poster={Data.poster}
      controls
      controlsList={Data.controlsList}
    >
      Tu navegador no admite el elemento <code>video</code>.
    </video>
  );
};

VideoPlayer.propTypes = {
  Data: PropTypes.object.isRequired
};

export default VideoPlayer;