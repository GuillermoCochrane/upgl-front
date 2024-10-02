import PropTypes from "prop-types";
const apiUrl = import.meta.env.VITE_API_URL;
import { useRef, useState, useEffect  } from "react";

function Figure({Data}) {
  const [openModal, setOpenModal] = useState(false);
  const $img = useRef(null);
  const $modal = useRef(null);
  const mobile = window.innerWidth < 768;

	const zoom = () => {
		if (mobile) {
			$img.current.classList.toggle("enlarged");
	}}

  const modalManager = () => {
    if (openModal) {
      setOpenModal(false);
    } else {
      setOpenModal(true);
    }
  }

  useEffect(() => {
    if (openModal) {
      $modal && $modal.current.showModal();
    } else {
      $modal && $modal.current.close();
    }
  }, [openModal]);

  return (
    <figure>
        <img 
          src={`${apiUrl}${Data.img}`}
          alt={Data.alt}
          title={Data.alt}
          onClick={modalManager}
          className={ 
            Data.style == "icon" ? "icon" : 
            Data.style == "info" ? "info" : 
            ""} 
        />
        {
          (Data.style != "info" && Data.style != "icon" && mobile) &&
            <dialog ref={$modal}>
              <img 
                src={`${apiUrl}${Data.img}`}
                alt={Data.alt}
                title={Data.alt}
                onClick={zoom}
                ref={$img}
              />
              <button onClick={modalManager}>Cerrar</button>
            </dialog>
        }
    </figure>
  );
}

Figure.propTypes = {
  Data: PropTypes.object.isRequired
};

export default Figure;