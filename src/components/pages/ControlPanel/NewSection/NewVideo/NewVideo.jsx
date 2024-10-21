import { useState, useRef } from "react";
import PropTypes from 'prop-types';
import Input from "../../shared/InputSection/InputSection";
import FileInput from "../../shared/InputFileSection/InputFileSection";
import Checkbox from "../../shared/CheckboxSection/CheckboxSection";
import utilities from "../../../../../utilities/utilities";
import formValidations from "../../../../../utilities/formValidations";
const apiUrl = import.meta.env.VITE_API_URL;

const NewVideo = ({ courseID, classID, topicID, reset  }) => {
  const [validations, setValidations] = useState({});
  const [oldData, setOldData] = useState({ title: "",  video: null, autoPlay: false, loop: false, muted: false });
  const form = useRef(null);
  const titleError = "El título del video";
  const videoError = "un video";

  const updateForm = (field, value) => {
    setOldData(utilities.updateInput(field, value, oldData));
  };

  const updatecheckbox = (field, value) => {
    setOldData(utilities.updateInput(field, value, oldData));
  };

  const updateFileForm = (file) => {
    if (file) {
      setOldData((prevData) => ({ ...prevData, video: file }));
    }
  };

  const validateTitle = () => {
    let newValidations = formValidations.required('title', titleError, form, validations);
    if (form.current.elements['title'].value) {
        newValidations = formValidations.min('title', titleError, form, newValidations, 3);
        if (!newValidations.title) {
            newValidations = formValidations.max('title', titleError, form, newValidations, 40);
        }
    }
    setValidations(newValidations);
    utilities.validationsAlerts('title', newValidations, form);
  };

  const validateFile = () => {
    let allowedExtensions = ['.avi', '.mp4', '.webm', '.mpg', '.mov'];
    let newValidations = formValidations.requiredFile('video', videoError, form, validations);
    if (form.current.elements['video'].files.length) {
        newValidations = formValidations.fileExtension('video', form, newValidations, allowedExtensions);
    }
    setValidations(newValidations);
    utilities.validationsAlerts('video', newValidations, form);
  };

  const validateAllFields = () => {
    let newValidations = {};
    newValidations = formValidations.required('title', titleError, form, newValidations);
    newValidations = formValidations.requiredFile('video', videoError, form, newValidations);
    setValidations(newValidations);
    return Object.keys(newValidations).length === 0; 
  };

  const createFigure = async (e) => {
    e.preventDefault();

    if(!validateAllFields()){
      return;
    }

    let type = "video";
    let title = form.current.elements.title.value;
    let endpoint = `${apiUrl}api/course/newVideo/${courseID.toLowerCase()}/${classID}/${topicID}`;
    let data = new FormData(); 

    data.append('title', title);
    data.append('type', type);
    if (oldData.video) {
      data.append('video', oldData.video);
    }

    let formData = utilities.fetchData(data, true);

    try {
      const response = await fetch(endpoint, formData);
      const result = await response.json();
      
      if (result.meta.created) {
        setValidations({ success: "Se creó el video" });
        setOldData({ title: "", video: null });
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
    <form className="panel-form" ref={form} onSubmit={createFigure}>

      <Input
        type="text"
        name="title"
        id="title"
        value={oldData.title}
        label="Título del video"
        onChange={updateForm}
        onBlur={validateTitle}
        onInput={validateTitle}
        styles="section-flex"
        validations={validations}
      />

      <FileInput
        name="video"
        id="video"
        label="Video a subir"
        onChange={updateFileForm}
        onBlur={validateFile}
        styles="section-flex"
        validations={validations}
      />

      <section className="checkbox-section">
        <Checkbox
          name="autoPlay"
          label="Autoplay"
          checked={oldData.autoPlay}
          onChange={updatecheckbox}
          styles={"input-checkbox"}
        />

        <Checkbox
          name="loop"
          label="Loop"
          checked={oldData.loop}
          onChange={updatecheckbox}
          styles={"input-checkbox"}
        />

        <Checkbox
          name="muted"
          label="Muted"
          checked={oldData.muted}
          onChange={updatecheckbox}
          styles={"input-checkbox"}
        />
      </section>
      

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
// autoPlay loop, muted, controlsList={Data.controlsList}
export default NewVideo;
