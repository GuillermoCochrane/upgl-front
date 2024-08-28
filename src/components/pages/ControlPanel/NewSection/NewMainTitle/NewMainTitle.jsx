/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
import Input from "../../../../partials/ControlPanel/InputSection/InputSection";
import Select from "../../../../partials/ControlPanel/SelectSection/SelectSection";
const apiUrl = import.meta.env.VITE_API_URL;
import formValidations from "../../../../../utilities/formValidations";


const NewMainTitle = ({ courseID, classID, topicID  }) => {
  const [validations, setValidations] = useState({});
  const [stylesSelectors, setStylesSelectors] = useState([]);
  const [oldData, setOldData] = useState({ content: " " });
  const form = useRef(null);

  const updateForm = (field, value) => {
    setOldData(formValidations.updateInput(field, value, oldData));
  };

  const createH3 = async (e) => {
    e.preventDefault();

    let text = form.current.elements.text.value;
    let content = form.current.elements.content.value;
    let type = "h3"
    let endpoint = `${apiUrl}api/course/newH3/${courseID.toLowerCase()}/${classID}/${topicID}`;
    let data = { text, type, content };

    let formData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(endpoint, formData);
      const data = await response.json();
      console.log(data);
      
      if (data.meta.created) {
        setValidations({success: `Se creo el Título principal`});
        setOldData({text});
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

  console.log(validations);
  
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
    <form className="panel-form" ref={form} onSubmit={createH3}>

      <Input
        type = "text"
        name = "text"
        id = "text"
        value = {oldData.text}
        label = "Título principal"
        onChange= {updateForm}
        styles={"section-flex"}
        validations={validations.text}
      />

      <Select
        name = "content"
        id = "content"
        label = "Estilo del texto"
        value = {oldData.content}
        onChange= {updateForm}
        styles={"section-flex"}
        validations={validations.content}
        options={stylesSelectors}
        optionReferences={{value: "id", name: "title"}}
      />

      <button type="submit">Crear</button>
    </form>
  )
}

NewMainTitle.propTypes = {
  courseID: PropTypes.string.isRequired,
  classID: PropTypes.string.isRequired,
  topicID: PropTypes.string.isRequired,
};

export default NewMainTitle;