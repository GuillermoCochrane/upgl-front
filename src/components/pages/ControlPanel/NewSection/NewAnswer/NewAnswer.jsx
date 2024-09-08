import { useState, useRef } from "react";
import PropTypes from 'prop-types';
import Input from "../../shared/InputSection/InputSection";
import FileInput from "../../shared/InputFileSection/InputFileSection";
import utilities from "../../../../../utilities/utilities";
import formValidations from "../../../../../utilities/formValidations";
const apiUrl = import.meta.env.VITE_API_URL;

const NewAnswer = ({ courseID, classID, topicID  }) => {
  const [validations, setValidations] = useState({});
  const [oldData, setOldData] = useState({ title: "",  alt: "", image: null });
  const form = useRef(null);

  const titleError = "El título de la respuesta";
  const altError = "El texto alternativo";
  const imageError = "La imagen";

  const updateForm = (field, value) => {
    setOldData(utilities.updateInput(field, value, oldData));
  };

  const updateFileForm = (file) => {
    if (file) {
      setOldData((prevData) => ({ ...prevData, image: file }));
    }
  };

  const validateTitle = () => {
    let newValidations = formValidations.required('title', titleError, form, validations);
    if (form.current.elements['title'].value) {
        newValidations = formValidations.min('title', titleError, form, newValidations, 2);
        if (!newValidations.title) {
            newValidations = formValidations.max('title', titleError, form, newValidations, 30);
        }
    }
    setValidations(newValidations);
    utilities.validationsAlerts('title', newValidations, form);
  };

  const validateAlt = () => {
    let newValidations = formValidations.required('alt', altError, form, validations);
    if (form.current.elements['alt'].value) {
        newValidations = formValidations.min('alt', altError, form, newValidations, 2);
        if (!newValidations.alt) {
            newValidations = formValidations.max('alt', altError, form, newValidations, 50);
        }
    }
    setValidations(newValidations);
    utilities.validationsAlerts('alt', newValidations, form);
  };

  const validateFile = () => {
    let allowedExtensions = ['.bmp', '.png', '.jpg', '.gif', '.webp', '.svg'];
    let newValidations = formValidations.requiredFile('image', imageError, form, validations);
    if (form.current.elements['image'].files.length) {
        newValidations = formValidations.fileExtension('image', form, newValidations, allowedExtensions);
    }
    setValidations(newValidations);
    utilities.validationsAlerts('image', newValidations, form);
  };

  const createFigure = async (e) => {
    e.preventDefault();

    let type = "answer";
    let title = form.current.elements.title.value;
    let alt = form.current.elements.alt.value;
    let endpoint = `${apiUrl}api/course/newAnswer/${courseID.toLowerCase()}/${classID}/${topicID}`;
    let data = new FormData(); 

    data.append('title', title);
    data.append('type', type);
    data.append('alt', alt);
    if (oldData.image) {
      data.append('image', oldData.image);
    }

    let formData = utilities.fetchData(data, true);

    try {
      const response = await fetch(endpoint, formData);
      const result = await response.json();
      
      if (result.meta.created) {
        setValidations({ success: "Se creó la imagen" });
        setOldData({ title: "", alt: "", image: null });
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
    <form className="panel-form" ref={form} onSubmit={createFigure}>

      <Input
        type="text"
        name="title"
        id="title"
        value={oldData.title}
        label="Título de la Respuesta"
        onChange={updateForm}
        onInput={validateTitle}
        onBlur={validateTitle}
        styles="section-flex"
        validations={validations}
      />

      <Input
        type="text"
        name="alt"
        id="alt"
        value={oldData.alt}
        label="Texto alternativo"
        onChange={updateForm}
        onBlur={validateAlt}
        onInput={validateAlt}
        styles="section-flex"
        validations={validations}
      />

      <FileInput
        name="image"
        id="image"
        label="Imagen a subir"
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
  )
}

NewAnswer.propTypes = {
  courseID: PropTypes.string.isRequired,
  classID: PropTypes.string.isRequired,
  topicID: PropTypes.string.isRequired,
};

export default NewAnswer;