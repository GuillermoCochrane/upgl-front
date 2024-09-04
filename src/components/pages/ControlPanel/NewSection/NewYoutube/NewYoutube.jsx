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
  let [oldData, setOldData] = useState({ title: "",  link: "", width: "", height: "" });
  const form = useRef(null);

  const updateForm = (field, value) => {
    setOldData(utilities.updateInput(field, value, oldData));
  };

  const createYouTube = async (e) => {
    e.preventDefault();

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