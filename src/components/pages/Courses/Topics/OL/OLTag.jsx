import PropTypes from "prop-types";
import utilities from "../../../../../utilities/utilities";
import LI from "../shared/LI/LITag";

function OLTag({Data}) {
  Data = utilities.arrayOrderer(Data, "order", true);
  return (
    <ol>
        {
          Data.map((liData,index) => 
          <LI key={index} Data={liData}/>) 
        }
    </ol>
  );
}

OLTag.propTypes = {
  Data: PropTypes.array.isRequired,
}
export default OLTag; 