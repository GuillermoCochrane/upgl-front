import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
const apiUrl = import.meta.env.VITE_API_URL;
import formValidations from "../../../../../utilities/formValidations";


const NewTrivia = ({ courseID, classID, topicID  }) => {
  return (
    <form className="panel-form">
      <label htmlFor="">Trivia</label>
      <input type="text" />
    </form>
  )
}

NewTrivia.propTypes = {
  courseID: PropTypes.string.isRequired,
  classID: PropTypes.string.isRequired,
  topicID: PropTypes.string.isRequired,
};

export default NewTrivia;