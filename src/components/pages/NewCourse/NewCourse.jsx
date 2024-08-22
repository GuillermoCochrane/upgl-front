/* eslint-disable no-unused-vars */
import  { useState, useRef, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
import formValidations from '../../../utilities/formValidations';

function NewCourse() {
    let [validations, setValidations] = useState({});
    let [oldData, setOldData] = useState( { name: ""});
    const form = useRef(null);

    const nameError = "Nombre del Curso";
    const introError = "Introducción";
    const paragraphError = "Descripción";

    const validateName = async () => {
      setValidations(prevValidations => formValidations.required('name', nameError, form, prevValidations));

      if(form.current.elements['name'].value){
        let lengthValidations = formValidations.min('name', nameError, form, validations, 2);

        if(!lengthValidations.name){
          lengthValidations = formValidations.max('name', nameError, form, validations, 15);
        }
        setValidations(lengthValidations);
      }

      if(!validations.name){
        let usedValidations = await formValidations.checkDBName('name', form, validations);
        setValidations(usedValidations);
      }

      formValidations.validationsAlerts('name', validations, form);
    }

    const validateIntro = () => {
      setValidations(prevValidations => formValidations.required('intro', introError, form, prevValidations));

      if(form.current.elements['intro'].value){
        let lengthValidations = formValidations.min('intro', introError, form, validations, 2);

        if(!lengthValidations.intro){
          lengthValidations = formValidations.max('intro', introError, form, validations, 150);
        }
        setValidations(lengthValidations);
      }  
      formValidations.validationsAlerts('intro', validations, form);
    }

    const validateParagraph = () => {
      let lengthValidations = formValidations.max('paragraph', paragraphError, form, validations, 200);
      setValidations(lengthValidations);
      formValidations.validationsAlerts('paragraph', validations, form);
    }

    const validateAllFields = () => {
      let newValidations = {};
      newValidations = formValidations.required('name', nameError, form, newValidations);
      newValidations = formValidations.required('intro', introError, form, newValidations);

      setValidations(newValidations);
      return Object.keys(newValidations).length === 0; 
    }

    const updateForm = (field, value) => {
      setOldData(formValidations.updateInput(field, value, oldData));
    };

    const createCourse = async (e) => {
      e.preventDefault();

      if (!validateAllFields()) {
        return; 
      }

      let name = form.current.elements.name.value;
      let intro = form.current.elements.intro.value;
      let paragraph = form.current.elements.paragraph.value;
      let endpoint = `${apiUrl}api/course/newCourse`;
      let data = { name, intro, paragraph };

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
          setValidations({success: `Se creo el curso ${name}`});
          setOldData({name: "", intro: "", paragraph: ""});
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
      Object.keys(validations).forEach(input => {
        if(input !== 'success'){
          formValidations.validationsAlerts(input, validations, form);
        }
      });
    }, [validations]);

  return (
    <article>
      <form ref={form} onSubmit={createCourse} className='panel-form'>
        <section className='section-flex selector'>
            <label htmlFor="name">Nombre del Curso</label> 
            <input 
                  type="text" 
                  name="name" 
                  id="name" 
                  value={oldData.name} 
                  onChange={(e) => updateForm('name', e.target.value)}
                  onBlur  = {validateName}
                  onInput = {validateName}
            />
            {
              validations.name ? 
              <span className='error'>
                {validations.name.msg}
              </span> :
              <span> {"\u00A0"} </span>
            }
        </section>

        <section className='section-flex selector'>
          <label htmlFor="intro">Introduccion a la descripción del curso</label>
          <textarea 
                    name="intro" 
                    id="intro" 
                    value={oldData.intro} 
                    onChange={(e) => updateForm('intro', e.target.value)}
                    onBlur  = {validateIntro}
                    onInput = {validateIntro}
                    rows={5}
          />
          {
            validations.intro ? 
            <span className='error'>
              {validations.intro.msg}
            </span> :
            <span> {"\u00A0"} </span>
          }
        </section>

        <section className='section-flex selector'>
          <label htmlFor="paragraph">Descripción del curso</label>
          <textarea 
                    name="paragraph" 
                    id="paragraph" 
                    value={oldData.paragraph} 
                    onChange={(e) => updateForm('paragraph', e.target.value)}
                    onBlur  = {validateParagraph}
                    onInput = {validateParagraph}
                    rows={5}
          />
          {
            validations.paragraph ? 
            <span className='error'>
              {validations.paragraph.msg}
            </span> :
            <span> {"\u00A0"} </span>
          }
        </section>

        {
          validations.success ? 
          <span className='success'>
            {validations.success}
          </span> : 
          <span className='success'>
            {"\u00A0 "} 
          </span>
        }

        <button type="submit">Crear</button>
      </form>
    </article>
  );
}

export default NewCourse;