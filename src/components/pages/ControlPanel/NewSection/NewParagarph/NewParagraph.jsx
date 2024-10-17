import { useState, useRef, useEffect } from "react";
import PropTypes from 'prop-types';
import Item from "../../shared/ListItemForm/ListItemForm";
import formValidations from "../../../../../utilities/formValidations";
import utilities from "../../../../../utilities/utilities";
const apiUrl = import.meta.env.VITE_API_URL;

const NewParagraph = ({ courseID, classID, topicID,  reset }) => {
    const startingID = Date.now();
    const [order, setOrder] = useState(1);
    const [items, setItems] = useState([{ id: startingID, text: "", content: "", order: 1 }]);
    const [validations, setValidations] = useState([{id: startingID, text: { msg: "" }, content: { msg: "" }}]);
    const [paragraphValidations, setParagraphValidations] = useState({});
    const [stylesSelectors, setStylesSelectors] = useState([]);
    const [paragraphSection, setParagraphSection] = useState(0);
    const form = useRef(null);

    const addItem = () => {
        const newStub = utilities.addStub(items,validations,order)
        setOrder(newStub.order)
        setItems(newStub.items)
        setValidations(newStub.validations)
    };

    const removeItem = (id) => {
        const removedStubs = utilities.removeStub(items,validations,id)
        setItems(removedStubs.items);
        setValidations(removedStubs.validations);
    };

    const updateItem = (unused , value, id, name ) => {
        setItems(utilities.updateStubs(items, value, id, name));
    };

    const validationsManager = (id, validations) => {
        const validation = validations.find(v => v.id === id);
        return validation;
    };

    
    const createParagraph = async (e) => {
        e.preventDefault();

        let type = "p"
        let listEndpoint = `${apiUrl}api/course/newP/${courseID.toLowerCase()}/${classID}/${topicID}`;
        const formData = utilities.fetchData({type});

        if (paragraphSection === 0){
            try {
                const response = await fetch(listEndpoint, formData);
                const data = await response.json();
                
                if (data.meta.created) {
                    setParagraphValidations({success: `Se creó el párrafo`});
                    setParagraphSection(data.meta.section);
                } else {
                    setParagraphValidations({error: data.errors.type.msg});
                }
            }
            catch (error) {
                setParagraphValidations({error: error.message});
                console.log(error);
            }
        } else {
            createParagraphSection();
        }
    };

    const createParagraphSection = async () => {
      if (paragraphSection === 0) return;

      const stubEndpoint = `${apiUrl}api/course/newStub/${courseID.toLowerCase()}/${classID}/${topicID}/${paragraphSection}`;
      console.log(stubEndpoint);
      const successfulItemIds = [];
      let newItems = [...items];
      let newValidations = [...validations];

      for (const item of items) {
          const stubData = { content: item.content, text: `${item.text} `, order: item.order };
          const stubFormData = utilities.fetchData(stubData);
          try {
              const res = await fetch(stubEndpoint, stubFormData);
              const stubData = await res.json();
              if (stubData.meta.created) {
                  successfulItemIds.push(item.id);
              } else {
                  newItems = newItems.map( stub =>
                      stub.id === item.id   ? { ...stub, text: stubData.oldData.text, content: stubData.oldData.content } : stub
                  );
                  newValidations = newValidations.map( stub =>
                      stub.id === item.id   ? 
                          { 
                            ...stub, 
                            text: { msg: stubData.errors.text ? stubData.errors.text.msg : ""   }, 
                            content:    { msg: stubData.errors.content ? stubData.errors.content.msg : "" } 
                          } 
                          : stub 
                  );
              }
          } catch (error) {
              console.log(`Error creating item: ${error}`);
          }
      }

      const auxItems = newItems.filter(item => !successfulItemIds.includes(item.id));
      const auxValidations = newValidations.filter(item => !successfulItemIds.includes(item.id));

      setItems(auxItems);
      setValidations(auxValidations);
    };

    useEffect(() => {
      if (paragraphSection !== 0) {
          createParagraphSection();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paragraphSection]);

    useEffect(() => {
      if (items.length === 0) {
          setParagraphSection(0);
          setParagraphValidations({success: "Todas las secciones del párrafo fueron creadas exitosamente."});
          addItem();
          reset();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items]);

    useEffect(() => {
        const fetchStyles = async () => {
            const stylesData = await utilities.fetchStylesData();
            setStylesSelectors(stylesData);
        };
        fetchStyles();
    }, []);

    return (
        <form ref={form}  className="panel-form" onSubmit={createParagraph}>
          <h3 style={{textAlign: "center", margin: "auto",paddingBottom: "1em", borderBottom: "2px solid #225", width: "100%"}}>
            Párrafo
          </h3>
            {items.map((item, index) => (

                <Item
                    key={item.id}
                    item={item}
                    index={index}
                    validations={validations}
                    stylesSelectors={stylesSelectors}
                    updateItem={updateItem}
                    validationsManager={validationsManager}
                    removeItem={removeItem}
                    inputLabel="Sección del párrafo"
                />

            ))}

            <span className={paragraphValidations.success ? "success" : "error"}>
                {
                    paragraphValidations.success ? paragraphValidations.success : 
                    paragraphValidations.error ? paragraphValidations.error :
                    "\u00A0"
                }
            </span>

            <button type="button" onClick={addItem}>Agregar Sección</button>
            <button type="submit">Crear Párrafo</button>

        </form>
    );
};

NewParagraph.propTypes = {
    courseID: PropTypes.string.isRequired,
    classID: PropTypes.string.isRequired,
    topicID: PropTypes.string.isRequired,
    reset: PropTypes.func.isRequired,
};

export default NewParagraph;