import PropTypes from "prop-types";
const apiUrl = import.meta.env.VITE_API_URL;
function LocalDownload({Data}) {
    return (
            <>
            {
                Data.map((item, index) => (
                    <a href={`${apiUrl}${item.file}`} download={item.filename} target="_blank" rel="noopener noreferrer" role="button" key={index}>
                        { item.text }
                    </a>
                ))
            }
            </>
        
    );
}

LocalDownload.propTypes = {
    Data: PropTypes.array.isRequired
};

export default LocalDownload;