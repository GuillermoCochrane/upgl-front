import PropTypes from "prop-types";
const apiUrl = import.meta.env.VITE_API_URL;

function Figure({Data}) {
  return (
    <figure>
        <img 
          src={`${apiUrl}${Data.img}`}
          alt={Data.alt}
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