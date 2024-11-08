import  loadingImg from "../../../../assets/images/preloader.gif"
import PropTypes from "prop-types";
function Loader({loaderStyles}) {
	console.log(loaderStyles);
	return (
		<figure className={loaderStyles}>
			<img 
				src={loadingImg}
				alt="Cargando..."
				title="Cargando..."
				className="loader"
			/>
		</figure>
	);
}

Loader.propTypes = {
	loaderStyles: PropTypes.string.isRequired,
};

export default Loader;