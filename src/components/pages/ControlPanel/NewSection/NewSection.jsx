import  { useState, useRef, useEffect } from "react";
const apiUrl = import.meta.env.VITE_API_URL;
import formValidations from "../../../../utilities/formValidations";
import utilities from "../../../../utilities/utilities";
import Select from "../shared/SelectSection/SelectSection";
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
    const configSection = useRef(null);
    const elementSection = useRef(null);
    const configButton = useRef(null);
    const elementButton = useRef(null);
    const errorField = "Debe seleccionar uno";

    const updateForm = (field, value) => {
      setOldData(utilities.updateInput(field, value, oldData));
    };

    const resetForm = () => {
      setOldData({ classSelect: "", courseSelect: "", topicSelect: "", sectionType: "" });
      switchSection(false);
      setValidations({success: "Sección creada con éxito"});
      utilities.resetForm(form, ["sectionType", "topicSelect", "classSelect", "courseSelect"]);
    };

    const switchSection = (state) => {
      utilities.sectionHandler(state, configSection, elementSection, configButton, elementButton);
    };

    const validateInput = (field, value) => {
      const newValidations = formValidations.required(field, errorField, form, validations);
      if (value) {
        delete newValidations[field];
      }
      setValidations(newValidations);
      utilities.validationsAlerts(field, newValidations, form);
    };

    const validateClass = (value) => {
      validateInput("classSelect", value);
    };

    const validateTopic = (value) => {
      validateInput("topicSelect", value);
    };

    const validateSectionType = (value) => {
      validateInput("sectionType", value);
    };

    useEffect(() => {
      const endpoint = `${apiUrl}api/course/index`;
      const fetchCourses = async () => {
        try {
          const response = await fetch(endpoint);
          const data = await response.json();
          const newData = utilities.selectRemover("ControlPanel", data.data);
          setCourseSelectors(newData);
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

    useEffect(() => {
      if (oldData.sectionType) {
        switchSection(true);
      }
    }, [oldData.sectionType]);

    return (
        <article>

            <header>
                <button 
                  onClick={() => switchSection(false)} 
                  className="active"
                  ref={configButton}
                  >
                  Configuración
                </button>
                <button 
                  onClick={() => switchSection(true)}
                  ref={elementButton} 
                > 
                  Elemento
                </button>
            </header>

            <h2>Nueva Sección</h2>

            <section ref={configSection}>
              <form  ref={form} className="panel-form">
                
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
                          label="Seleccione una Sección"
                          onChange={updateForm}
                          onBlur={validateSectionType}
                          options={sectionTypes}
                          selectStyles={"error"}
                          optionMsg={"Seleccione un tema para ver los Tipos de Sección disponibles"}
                          optionReferences={{value: "id", name: "title"}}
                  />

                  <span className="success">
                    {validations.success ? validations.success : "\u00A0 "}
                  </span>
              </form>
            </section>

            <section ref={elementSection} hidden={true}>
            {
              oldData.sectionType == "h3" ? <NewMainTitle courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} reset={resetForm} /> :
              oldData.sectionType == "h4" ? <NewSecondaryTitle courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} reset={resetForm} /> : 
              oldData.sectionType == "p" ? <Paragraph courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} reset={resetForm} /> :
              oldData.sectionType == "link" ? <NewLink courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} reset={resetForm} /> :
              oldData.sectionType == "download" ? <Download courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} reset={resetForm} /> :
              oldData.sectionType == "ul" ? <List courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect}  /> :
              oldData.sectionType == "ol" ? <OrderedList courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} /> :
              oldData.sectionType == "table" ? <Table courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} /> :
              oldData.sectionType == "figure" ? <Image courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} /> :
              oldData.sectionType == "answer" ? <Answer courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} /> :
              oldData.sectionType == "trivia" ? <Trivia courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} /> :
              oldData.sectionType == "youtube" ? <Youtube courseID={oldData.courseSelect} classID={oldData.classSelect} topicID={oldData.topicSelect} sectionID={oldData.sectionSelect} reset={resetForm}/> :  
              <h3 className="error"> Debe seleccionar el tipo de sección a crear </h3>
            }
            </section>
        </article>
    );
}

export default NewSection;
