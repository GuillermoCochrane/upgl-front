import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import Input from "../../shared/InputSection/InputSection";
import Select from "../../shared/SelectSection/SelectSection";
import formValidations from "../../../../../utilities/formValidations";
import utilities from "../../../../../utilities/utilities";
const apiUrl = import.meta.env.VITE_API_URL;


const NewYoutube = ({ courseID, classID, topicID, reset  }) => {
  let [validations, setValidations] = useState({});
  let [stylesSelectors, setStylesSelectors] = useState([]);
  let [oldData, setOldData] = useState({ text: "", content: "", link: "" });
  const form = useRef(null);

  const updateForm = (field, value) => {
    setOldData(utilities.updateInput(field, value, oldData));
  };

  return (
    <form className="panel-form" ref={form} >
      <Input
        type = "text"
        name = "title"
        id = "title"
        value = {oldData.title}
        label = "Titulo del video"
        onChange = {updateForm}
        styles = {"section-flex"}
        validations = {validations}
      />

      <Input
        type = "text"
        name = "link"
        id = "link"
        value = {oldData.link}
        label = "URL del video"
        onChange = {updateForm}
        styles = {"section-flex"}
        validations = {validations}
        />

        <Input
          type = "number"
          name = "width"
          id = "width"
          value = {oldData.width}
          label = "Ancho del video"
          onChange = {updateForm}
          styles = {"section-flex"}
          validations = {validations}
          />

          <Input
            type = "number"
            name = "height"
            id = "height"
            value = {oldData.height}
            label = "Alto del video"
            onChange = {updateForm}
            styles = {"section-flex"}
            validations = {validations}
            />

        <span className="success">
          {validations.success ? validations.success : "\u00A0 "}
        </span>

        <button type="submit">Crear</button>
    </form>
  )
}

NewYoutube.propTypes = {
  courseID: PropTypes.string.isRequired,
  classID: PropTypes.string.isRequired,
  topicID: PropTypes.string.isRequired,
  reset: PropTypes.func.isRequired,
};

export default NewYoutube;