import PropTypes from "prop-types";
import Figure from "../Figure/Figure";

function Answer({Data}) {
  return (
          <details >
            <summary>{Data[0].alt}</summary>
            {
              Data.map ((item, index) => (
                <Figure key={index} Data={item} />
              ))
            }
          </details>
  );
}

Answer.propTypes = {
  Data: PropTypes.array.isRequired,
}

export default Answer;