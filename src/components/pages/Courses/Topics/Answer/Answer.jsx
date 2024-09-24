import PropTypes from "prop-types";
const apiUrl = import.meta.env.VITE_API_URL;
function Answer({Data}) {
  return (
          <details >
            <summary>{Data[0].alt}</summary>
            {
              Data.map ((item, index) => (
                <figure key={index}>
                  <img src={`${apiUrl}${item.img}`} alt={item.alt} />
                </figure>
              ))
            }
          </details>
  );
}

Answer.propTypes = {
  Data: PropTypes.array.isRequired,
}

export default Answer;