import React from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
import PropTypes from "prop-types";

const VideoPlayer = ({ Data }) => {
  return (
    <video
      src={`${apiUrl}${Data.video}`}
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