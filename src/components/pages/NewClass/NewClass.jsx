import  { useState, useRef } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;

function NewClass() {

  let form = useRef(null);

  let [validations, setValidations] = useState({});

  let createClass = async (e) => {  
    e.preventDefault();
    let courseSelect = form.current.elements.courseSelect.value;
    let className = form.current.elements.className.value;
    let summary = form.current.elements.summary.value;
    let endpoint = `${apiUrl}api/${courseSelect}/newClass`;
    let data = {
      course: courseSelect,
      class: className,
      summary: summary,
    };
    // console.log(data);
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
      console.log(data.meta.status);
      if (data.meta.status === 200) {
        setValidations({success: 'La Clase se creo correctamente'});
      } else {
        setValidations(data.errors);
      }
    }
    catch (error) {
      setValidations(error.message);
      console.log(error);
    }
  }

  console.log(validations);

  return (
    <article>
      <form ref={form} onSubmit={createClass}>

        <section>
          <label htmlFor="courseSelect">Seleccione un Curso</label>
          <select name="courseSelect" id="courseSelect">
            <option value="ia">IA</option>
            <option value="python">Python</option>
            <option value="test">Test</option>
          </select>
          {validations.course && <span className='error'>{validations.course}</span>}
        </section>

        <section>
          <label htmlFor="className">Nombre de la Clase</label>
          <input type="text" name="title" id="className" />
          {validations.title && <span className='error'>{validations.title}</span>}
        </section>

        <section>
          <label htmlFor="index-title">Titulo para el Indice</label>
          <input type="text" name="summary" id="index-title" />
          {validations.summary && <span className='error'>{validations.summary}</span>}
        </section>

        <button type="submit">Crear</button>
        {validations.success && <span className='success'>{validations.success}</span>}
      </form>
      
    </article>
  );
}

export default NewClass;