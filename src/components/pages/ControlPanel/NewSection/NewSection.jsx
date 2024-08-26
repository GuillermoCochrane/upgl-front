/* eslint-disable no-unused-vars */
import  { useState, useRef, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
import formValidations from '../../../../utilities/formValidations';
import Select from "../../../partials/ControlPanel/SelectSection/SelectSection"
import Input from "../../../partials/ControlPanel/InputSection/InputSection"

function NewSection() {
    let [courseSelectors, setCourseSelectors] = useState([]);
    let [classSelectors, setClassSelectors] = useState([]);
    let [oldData, setOldData] = useState( { classSelect: "", courseSelect: ""});

    const updateForm = (field, value) => {
      setOldData(formValidations.updateInput(field, value, oldData));
    };

    useEffect(() => {
      const endpoint = `${apiUrl}api/course/index`;
      console.log(endpoint);
      
      const fetchCourses = async () => {
        try {
          const response = await fetch(endpoint);
          const data = await response.json();
          setCourseSelectors(data.data);
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
            <h2>Nueva Sección</h2>

            <form className='panel-form'>

                <Select 
                        styles={"section-flex"}
                        name="courseSelect" 
                        id="courseSelect"
                        value={oldData.courseSelect}
                        label="Seleccione un Curso"
                        onChange={updateForm}
                        options={courseSelectors}
                />
                
                <Select
                        styles={"section-flex"}
                        name="classSelect"
                        id="classSelect"
                        value={oldData.classSelect}
                        label="Seleccione una Clase"
                        onChange={updateForm}
                        options={classSelectors}
                        selectStyles={"error"}
                        optionMsg={"Seleccione un Curso para ver las Clases disponibles"}
                />

            </form>
        </article>
    );
}

export default NewSection;