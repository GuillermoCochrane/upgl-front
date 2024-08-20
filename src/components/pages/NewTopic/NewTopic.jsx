/* eslint-disable no-unused-vars */
import  { useState, useRef, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
import formValidations from '../../../utilities/formValidations';

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
      const newValidations = formValidations.required('courseSelect', courseError, form, validations);
      if (value) {
        delete newValidations.courseSelect; 
      }
      setValidations(newValidations);
      formValidations.validationsAlerts('courseSelect', newValidations, form);
    }

    const validateClass = (value) => {
      const newValidations = formValidations.required('classSelect', classError, form, validations);
      if (value) {
        delete newValidations.classSelect; 
      }
      setValidations(newValidations);
      formValidations.validationsAlerts('classSelect', newValidations, form);
    }

    const validateTitle = () => {
      let newValidations = formValidations.required('title', titleError, form, validations);
      if (form.current.elements['title'].value) {
          newValidations = formValidations.min('title', titleError, form, newValidations, 3); 
          if (!newValidations.title) {
              newValidations = formValidations.max('title', titleError, form, newValidations, 35);
          }
      }

      setValidations(newValidations);
      formValidations.validationsAlerts('title', newValidations, form); 
  };
  

    const updateForm = (field, value) => {
      setOldData(formValidations.updateInput(field, value, oldData));
    }

    useEffect(() => {
      const endpoint = `${apiUrl}api/course/index`;
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
        console.log(endpoint);
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
    
    const createTopic = async (e) => {  
        e.preventDefault();

        let courseSelect = form.current.elements.courseSelect.value;
        let classSelect = form.current.elements.classSelect.value;
        let title = form.current.elements.title.value;
        let endpoint = `${apiUrl}api/course/${courseSelect}/newTopic/${classSelect}`;
        let data = {
          title: title,
        };
    
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
          if (data.meta.created) {
            setValidations({success: `Se creo una nueva clase en el curso de ${courseSelect}`});
            setOldData({title: "", courseSelect: "", classSelect: ""});
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
      
    return (
        <article>
            <h2>Nuevo Tema</h2>

            <form ref={form} onSubmit={createTopic} className='panel-form'>

                <section className='section-flex selector'>
                    <label htmlFor="courseSelect">Seleccione un Curso</label>
                    <select 
                            name="courseSelect" 
                            id="courseSelect"
                            value={oldData.courseSelect}
                            onBlur={() => validateCourse(oldData.courseSelect)}
                            onChange={(e) => {
                                const value = e.target.value;
                                updateForm('courseSelect', value);
                                validateCourse(value);
                            }}
                    >

                        <option value="">---</option>
                        {courseSelectors.map((selector, key) => 
                            <option
                                value={selector.id} 
                                key={key}
                            >
                                {selector.name} 
                            </option>
                            )
                        }

                    </select>
                    {
                        validations.courseSelect ? 
                        <span className='error'>
                        {validations.courseSelect.msg}
                        </span> :
                        <span> {"\u00A0"} </span>
                    }
                </section>

                <section className='section-flex selector'>
                    <label htmlFor="classSelect">Seleccione una Clase</label>
                    <select 
                            name="classSelect" 
                            id="classSelect"
                            value={oldData.classSelect}
                            onBlur={() => validateClass(oldData.classSelect)}
                            onChange={(e) => {
                                const value = e.target.value;
                                updateForm('classSelect', value);
                                validateClass(value);
                            }}
                            className="error"
                    >
                      {
                        classSelectors.length == 0 ? 
                        <option value="">Seleccione un Curso para ver las Clases disponibles</option> :
                        <option value="">---</option>
                      }

                        {classSelectors.map((selector, key) => 

                            <option
                                value={selector.classID} 
                                key={key}
                            >
                                {selector.summary}
                            </option>
                            )
                        }
                    </select>
                    {
                        validations.classSelect ? 
                        <span className='error'>
                        {validations.classSelect.msg} 
                        </span> :
                        <span> {"\u00A0"} </span>
                    }
                </section>
                
                <section className='section-flex selector'>
                  <label htmlFor="className">Nombre del Tema</label>
                  <input 
                          type = "text" 
                          name = "title" 
                          id = "className" 
                          value = {oldData.title} 
                          onChange = {(e) => updateForm('title', e.target.value)}
                          onBlur  = {validateTitle}
                          onInput = {validateTitle}
                  />
                  {
                      validations.title ? 
                      <span className='error'>
                      {validations.title.msg}
                      </span> :
                      <span> {"\u00A0"} </span>
                  }
                </section>

                <button type="submit">Crear</button>
            </form>
        </article>
    );
}

export default NewTopic;
