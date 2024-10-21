import { useState, useRef } from "react";
import PropTypes from 'prop-types';
import Input from "../../shared/InputSection/InputSection";
import FileInput from "../../shared/InputFileSection/InputFileSection";
import utilities from "../../../../../utilities/utilities";
import formValidations from "../../../../../utilities/formValidations";
const apiUrl = import.meta.env.VITE_API_URL;

const NewVideo = ({ courseID, classID, topicID, reset  }) => {
  const [validations, setValidations] = useState({});
  const [oldData, setOldData] = useState({ title: "",  video: null });
  const form = useRef(null);

  const updateForm = (field, value) => {
    setOldData(utilities.updateInput(field, value, oldData));
  };

  const updateFileForm = (file) => {
    if (file) {
      setOldData((prevData) => ({ ...prevData, video: file }));
    }
  };

  return (
    <form className="panel-form" ref={form} >

      <Input
        type="text"
        name="title"
        id="title"
        value={oldData.title}
        label="Título del video"
        onChange={updateForm}
        styles="section-flex"
        validations={validations}
      />

      <FileInput
        name="video"
        id="video"
        label="Video a subir"
        onChange={updateFileForm}
        styles="section-flex"
        validations={validations}
      />

      <span className="success">
        {validations.success ? validations.success : "\u00A0 "}
      </span>

      <button type="submit">Crear</button>
    </form>
  );
};

NewVideo.propTypes = {
  courseID: PropTypes.string.isRequired,
  classID: PropTypes.string.isRequired,
  topicID: PropTypes.string.isRequired,
  reset: PropTypes.func.isRequired,
};

export default NewVideo;
