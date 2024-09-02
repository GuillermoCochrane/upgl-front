import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import Input from "../../shared/InputSection/InputSection";
import Select from "../../shared/SelectSection/SelectSection";
import formValidations from "../../../../../utilities/formValidations";
import utilities from "../../../../../utilities/utilities";
const apiUrl = import.meta.env.VITE_API_URL;


const NewDownload = ({ courseID, classID, topicID, reset  }) => {
  let [validations, setValidations] = useState({});
  let [stylesSelectors, setStylesSelectors] = useState([]);
  let [oldData, setOldData] = useState({ text: "", content: "", link: "" });
  const form = useRef(null);

  const updateForm = (field, value) => {
    setOldData(utilities.updateInput(field, value, oldData));
  };

  const createDownload = async (e) => {
    e.preventDefault();

    let text = form.current.elements.text.value;
    let content = form.current.elements.content.value;
    let link = form.current.elements.link.value;
    let type = "link"
    let endpoint = `${apiUrl}api/course/newDownload/${courseID.toLowerCase()}/${classID}/${topicID}`;
    let data = { text, type, content, link };
    let formData = utilities.fetchData(data);

    try {
      const response = await fetch(endpoint, formData);
      const data = await response.json();
      
      if (data.meta.created) {
        setValidations({success: `Se creo el enlace`});
        setOldData({text:"", content:"", link:""});
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
    <form className="panel-form" ref={form} onSubmit={createDownload}>

      <Input
        type = "text"
        name = "text"
        id = "text"
        value = {oldData.text}
        label = "Texto de la descarga"
        onChange = {updateForm}
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
        options = {stylesSelectors}
        validations = {validations}
        optionReferences ={{value: "id", name: "title"}}
      />

      <Input
        type = "text"
        name = "link"
        id = "link"
        value = {oldData.link}
        label = "URL de la descarga"
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

NewDownload.propTypes = {
  courseID: PropTypes.string.isRequired,
  classID: PropTypes.string.isRequired,
  topicID: PropTypes.string.isRequired,
  reset: PropTypes.func.isRequired,
};

export default NewDownload;