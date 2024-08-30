import PropTypes from "prop-types";
const apiUrl = import.meta.env.VITE_API_URL;
import { useRef } from "react";

function Figure({Data}) {
  const $img = useRef(null);

	const zoom = () => {
		if (window.innerWidth < 768) {
			$img.current.classList.toggle("enlarged");
	}}

  return (
    <figure>
        <img 
          src={`${apiUrl}${Data.img}`}
          alt={Data.alt}
          title={Data.alt}
          onClick={zoom}
          ref={$img}
          className={ 
            Data.style == "icon" ? "icon" : 
            Data.style == "info" ? "info" : 
            ""} />
    </figure>
  );
}

Figure.propTypes = {
  Data: PropTypes.object.isRequired
};

export default Figure;