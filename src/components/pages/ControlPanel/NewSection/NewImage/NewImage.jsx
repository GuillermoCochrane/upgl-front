import { useState, useRef } from "react";
import PropTypes from 'prop-types';
import Input from "../../shared/InputSection/InputSection";
import FileInput from "../../shared/InputFileSection/InputFileSection";
import utilities from "../../../../../utilities/utilities";
const apiUrl = import.meta.env.VITE_API_URL;

const NewImage = ({ courseID, classID, topicID  }) => {
  const [validations, setValidations] = useState({});
  const [oldData, setOldData] = useState({ title: "",  alt: "", image: null });
  const form = useRef(null);

  const updateForm = (field, value) => {
    setOldData(utilities.updateInput(field, value, oldData));
  };

  const updateFileForm = (file) => {
    if (file) {
      setOldData((prevData) => ({ ...prevData, image: file }));
    }
  };

  const createFigure = async (e) => {
    e.preventDefault();

    let type = "figure";
    let title = form.current.elements.title.value;
    let alt = form.current.elements.alt.value;
    let endpoint = `${apiUrl}api/course/newImage/${courseID.toLowerCase()}/${classID}/${topicID}`;
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
    console.log(oldData);
    
  };

  return (
    <form className="panel-form" ref={form} onSubmit={createFigure}>

      <Input
        type="text"
        name="title"
        id="title"
        value={oldData.title}
        label="Título de la imagen"
        onChange={updateForm}
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
        styles="section-flex"
        validations={validations}
      />

      <FileInput
        name="image"
        id="image"
        label="Imagen a subir"
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

NewImage.propTypes = {
  courseID: PropTypes.string.isRequired,
  classID: PropTypes.string.isRequired,
  topicID: PropTypes.string.isRequired,
};

export default NewImage;
