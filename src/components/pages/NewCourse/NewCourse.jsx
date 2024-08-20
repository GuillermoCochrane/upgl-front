/* eslint-disable no-unused-vars */
import  { useState, useRef, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
import formValidations from '../../../utilities/formValidations';
// ["id","name","link","title","intro","paragraph"]
function NewCourse() {
    let [validations, setValidations] = useState({});
    let [oldData, setOldData] = useState( { name: ""});
    const form = useRef(null);

    const updateForm = (field, value) => {
      setOldData(formValidations.updateInput(field, value, oldData));
    };

    const createTopic = async (e) => {
    };
  return (
    <article>
      <form ref={form} onSubmit={createTopic} className='panel-form'>
        <section className='section-flex selector'>
            <label htmlFor="name">Nombre del Curso</label> 
            {/* max 15 caracteres */}
            <input 
                  type="text" 
                  name="name" 
                  id="name" 
                  value={oldData.name} 
                  onChange={(e) => updateForm('name', e.target.value)}
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
          />
          {
            validations.paragraph ? 
            <span className='error'>
              {validations.paragraph.msg}
            </span> :
            <span> {"\u00A0"} </span>
          }
        </section>
      </form>
    </article>
  );
}

export default NewCourse;