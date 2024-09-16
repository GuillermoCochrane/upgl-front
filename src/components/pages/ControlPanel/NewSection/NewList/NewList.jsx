import { useState, useRef, useEffect } from "react";
import PropTypes, { resetWarningCache } from 'prop-types';
import Input from "../../shared/InputSection/InputSection"
import Select from "../../shared/SelectSection/SelectSection";
import formValidations from "../../../../../utilities/formValidations";
import utilities from "../../../../../utilities/utilities";
const apiUrl = import.meta.env.VITE_API_URL;

const NewList = ({ courseID, classID, topicID, isOrdered, reset }) => {
    const startingID = Date.now();
    const [order, setOrder] = useState(1);
    const [items, setItems] = useState([{ id: startingID, text: "", content: "", order: 1 }]);
    const [validations, setValidations] = useState([{id: startingID, text: { msg: "" }, content: { msg: "" }}]);
    const [listValidations, setListValidations] = useState({});
    const [stylesSelectors, setStylesSelectors] = useState([]);
    const [listSection, setListSection] = useState(0);
    const form = useRef(null);

    const contentError = `El estilo del item `;
    const textError = `El texto del item `;

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
        setItems(items.map(item => 
            item.id === id ? utilities.updateInput(name, value, item) : item
        ));
    };

    const validationsManager = (id, validations) => {
        const validation = validations.find(v => v.id === id);
        return validation;
    };

    const validateText = (itemID) => {
        const name = `item-${itemID}-text`;
        let newValidations = formValidations.required(name, textError, form, validations);
    
        if (form.current.elements[name].value.trim() !== "") {
            newValidations = formValidations.min(name, textError, form, newValidations, 3);
        }

        setValidations(prevValidations => {
            return prevValidations.map(validation => 
                validation.id === itemID ? { ...validation, text: newValidations[name] || { msg: "" } } : validation
            );
        });

        utilities.validationsAlerts(name, newValidations, form);
    };

    const validateContent = (value, itemID) => {
      const name = `item-${itemID}-content`;
        const newValidations = formValidations.required(name, contentError, form, validations);
        if (value) {
          delete newValidations.content; 
        }
        setValidations(prevValidations => {
            return prevValidations.map(validation => 
                validation.id === itemID ? { ...validation, content: newValidations[name] || { msg: "" } } : validation
            );
        });
        utilities.validationsAlerts(name, newValidations, form);
      }

      const validateAllFields = () => {
        let isValid = true;
        const newValidations = validations.map(validation => {
            const item = items.find(i => i.id === validation.id);
            if (!item) return validation; // Si no existe el item, mantener la validación actual
    
            const textName = `item-${item.id}-text`;
            const contentName = `item-${item.id}-content`;
    
            const textResult = formValidations.required(textName, textError, form, {});
            const contentResult = formValidations.required(contentName, contentError, form, {});
    
            if (textResult[textName] || contentResult[contentName]) {
                isValid = false;
            }
    
            return {
                ...validation,
                text: textResult[textName] || { msg: "" },
                content: contentResult[contentName] || { msg: "" }
            };
        });
    
        setValidations(newValidations);
        return isValid;
    };

    const createList = async (e) => {
        e.preventDefault();

        if (!validateAllFields()) {
          setListValidations({error: "Por favor, complete todos los campos requeridos."});
          return;
      }

        let type = isOrdered ? "ol" : "ul";
        let listEndpoint = `${apiUrl}api/course/newList/${courseID.toLowerCase()}/${classID}/${topicID}`;
        const formData = utilities.fetchData({type});

        if (listSection === 0){
            try {
                const response = await fetch(listEndpoint, formData);
                const data = await response.json();
                
                if (data.meta.created) {
                    setListValidations({success: `Se creó la lista`});
                    setListSection(data.meta.section);
                } else {
                    setListValidations({error: data.errors.type.msg});
                }
            }
            catch (error) {
                setListValidations({error: error.message});
                console.log(error);
            }
        } else {
            createListItems();
        }
    };

    const createListItems = async () => {
        if (listSection === 0) return;

        const liEndpoint = `${apiUrl}api/course/newLi/${courseID.toLowerCase()}/${classID}/${topicID}/${listSection}`;
        const successfulItemIds = [];
        let newItems = [...items];
        let newValidations = [...validations];

        for (const item of items) {
            const liFormData = utilities.fetchData({type: "li", content: item.content, text: item.text, order: item.order});
            try {
                const res = await fetch(liEndpoint, liFormData);
                const liData = await res.json();
                if (liData.meta.created) {
                    successfulItemIds.push(item.id);
                } else {
                    newItems = newItems.map(li =>
                        li.id === item.id   ? 
                                                { 
                                                    ...li, 
                                                    text:      liData.oldData.text,
                                                    content:   liData.oldData.content 
                                                } 
                                            : li
                    );

                    newValidations = newValidations.map(li =>
                        li.id === item.id   ?
                                                { 
                                                    ...li, 
                                                    text:       { msg: liData.errors.text ? liData.errors.text.msg : ""   }, 
                                                    content:    { msg: liData.errors.content ? liData.errors.content.msg : "" }
                                                } 
                                            : li
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
        if (listSection !== 0) {
            createListItems();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listSection]);

    useEffect(() => {
        if (items.length === 0) {
            setListSection(0);
            setListValidations({success: "Todos los elementos de la lista fueron creados exitosamente."});
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
        <form ref={form} onSubmit={createList} className="panel-form">
          <h3 style={{textAlign: "center", margin: "auto",paddingBottom: "1em", borderBottom: "2px solid #225", width: "100%"}}>
            {isOrdered ? "Lista ordenada" : "Lista no ordenada"}
          </h3>
            {items.map((item, index) => (
                
                <article key={item.id} className="list-item">
                    <aside>

                        <Input
                            type="text"
                            name={`item-${item.id}-text`}
                            id={`${item.id}-text`}
                            value={item.text}
                            onChange={updateItem}
                            onBlur={() => validateText(item.id)}
                            onInput={() => validateText(item.id)}
                            label={`Item de lista: ${index + 1}`}
                            styles={"section-flex"}
                            itemID={item.id}
                            stateField={"text"}
                            validations={validationsManager(item.id, validations)}
                        />

                        <Select
                            styles={"section-flex"}
                            name={`item-${item.id}-content`}
                            id={`${item.id}-content`}
                            value={item.content}
                            label="Estilo del texto"
                            onChange={updateItem}
                            onBlur={() => validateContent(item.content, item.id)}
                            options={stylesSelectors}
                            validations={validationsManager(item.id, validations)}
                            optionReferences={{value: "id", name: "title"}}
                            itemID={item.id}
                            stateField={"content"}
                        />
                    </aside>

                    <button type="button" onClick={() => removeItem(item.id)}>Eliminar</button>

                </article>
            ))}

            <span className={listValidations.success ? "success" : "error"}>
                {
                    listValidations.success ? listValidations.success : 
                    listValidations.error ? listValidations.error :
                    "\u00A0"
                }
            </span>

            <button type="button" onClick={addItem}>Agregar ítem</button>
            <button type="submit">Crear Lista</button>

            
        </form>
    );
};

NewList.propTypes = {
    courseID: PropTypes.string.isRequired,
    classID: PropTypes.string.isRequired,
    topicID: PropTypes.string.isRequired,
    isOrdered: PropTypes.bool.isRequired,
    reset: PropTypes.func.isRequired,
};

export default NewList;