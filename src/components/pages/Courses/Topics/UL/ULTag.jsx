import PropTypes from "prop-types";
import LI from "../shared/LI/LITag";
import utilities from "../../../../../utilities/utilities";

function ULTag({Data}) {
  Data = utilities.arrayOrderer(Data, "order", true);
  return (
    <ul>
        {
          Data.map((liData,index) => 
          <LI key={index} Data={liData}/>) 
        }
    </ul>
  );
}

ULTag.propTypes = {
  Data: PropTypes.array.isRequired,
}
export default ULTag; 