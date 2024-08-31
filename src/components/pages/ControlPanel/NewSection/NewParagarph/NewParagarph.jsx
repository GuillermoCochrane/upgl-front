import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import Input from "../../shared/InputSection/InputSection";
import Select from "../../shared/SelectSection/SelectSection";
import formValidations from "../../../../../utilities/formValidations";
import utilities from "../../../../../utilities/utilities";
const apiUrl = import.meta.env.VITE_API_URL;



const NewParagarph = ({ courseID, classID, topicID, reset  }) => {
  let [validations, setValidations] = useState({});
  let [stylesSelectors, setStylesSelectors] = useState([]);
  let [oldData, setOldData] = useState({ text: "", content: "" });
  const form = useRef(null);

  const updateForm = (field, value) => {
    setOldData(formValidations.updateInput(field, value, oldData));
  };


  const createP = async (e) => {
    e.preventDefault();

    let text = form.current.elements.text.value;
    let content = form.current.elements.content.value;
    let type = "p"
    let endpoint = `${apiUrl}api/course/newH3/${courseID.toLowerCase()}/${classID}/${topicID}`;
    let data = { text, type, content };
    let formData = utilities.fetchData(data);

    try {
      const response = await fetch(endpoint, formData);
      const data = await response.json();
      
      if (data.meta.created) {
        setValidations({success: `Se creo el párrafo`});
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
    const endpoint = `${apiUrl}api/controlpanel/styles`;
      const fetchCourses = async () => {
        try {
          const response = await fetch(endpoint);
          const data = await response.json();
          setStylesSelectors(data.data);
        }
        catch (error) {
          console.log(error);
          setStylesSelectors([]);
        }
      }
      fetchCourses();
  }, []);

  return (
    <form className="panel-form" ref={form} onSubmit={createP}>
      <Input
        type = "text"
        name = "text"
        id = "text"
        value = {oldData.text}
        label = "Párrafo"
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

      <span className="success">
        {validations.success ? validations.success : "\u00A0 "}
      </span>

      <button type="submit">Crear</button>
    </form>
  )
}

NewParagarph.propTypes = {
  courseID: PropTypes.string.isRequired,
  classID: PropTypes.string.isRequired,
  topicID: PropTypes.string.isRequired,
  reset: PropTypes.func.isRequired,
};

export default NewParagarph;