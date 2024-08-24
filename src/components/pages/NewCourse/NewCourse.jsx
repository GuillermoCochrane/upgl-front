/* eslint-disable no-unused-vars */
import  { useState, useRef, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
import formValidations from '../../../utilities/formValidations';
import Input from "../../partials/ControlPanel/InputSection/InputSection";
import TextArea from "../../partials/ControlPanel/TextAreaSection/TextAreaSection";

function NewCourse() {
    let [validations, setValidations] = useState({});
    let [oldData, setOldData] = useState( { name: ""});
    const form = useRef(null);

    const nameError = "Nombre del Curso";
    const introError = "Introducción";
    const paragraphError = "Descripción";

    const validateName = async () => {
      let newValidations = formValidations.required('name', nameError, form, validations);  
      if (form.current.elements['name'].value) {
          newValidations = formValidations.min('name', nameError, form, newValidations, 2);
          if (!newValidations.name) {
              newValidations = formValidations.max('name', nameError, form, newValidations, 15);
          }
      }
      if (!(newValidations.name && newValidations.name.msg)) {
          newValidations = await formValidations.checkDBName('name', form, newValidations);
      }
      setValidations(newValidations);
      formValidations.validationsAlerts('name', newValidations, form);
  };

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

        <Input
          type="text"
          name="name"
          id="name"
          label="Nombre del Curso"
          value={oldData.name}
          styles="section-flex"
          onChange={updateForm}
          onBlur={validateName}
          onInput={validateName}
          validations={validations}
        />

        <TextArea 
          styles="section-flex"
          name="intro"
          id="intro"
          label="Introducción del Curso"
          value={oldData.intro}
          onChange={updateForm}
          onBlur={validateIntro}
          onInput={validateIntro}
          rows={5}
          validations={validations}
        />

        <TextArea 
          styles="section-flex"
          name="paragraph"
          id="paragraph"
          label="Descripción del curso"
          value={oldData.paragraph}
          onChange={updateForm}
          onBlur={validateParagraph}
          onInput={validateParagraph}
          rows={5}
          validations={validations}
        />

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