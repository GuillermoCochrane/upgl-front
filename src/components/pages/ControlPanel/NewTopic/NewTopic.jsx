import  { useState, useRef, useEffect } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import formValidations from "../../../../utilities/formValidations";
import utilities from "../../../../utilities/utilities";
import Select from "../shared/SelectSection/SelectSection"  
import Input from "../shared/InputSection/InputSection"

function NewTopic() {
    let [validations, setValidations] = useState({});
    let [oldData, setOldData] = useState( { title: "", classSelect: "", courseSelect: ""});
    let [courseSelectors, setCourseSelectors] = useState([]);
    let [classSelectors, setClassSelectors] = useState([]);
    const form = useRef(null);

    const courseError = "Seleccionar un curso";
    const classError = "Seleccionar una clase";
    const titleError = "Nombre del tema";

    const validateCourse = (value) => {
      const newValidations = formValidations.required("courseSelect", courseError, form, validations);
      if (value) {
        delete newValidations.courseSelect; 
      }
      setValidations(newValidations);
      utilities.validationsAlerts("courseSelect", newValidations, form);
    };

    const validateClass = (value) => {
      const newValidations = formValidations.required("classSelect", classError, form, validations);
      if (value) {
        delete newValidations.classSelect; 
      }
      setValidations(newValidations);
      utilities.validationsAlerts("classSelect", newValidations, form);
    };

    const validateTitle = () => {
      let newValidations = formValidations.required("title", titleError, form, validations);
      if (form.current.elements["title"].value) {
          newValidations = formValidations.min("title", titleError, form, newValidations, 3); 
          if (!newValidations.title) {
              newValidations = formValidations.max("title", titleError, form, newValidations, 35);
          }
      }
      setValidations(newValidations);
      utilities.validationsAlerts("title", newValidations, form); 
    };

    const validateAllFields = () => {
      let newValidations = {};
      newValidations = formValidations.required("title", titleError, form, newValidations);
      newValidations = formValidations.required("classSelect", classError, form, newValidations);
      newValidations = formValidations.required("courseSelect", courseError, form, newValidations);

      setValidations(newValidations);
      return Object.keys(newValidations).length === 0; 
    };

    const updateForm = (field, value) => {
      setOldData(utilities.updateInput(field, value, oldData));
    };

    const resetForm = () => {
      utilities.resetForm(form, ["title", "classSelect", "courseSelect"]);
    };

    const createTopic = async (e) => {  
      e.preventDefault();

      if (!validateAllFields()) {
        return; 
      }

      let courseSelect = form.current.elements.courseSelect.value;
      let classSelect = form.current.elements.classSelect.value;
      let title = form.current.elements.title.value;
      let endpoint = `${apiUrl}api/course/newTopic/${courseSelect}/${classSelect}`;
      let data = {
        title: title,
      };
      let formData = utilities.fetchData(data);

      try {
        const response = await fetch(endpoint, formData);
        const data = await response.json();
        if (data.meta.created) {
          setValidations({success: `Se creo un nuevo tema en la clase ${classSelect} del curso ${courseSelect}`});
          setOldData({title: "", courseSelect: "", classSelect: ""});
          resetForm();
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
    };

    useEffect(() => {
      const endpoint = `${apiUrl}api/course/index`;
      const fetchCourses = async () => {
        try {
          const response = await fetch(endpoint);
          const data = await response.json();
          const newData = utilities.selectRemover("ControlPanel", data.data);
          setCourseSelectors(newData);
        }
        catch (error) {
          console.log(error);
          setCourseSelectors([]);
        }
      }
      fetchCourses();
    }, []);

    useEffect(() => {
      if (oldData.courseSelect) {
        const endpoint = `${apiUrl}api/course/${oldData.courseSelect.toLowerCase()}`;
        const fetchClasses = async () => {
          try {
            const response = await fetch(endpoint);
            const data = await response.json();
            setClassSelectors(data.data);
          }
          catch (error) {
            console.log(error);
            setClassSelectors([]);
          }
        }
        fetchClasses();
      }
    }, [oldData.courseSelect]);

    return (
        <article>
            <h2>Nuevo Tema</h2>

            <form ref={form} onSubmit={createTopic} className="panel-form">

                <Select 
                        styles={"section-flex"}
                        name="courseSelect" 
                        id="courseSelect"
                        value={oldData.courseSelect}
                        label="Seleccione un Curso"
                        onChange={updateForm}
                        onBlur={validateCourse}
                        options={courseSelectors}
                        validations={validations}
                        optionReferences={{value: "id", name: "name"}}
                />
                
                <Select
                        styles={"section-flex"}
                        name="classSelect"
                        id="classSelect"
                        value={oldData.classSelect}
                        label="Seleccione una Clase"
                        onChange={updateForm}
                        onBlur={validateClass}
                        options={classSelectors}
                        validations={validations}
                        selectStyles={"error"}
                        optionMsg={"Seleccione un Curso para ver las Clases disponibles"}
                        optionReferences={{value: "classID", name: "summary"}}
                />

                <Input 
                        styles={"section-flex"}
                        label="Nombre del Tema"
                        type="text"
                        name="title" 
                        id="className" 
                        value={oldData.title} 
                        onChange={updateForm}
                        onBlur={validateTitle}
                        onInput={validateTitle}
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

export default NewTopic;
