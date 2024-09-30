import { useState, useRef } from "react";
import PropTypes from 'prop-types';
import Input from "../../shared/InputSection/InputSection";
import FileInput from "../../shared/InputFileSection/InputFileSection";
import utilities from "../../../../../utilities/utilities";
import formValidations from "../../../../../utilities/formValidations";
const apiUrl = import.meta.env.VITE_API_URL;

const textError = "El texto del enlace";
const fileError = "El Archivo";


const NewLocalDownload = ({ courseID, classID, topicID, reset  }) => {
  const [validations, setValidations] = useState({});
  const [oldData, setOldData] = useState({ text: "", file: null });
  const form = useRef(null);

  const updateForm = (field, value) => {
    setOldData(utilities.updateInput(field, value, oldData));
  };

  const updateFileForm = (file) => {
    if (file) {
      setOldData((prevData) => ({ ...prevData, file: file }));
    }
  };

  const validateText = () => {
    let newValidations = formValidations.required('text', textError, form, validations);
    if (form.current.elements['text'].value) {
        newValidations = formValidations.min('text', textError, form, newValidations, 2);
        if (!newValidations.text) {
            newValidations = formValidations.max('text', textError, form, newValidations, 30);
        }
    }
    setValidations(newValidations);
    utilities.validationsAlerts('text', newValidations, form);
  };

  const validateFile = () => {
    let allowedExtensions = [".zip", ".rar", ".pdf", ".txt", ".md", ".docx", ".xlsx", ".pptx"];
    let newValidations = formValidations.requiredFile('file', fileError, form, validations);
    if (form.current.elements['file'].files.length) {
        newValidations = formValidations.fileExtension('file', form, newValidations, allowedExtensions);
    }
    setValidations(newValidations);
    utilities.validationsAlerts('file', newValidations, form);
  };

  const createDownload = async (e) => {
    e.preventDefault();

    let type = "localDownload";
    let text = form.current.elements.text.value;
    let endpoint = `${apiUrl}api/course/newLocalDownload/${courseID.toLowerCase()}/${classID}/${topicID}`;
    let data = new FormData(); 

    data.append('text', text);
    data.append('type', type);
    if (oldData.file) {
      data.append('file', oldData.file);
    }

    let formData = utilities.fetchData(data, true);

    try {
      const response = await fetch(endpoint, formData);
      const result = await response.json();
      
      if (result.meta.created) {
        setValidations({ success: "Se creó el enlace" });
        setOldData({ text: "", file: null });
        reset();
      } else {
        setValidations(result.errors);
        setOldData(result.oldData);
      }
    } catch (error) {
      setValidations({ error: error.message });
      console.log(error);
    }    
  };

  return (
    <form className="panel-form" ref={form} onSubmit={createDownload}>

      <Input
        type="text"
        name="text"
        id="text"
        value={oldData.text}
        label="Texto del enlace"
        onChange={updateForm}
        onBlur={validateText}
        onInput={validateText}
        styles="section-flex"
        validations={validations}
      />

      <FileInput
        name="file"
        id="file"
        label="Archivo para descargar"
        onChange={updateFileForm}
        onBlur={validateFile}
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

NewLocalDownload.propTypes = {
  courseID: PropTypes.string.isRequired,
  classID: PropTypes.string.isRequired,
  topicID: PropTypes.string.isRequired,
  reset: PropTypes.func.isRequired,
};

export default NewLocalDownload;
