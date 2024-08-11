/* eslint-disable no-unused-vars */
import  { useState, useRef, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
import validator from 'validator';


function NewClass() {
  
  let [validations, setValidations] = useState({});
  let [oldData, setOldData] = useState( { title: "", summary: "", courseSelect: ""});
  let [selectorsOptions, setSelectorsOptions] = useState([]);
  const form = useRef(null);

  const titleError = "El nombre de la clase";
  const summaryError = "El título del índice";
  const optionError = "Seleccionar un curso";

  const updateForm = (input, value) => {
    let newData = {...oldData};
    newData[input] = value;
    setOldData(newData);
  }
  
  const requiredValidation = (input, error) => {
    console.log(form.current.elements.courseSelect.value);
    let inputField = form.current.elements[input].value;
    console.log(inputField);
    let newValidations = { ...validations };
    if(validator.isEmpty(inputField)){
      newValidations[input] = {msg: `${error} es obligatorio`};
    } else {
      delete newValidations[input];
    }
    setValidations(newValidations);
  }

  const lenghtValidation = (input, error, min , max ) => {
    let inputField = form.current.elements[input].value;
    console.log(inputField);
    let newValidations = { ...validations };
    let msg = `${error} debe tener`;
    if(!validator.isLength(inputField, { min, max })){
      msg += `al menos ${min} caracteres`;
      max ? msg += ` y como máximo ${max} caracteres` : null;
      newValidations[input] = {msg: msg};
    } else {
      delete newValidations[input];
    }
    setValidations(newValidations);
  }

  const validateTitle = () => {
    requiredValidation('title', titleError);
    form.current.elements['title'].value ? lenghtValidation('title',titleError, 3) : null;
  }

  const validateSummary = () => {
    requiredValidation('summary', summaryError);
    form.current.elements['summary'].value ? lenghtValidation('summary',summaryError, 3, 35) : null;
  }

  const validateOption = () => {
    requiredValidation('courseSelect', optionError);
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

  const createClass = async (e) => {  
    e.preventDefault();
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
  
  return (
    <article>

      <form ref={form} onSubmit={createClass}>

        <section className='section-flex'>
          <label htmlFor="courseSelect">Seleccione un Curso</label>
          <select 
                name="courseSelect" 
                id="courseSelect"
                value={oldData.courseSelect}
                onChange={(e) => updateForm('courseSelect', e.target.value)}
                onBlur={validateOption}
          >
            <option value="">---</option>
            {selectorsOptions.map((selector, key) => 

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
            validations.courseSelect && 
            <span className='error'>
              {validations.courseSelect.msg}
            </span>
          }
        </section>

        <section className='section-flex'>
          <label htmlFor="className">Nombre de la Clase</label>
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
            validations.title && 
            <span className='error'>
              {validations.title.msg}
            </span>
          }
        </section>

        <section className='section-flex'>
          <label htmlFor="index-title">Título para el Índice</label>
          <input 
                type="text" 
                name="summary" 
                id="index-title" 
                value={oldData.summary} 
                onChange={(e) => updateForm('summary', e.target.value)}
                onBlur  = {validateSummary}
                onInput = {validateSummary}
          />
          {
            validations.summary && 
            <span className='error'>
              {validations.summary.msg}
            </span>
          }
        </section>

        <button type="submit">Crear</button>
        {
          validations.success && 
          <span className='success'>
            {validations.success}
          </span>
        }
      </form>

    </article>
  );
}

export default NewClass;