import { useState, useEffect, useRef } from "react";
import PropTypes from 'prop-types';
const apiUrl = import.meta.env.VITE_API_URL;
import utilities from "../../../../../utilities/utilities";
import Input from "../../shared/InputSection/InputSection";
import Select from "../../shared/SelectSection/SelectSection";

const NewTrivia = ({ courseID, classID, topicID,  reset   }) => {
  const startingID = Date.now();
    const [order, setOrder] = useState(1);
    const [items, setItems] = useState([{ id: startingID, text: "", content: "", correct: false, answer: "", order: 1 }]);
    const [validations, setValidations] = useState([{id: startingID, text: { msg: "" }, content: { msg: "" }, correct: { msg: "" }, answer: { msg: "" }}]);
    const [stylesSelectors, setStylesSelectors] = useState([]);
    const form = useRef(null);
    const inputLabel = "Opción de trivia: ";

    const addItem = () => {
        const newStub = utilities.addStub(items,validations,order)
        newStub.items.correct = false;
        newStub.items.answer = "";
        setOrder(newStub.order)
        setItems(newStub.items)
        newStub.validations.correct = { msg: "" };
        newStub.validations.answer = { msg: "" };
        setValidations(newStub.validations)
    };

    const removeItem = (id) => {
        const removedStubs = utilities.removeStub(items,validations,id)
        setItems(removedStubs.items);
        setValidations(removedStubs.validations);
    };

    const updateInput = (input, value, oldData) => {
      let newData = {...oldData};
      newData[input] = value;
      return newData;
    }

    const updateItem = (unused , value, id, name ) => {
        let newItems = items.map(item => item.id === id ? updateInput(name, value, item) : item );
        setItems(newItems);
    };  

    useEffect(() => {
        const fetchStyles = async () => {
            const stylesData = await utilities.fetchStylesData();
            setStylesSelectors(stylesData);
        };
        fetchStyles();
    }, []);

  return (
    <form ref={form}  className="panel-form">
        {items.map((item, index) => (

        <article className="list-item" key={index}>
            <aside>
              <h3 style={{textAlign: "center", margin: "auto",paddingBottom: "1em",  width: "100%"}}>
                {`${inputLabel} ${index + 1}`}
              </h3>

                <Input
                    type="text"
                    name={`item-${item.id}-text`}
                    id={`${item.id}-text`}
                    value={item.text}
                    onChange={updateItem}
                    label="Enunciado"
                    styles={"section-flex"}
                    itemID={item.id}
                    stateField={"text"}
                />

                <Select
                    styles={"section-flex"}
                    name={`item-${item.id}-content`}
                    id={`${item.id}-content`}
                    value={item.content}
                    label="Estilo del Enunciado"
                    onChange={updateItem}
                    options={stylesSelectors}
                    optionReferences={{value: "id", name: "title"}}
                    itemID={item.id}
                    stateField={"content"}
                />

                <Select 
                    styles={"section-flex"}
                    name={`item-${item.id}-correct`}
                    id={`${item.id}-correct`}
                    value={item.correct}
                    label="¿Respuesta Correcta?"
                    onChange={updateItem}
                    options={[
                        {id: true, title: "Si"},
                        {id: false, title: "No"}
                    ]}
                    optionReferences={{value: "id", name: "title"}}
                    itemID={item.id}
                    stateField={"correct"}
                />

                <Input 
                    type="text"
                    name={`item-${item.id}-answer`}
                    id={`${item.id}-answer`}
                    value={item.answer}
                    onChange={updateItem}
                    label="Respuesta"
                    styles={"section-flex"}
                    itemID={item.id}
                    stateField={"answer"}
                />

            </aside>

            <button type="button" onClick={() => removeItem(item.id)}>Eliminar</button>

        </article>

        ))}

        <button type="button" onClick={addItem}>Agregar ítem</button>
        <button type="submit">Crear Lista</button>

    </form>
);
}

NewTrivia.propTypes = {
  courseID: PropTypes.string.isRequired,
  classID: PropTypes.string.isRequired,
  topicID: PropTypes.string.isRequired,
  reset: PropTypes.func.isRequired,
};

export default NewTrivia;