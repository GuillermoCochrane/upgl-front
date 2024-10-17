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
    const [listValidations, setListValidations] = useState({});
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
                    setListValidations({success: `Se creó el párrafo`});
                    setParagraphSection(data.meta.section);
                } else {
                    setListValidations({error: data.errors.type.msg});
                }
            }
            catch (error) {
                setListValidations({error: error.message});
                console.log(error);
            }
        } else {
            console.log("no es el primero");
        }
    };

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

            <span className={listValidations.success ? "success" : "error"}>
                {
                    listValidations.success ? listValidations.success : 
                    listValidations.error ? listValidations.error :
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