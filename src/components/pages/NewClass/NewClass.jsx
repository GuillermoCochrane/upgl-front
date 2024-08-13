/* eslint-disable no-unused-vars */
import  { useState, useRef, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
import formValidations from '../../../utilities/formValidations';

function NewClass() {
  
  let [validations, setValidations] = useState({});
  let [oldData, setOldData] = useState( { title: "", summary: "", courseSelect: ""});
  let [selectorsOptions, setSelectorsOptions] = useState([]);
  const form = useRef(null);

  const titleError = "El nombre ";
  const summaryError = "El índice";
  const optionError = "Seleccionar un curso";

  const updateForm = (input, value) => {
    let newData = {...oldData};
    newData[input] = value;
    setOldData(newData);
  }

  const validateTitle = () => {
    setValidations(prevValidations => formValidations.required('title', titleError, form, prevValidations));
    form.current.elements['title'].value ? setValidations(prevValidations => formValidations.min('title', titleError, form, prevValidations, 3)) : null;
  }

  const validateSummary = () => {
    setValidations(prevValidations => formValidations.required('summary', summaryError, form, prevValidations));
    form.current.elements['summary'].value ? setValidations(prevValidations => formValidations.min('summary', summaryError, form, prevValidations, 3)) : null;
    form.current.elements['summary'].value ? setValidations(prevValidations => formValidations.max('summary', summaryError, form, prevValidations, 35)) : null;
  }

  const validateOption = () => {
    setValidations(prevValidations => formValidations.required('courseSelect', optionError, form, prevValidations));
  }

  const validateAllFields = () => {
    let newValidations = {};
    newValidations = formValidations.required('title', titleError, form, newValidations);
    newValidations = formValidations.required('summary', summaryError, form, newValidations);
    newValidations = formValidations.required('courseSelect', optionError, form, newValidations);

    setValidations(newValidations);
    return Object.keys(newValidations).length === 0; 
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

      <form ref={form} onSubmit={createClass} className='panel-form'>

        <section className='section-flex selector'>
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
            validations.courseSelect ? 
            <span className='error'>
              {validations.courseSelect.msg}
            </span> :
            <span> {"\u00A0"} </span>
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
            validations.title ? 
            <span className='error'>
              {validations.title.msg}
            </span> :
            <span> {"\u00A0"} </span>
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
            validations.summary ? 
            <span className='error'>
              {validations.summary.msg}
            </span> :
            <span> {"\u00A0"} </span>
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