/* eslint-disable no-unused-vars */
import  { useState, useRef, useEffect } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
import formValidations from '../../../../utilities/formValidations';
import Select from "../../../partials/ControlPanel/SelectSection/SelectSection";
import NewMainTitle from "./NewMainTitle/NewMainTitle";
import NewSecondaryTitle from "./NewSecondaryTitle/NewSecondaryTitle";
import Paragraph from "./NewParagarph/NewParagarph";
import NewLink from "./NewLink/NewLink";
import Download from "./NewDownload/NewDownload";
import List from "./NewList/NewList";
import OrderedList from "./NewOrderedList/NewOrderedList";
import Table from "./NewTable/NewTable";
import Image from "./NewImage/NewImage";
import Answer from "./NewAnswer/NewAnswer";
import Trivia from "./NewTrivia/NewTrivia";
import Youtube from "./NewYoutube/NewYoutube";

function NewSection() {
    let [courseSelectors, setCourseSelectors] = useState([]);
    let [classSelectors, setClassSelectors] = useState([]);
    let [topicSelectors, setTopicSelectors] = useState([]);
    let [sectionTypes, setSectionTypes] = useState([]);
    let [oldData, setOldData] = useState( { classSelect: "", courseSelect: "", topicSelect: "", sectionType: ""});
    let [validations, setValidations] = useState({});
    const form = useRef(null);
    const errorField = "Debe seleccionar uno";

    const updateForm = (field, value) => {
      setOldData(formValidations.updateInput(field, value, oldData));
    };

    const validateClass = (value) => {
      const newValidations = formValidations.required('classSelect', errorField, form, validations);
      if (value) {
        delete newValidations.classSelect; 
      }
      setValidations(newValidations);
      formValidations.validationsAlerts('classSelect', newValidations, form);
    };

    const validateTopic = (value) => {
      const newValidations = formValidations.required('topicSelect', errorField, form, validations);
      if (value) {
        delete newValidations.topicSelect;
      }
      setValidations(newValidations);
      formValidations.validationsAlerts('topicSelect', newValidations, form);
    };

    const validateSectionType = (value) => {
      const newValidations = formValidations.required('sectionType', errorField, form, validations);
      if (value) {
        delete newValidations.sectionType;
      }
      setValidations(newValidations);
      formValidations.validationsAlerts('sectionType', newValidations, form);
    };

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
    
    useEffect(() => {
      if (oldData.courseSelect && oldData.classSelect) {
        const endpoint = `${apiUrl}api/course/${oldData.courseSelect.toLowerCase()}/classindex/${oldData.classSelect.toLowerCase()}`;
        const fetchTopics = async () => {
          try {
            const response = await fetch(endpoint);
            const data = await response.json();
            setTopicSelectors(data.data[0].links);
          }
          catch (error) {
            console.log(error);
            setTopicSelectors([]);
          }
        }
        fetchTopics();
      }
    }, [oldData.courseSelect, oldData.classSelect]);

    useEffect(() => {
      const sectionTypesEndpoint = `${apiUrl}api/controlpanel/sections`;
      const fetchSectionTypes = async () => {
        try {
          const response = await fetch(sectionTypesEndpoint);
          const data = await response.json();
          setSectionTypes(data.data);
        }
        catch (error) {
          console.log(error);
          setSectionTypes([]);
        }
      }
      if (oldData.courseSelect && oldData.classSelect && oldData.topicSelect) {
        fetchSectionTypes();
      }
    }, [oldData.courseSelect, oldData.classSelect, oldData.topicSelect]);

    return (
        <article>
            <h2>Nueva Sección</h2>

            <form  ref={form} className='panel-form'>

                <Select 
                        styles={"section-flex"}
                        name="courseSelect" 
                        id="courseSelect"
                        value={oldData.courseSelect}
                        label="Seleccione un Curso"
                        onChange={updateForm}
                        options={courseSelectors}
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
                        selectStyles={"error"}
                        optionMsg={"Seleccione un Curso para ver las Clases disponibles"}
                        optionReferences={{value: "classID", name: "summary"}}
                />

                <Select
                        styles={"section-flex"}
                        name="topicSelect"
                        id="topicSelect"
                        value={oldData.topicSelect}
                        label="Seleccione un Tema"
                        onChange={updateForm}
                        onBlur={validateTopic}
                        options={topicSelectors}
                        selectStyles={"error"}
                        optionMsg={"Seleccione una Clase para ver los Temas disponibles"}
                        optionReferences={{value: "topicID", name: "title"}}
                />

                <Select
                        styles={"section-flex"}
                        name="sectionType"
                        id="sectionType"
                        value={oldData.sectionType}
                        label="Seleccione un Tipo de Sección"
                        onChange={updateForm}
                        onBlur={validateSectionType}
                        options={sectionTypes}
                        selectStyles={"error"}
                        optionMsg={"Seleccione un tema para ver los Tipos de Sección disponibles"}
                        optionReferences={{value: "id", name: "title"}}
                />
            </form>

            {
                oldData.sectionType == "h3" ? <NewMainTitle courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} labelText={"Título Principal"} /> : 
                oldData.sectionType == "h4" ? <NewSecondaryTitle courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} /> : 
                oldData.sectionType == "p" ? <Paragraph courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} /> :
                oldData.sectionType == "link" ? <NewLink courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} /> :
                oldData.sectionType == "download" ? <Download courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} /> :
                oldData.sectionType == "ul" ? <List courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect}  /> :
                oldData.sectionType == "ol" ? <OrderedList courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} /> :
                oldData.sectionType == "table" ? <Table courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} /> :
                oldData.sectionType == "figure" ? <Image courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} /> :
                oldData.sectionType == "answer" ? <Answer courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} /> :
                oldData.sectionType == "trivia" ? <Trivia courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} /> :
                oldData.sectionType == "youtube" ? <Youtube courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} /> :  
                null
            }

        </article>
    );
}

export default NewSection;
