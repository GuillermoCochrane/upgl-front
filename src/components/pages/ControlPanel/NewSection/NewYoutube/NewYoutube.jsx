import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import Input from "../../shared/InputSection/InputSection";
import formValidations from "../../../../../utilities/formValidations";
import utilities from "../../../../../utilities/utilities";
const apiUrl = import.meta.env.VITE_API_URL;


const NewYoutube = ({ courseID, classID, topicID, reset  }) => {
  let [validations, setValidations] = useState({});
  let [oldData, setOldData] = useState({ title: "",  link: "", width: "", height: "" });
  const form = useRef(null);

  const titleError = "El titulo del video";
  const linkError = "La URL";
  const widthError = "El ancho del video";
  const heightError = "El alto del video";

  const updateForm = (field, value) => {
    setOldData(utilities.updateInput(field, value, oldData));
  };

  const validateTitle = () => {
    let newValidations = formValidations.required('title', titleError, form, validations);
    if (form.current.elements['title'].value) {
        newValidations = formValidations.min('title', titleError, form, newValidations, 3); 
        if (!newValidations.title) {
          newValidations = formValidations.max('title', titleError, form, newValidations, 35);
        }
    } 
    setValidations(newValidations);
    utilities.validationsAlerts('title', newValidations, form);
  };

  const validateLink = () => {
    let newValidations = formValidations.required('link', linkError, form, validations);
    if (form.current.elements['link'].value) {
        newValidations = formValidations.min('link', linkError, form, newValidations, 9);
        if (!newValidations.link) {
            newValidations = formValidations.url('link', linkError, form, newValidations);
        }
    }
    setValidations(newValidations);
    utilities.validationsAlerts('link', newValidations, form);
  };

  const validatHeight = () => {
    let newValidations = formValidations.required('height', heightError, form, validations);
    if (form.current.elements['height'].value) {
        newValidations = formValidations.numeric('height', heightError, form, newValidations);
        if (!newValidations.height) {
            newValidations = formValidations.min('height', heightError, form, newValidations, 2);
        }
    }
    setValidations(newValidations);
    utilities.validationsAlerts('height', newValidations, form);
  };

  const validatWidth = () => {
    let newValidations = formValidations.required('width', widthError, form, validations);
    if (form.current.elements['width'].value) {
        newValidations = formValidations.numeric('width', widthError, form, newValidations);
        if (!newValidations.width) {
            newValidations = formValidations.min('width', widthError, form, newValidations, 2);
        }
    }
    setValidations(newValidations);
    utilities.validationsAlerts('width', newValidations, form);
  };

  const validateAllFields = () => {
    let newValidations = {};
    newValidations = formValidations.required('title', titleError, form, newValidations);
    newValidations = formValidations.required('link', linkError, form, newValidations);
    newValidations = formValidations.required('width', widthError, form, newValidations);
    newValidations = formValidations.required('height', heightError, form, newValidations);
    setValidations(newValidations);
    return Object.keys(newValidations).length === 0; 
  };

  const createYouTube = async (e) => {
    e.preventDefault();

    if (!validateAllFields()) {
      return;
    }

    let type = "youtube"
    let title = form.current.elements.title.value;
    let link = form.current.elements.link.value;
    let width = form.current.elements.width.value;
    let height = form.current.elements.height.value;
    let endpoint = `${apiUrl}api/course/newYoutube/${courseID.toLowerCase()}/${classID}/${topicID}`;
    let data = { title, type, link, width, height };
    let formData = utilities.fetchData(data);

    try {
      const response = await fetch(endpoint, formData);
      const data = await response.json();
      
      if (data.meta.created) {
        setValidations({success: `Se creo el enlace de YouTube`});
        setOldData({title:"", link:"", width:"", height:""});
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

  return (
    <form className="panel-form" ref={form} onSubmit={createYouTube}>
      <Input
        type = "text"
        name = "title"
        id = "title"
        value = {oldData.title}
        label = "Titulo del video"
        onChange = {updateForm}
        onBlur={validateTitle}
        onInput={validateTitle}
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
        onBlur={validateLink}
        onInput={validateLink}
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
          onBlur = {validatWidth}
          onInput = {validatWidth}
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
            onBlur = {validatHeight}
            onInput = {validatHeight}
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