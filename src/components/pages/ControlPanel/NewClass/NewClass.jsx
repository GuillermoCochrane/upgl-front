/* eslint-disable no-unused-vars */
import  { useState, useRef, useEffect } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import formValidations from "../../../../utilities/formValidations";
import Input from "../../../partials/ControlPanel/InputSection/InputSection";
import Select from "../../../partials/ControlPanel/SelectSection/SelectSection";

function NewClass() {
  
  let [validations, setValidations] = useState({});
  let [oldData, setOldData] = useState( { title: "", summary: "", courseSelect: ""});
  let [selectorsOptions, setSelectorsOptions] = useState([]);
  const form = useRef(null);

  const titleError = "Nombre ";
  const summaryError = "Índice";
  const optionError = "Seleccionar un curso";

  const updateForm = (input, value) => {
    setOldData(formValidations.updateInput(input, value, oldData));
  }

  const validateTitle = () => {
    setValidations(prevValidations => formValidations.required("title", titleError, form, prevValidations));
    form.current.elements["title"].value ? setValidations(prevValidations => formValidations.min("title", titleError, form, prevValidations, 3)) : null;
    formValidations.validationsAlerts("title", validations, form);
  }

  const validateSummary = () => {
    setValidations(prevValidations => formValidations.required("summary", summaryError, form, prevValidations));
    
    const minLengthValidations = formValidations.min("summary", summaryError, form, validations, 3);
    setValidations(minLengthValidations);

    if (!minLengthValidations.summary) {
        setValidations(prevValidations => formValidations.max("summary", summaryError, form, prevValidations, 35));
    }

    formValidations.validationsAlerts("summary", validations, form);
  };

  const validateOption = (value) => {
    const newValidations = formValidations.required("courseSelect", optionError, form, validations);
    if (value) {
      delete newValidations.courseSelect;
    }
    setValidations(newValidations);
    formValidations.validationsAlerts("courseSelect", newValidations, form);
  }

  const validateAllFields = () => {
    let newValidations = {};
    newValidations = formValidations.required("title", titleError, form, newValidations);
    newValidations = formValidations.required("summary", summaryError, form, newValidations);
    newValidations = formValidations.required("courseSelect", optionError, form, newValidations);

    setValidations(newValidations);
    return Object.keys(newValidations).length === 0; 
  }

  const createClass = async (e) => {  
    e.preventDefault();

    if (!validateAllFields()) {
      return; 
    }

    let courseSelect = form.current.elements.courseSelect.value;
    let title = form.current.elements.title.value;
    let summary = form.current.elements.summary.value;
    let endpoint = `${apiUrl}api/course/${courseSelect}/newClass`;
    let data = {
      course: courseSelect,
      title: title,
      summary: summary,
    };

    let formData = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(endpoint, formData);
      const data = await response.json();
      if (data.meta.created) {
        setValidations({success: `Se creo una nueva clase en el curso de ${courseSelect}`});
        setOldData({title: "", summary: "", courseSelect: ""});
      } else {
        data.oldData.courseSelect = courseSelect
        setValidations(data.errors);
        setOldData(data.oldData);
      }
    }
    catch (error) {
      setValidations(error.message);
      console.log(error);
    }

  }

  useEffect(() => {
    const endpoint = `${apiUrl}api/course/index`;
    const fetchInfo= async () => {
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        setSelectorsOptions(data.data);
      }
      catch (error) {
        console.log(error);
        setSelectorsOptions([]);
      }
    }
    fetchInfo();
  }, []);

  useEffect(() => {
    Object.keys(validations).forEach(input => {
      if(input !== "success"){
        formValidations.validationsAlerts(input, validations, form);
      }
    });
  }, [validations]);
  

  return (
    <article>

      <h2>Nueva Clase</h2>

      <form ref={form} onSubmit={createClass} className="panel-form">

        <Select
          name="courseSelect"
          id="courseSelect"
          label="Seleccione un Curso"
          value={oldData.courseSelect}
          onChange={updateForm}
          onBlur={validateOption}
          options={selectorsOptions}
          validations={validations}
          styles={"section-flex"}
          optionReferences={{value: "id", name: "name"}}
        />

        <Input
          type="text"
          name="title"
          id="className"
          label="Nombre de la Clase"
          value={oldData.title}
          styles="section-flex"
          onChange={updateForm}
          onBlur={validateTitle}
          onInput={validateTitle}
          validations={validations}
        />


        <Input
          type="text"
          name="summary"
          id="index-title"
          label="Título para el Índice"
          value={oldData.summary}
          styles="section-flex"
          onChange={updateForm}
          onBlur={validateSummary}
          onInput={validateSummary}
          validations={validations}
        />

        <span className="success">
          {validations.success ? validations.success : "\u00A0 "}
        </span>
        
        <button type="submit">Crear</button>
      </form>

    </article>
  );
}

export default NewClass;