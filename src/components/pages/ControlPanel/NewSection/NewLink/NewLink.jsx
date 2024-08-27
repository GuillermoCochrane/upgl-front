/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import Input from "../../../../partials/ControlPanel/InputSection/InputSection";
const apiUrl = import.meta.env.VITE_API_URL;
import formValidations from "../../../../../utilities/formValidations";


const NewLink = ({ courseID, classID, topicID  }) => {
  return (
    <form className="panel-form">
      <label htmlFor="">Hipervínculo</label>
      <input type="text" />
    </form>
  )
}

NewLink.propTypes = {
  courseID: PropTypes.string.isRequired,
  classID: PropTypes.string.isRequired,
  topicID: PropTypes.string.isRequired,
};

export default NewLink;