/* eslint-disable no-unused-vars */
import  { useState, useRef } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
import validator from 'validator';


function NewClass() {
  
  let [validations, setValidations] = useState({});
  let [oldData, setOldData] = useState( { title: "", summary: "", option: ""});
  let form = useRef(null);

  const updateForm = (input, value) => {
    let newData = {...oldData};
    newData[input] = value;
    setOldData(newData);
  }
  
  const requiredValidation = (input) => {
    let inputField = form.current.elements[input].value;
    let newValidations = { ...validations };
    if(validator.isEmpty(inputField)){
      newValidations[input] = {msg: `${input} es obligatorio`};
    } else {
      delete newValidations[input];
    }
    setValidations(newValidations);
  } 

  const lenghtValidation = (input, min , max) => {
    let inputField = form.current.elements[input].value;
    let newValidations = { ...validations };
    let msg = "";
    input == "title" ? msg = `El título de la clase debe tener` : null;
    input == "summary" ? msg = `El nombre del índice debe tener` : null;
    if(!validator.isLength(inputField, { min, max })){
      msg += `al menos ${min} caracteres`;
      max ? msg += ` y como máximo ${max} caracteres` : null;
      newValidations[input] = {msg: msg};
    } else {
      delete newValidations[input];
    }
    setValidations(newValidations);
  }

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
        setOldData({title: "", summary: "", option: ""});
      } else {
        data.oldData.option = courseSelect
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
                value={oldData.option}
                onChange={(e) => updateForm('option', e.target.value)}
          >
            <option value="">---</option>
            <option value="python" > Python </option>
            <option value="test" > Test </option>
            <option value="ia">   IA </option>
          </select>
          {
            validations.course && 
            <span className='error'>
              {validations.course.msg}
            </span>
          }
        </section>

        <section className='section-flex'>
          <label htmlFor="className">Nombre de la Clase</label>
          <input 
                type="text" 
                name="title" 
                id="className" 
                value={oldData.title} 
                onChange={(e) => updateForm('title', e.target.value)}
                onBlur  = {() => lenghtValidation('title', 3)}
                onInput={() => lenghtValidation('title', 3)}
          />
          {
            validations.title && 
            <span className='error'>
              {validations.title.msg}
            </span>
          }
        </section>

        <section className='section-flex'>
          <label htmlFor="index-title">Titulo para el Indice</label>
          <input 
                type="text" 
                name="summary" 
                id="index-title" 
                value={oldData.summary} 
                onChange={(e) => updateForm('summary', e.target.value)}
                onBlur  = {() => lenghtValidation('summary', 3, 35)}
                onInput={() => lenghtValidation('summary', 3, 35)}
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