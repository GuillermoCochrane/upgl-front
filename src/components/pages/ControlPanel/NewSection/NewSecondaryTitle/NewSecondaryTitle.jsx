import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import Input from "../../shared/InputSection/InputSection";
import Select from "../../shared/SelectSection/SelectSection";
import formValidations from "../../../../../utilities/formValidations";
import utilities from "../../../../../utilities/utilities";
const apiUrl = import.meta.env.VITE_API_URL;


const NewSecondaryTitle = ({ courseID, classID, topicID, reset  }) => {
  let [validations, setValidations] = useState({});
  let [stylesSelectors, setStylesSelectors] = useState([]);
  let [oldData, setOldData] = useState({ text: "", content: "" });
  const form = useRef(null);

  const textError = "El título principal";
  const contentError = "El estilo del texto";

  const updateForm = (field, value) => {
    setOldData(utilities.updateInput(field, value, oldData));
  };

  const validateText = () => {
    let newValidations = formValidations.required('text', textError, form, validations);
    if (form.current.elements['text'].value) {
        newValidations = formValidations.min('text', textError, form, newValidations, 3); 
        if (!newValidations.text) {
            newValidations = formValidations.max('text', textError, form, newValidations, 35);
        }
    }
    setValidations(newValidations);
    utilities.validationsAlerts('text', newValidations, form);
  };

  const validateContent = (value) => {
    const newValidations = formValidations.required('content', contentError, form, validations);
    if (value) {
      delete newValidations.content; 
    }
    setValidations(newValidations);
    utilities.validationsAlerts('content', newValidations, form);
  }

  const validateAllFields = () => {
    let newValidations = {};
    newValidations = formValidations.required('text', textError, form, newValidations);
    newValidations = formValidations.required('content', contentError, form, newValidations);

    setValidations(newValidations);
    return Object.keys(newValidations).length === 0; 
  };

  const createH4 = async (e) => {
    e.preventDefault();

    if (!validateAllFields()) {
      return; 
    }

    let text = form.current.elements.text.value;
    let content = form.current.elements.content.value;
    let type = "h4"
    let endpoint = `${apiUrl}api/course/newH4/${courseID.toLowerCase()}/${classID}/${topicID}`;
    let data = { text, type, content };
    let formData = utilities.fetchData(data);

    try {
      const response = await fetch(endpoint, formData);
      const data = await response.json();
      
      if (data.meta.created) {
        setValidations({success: `Se creo el Título Secundario`});
        setOldData({text:"", content:""});
        reset();
      } else {
        setValidations(data.errors);
        setOldData(data.oldData);
      }
    }
    catch (error) {
      setValidations(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    let fetchStyles = async () => {
      let stylesData = await utilities.fetchStylesData();
      setStylesSelectors(stylesData);
    }
    fetchStyles();
  }, []);

  return (
    <form className="panel-form" ref={form} onSubmit={createH4}>

      <Input
        type = "text"
        name = "text"
        id = "text"
        value = {oldData.text}
        label = "Título secundario"
        onChange = {updateForm}
        onBlur={validateText}
        onInput={validateText}
        styles = {"section-flex"}
        validations = {validations}
      />

      <Select
        styles = {"section-flex"}
        name = "content"
        id = "content"
        value = {oldData.content}
        label = "Estilo del texto"
        onChange = {updateForm}
        onBlur={validateContent}
        options = {stylesSelectors}
        validations = {validations}
        optionReferences ={{value: "id", name: "title"}}
      />

        <span className="success">
          {validations.success ? validations.success : "\u00A0 "}
        </span>

      <button type="submit">Crear</button>
    </form>
  )
}

NewSecondaryTitle.propTypes = {
  courseID: PropTypes.string.isRequired,
  classID: PropTypes.string.isRequired,
  topicID: PropTypes.string.isRequired,
  reset: PropTypes.func.isRequired,
};

export default NewSecondaryTitle;