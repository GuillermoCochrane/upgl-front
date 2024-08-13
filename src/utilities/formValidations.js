import validator from 'validator';

const formValidations = {
    required: (input, error, form, oldValidations ) => {
        let inputField = form.current.elements[input].value;
        let newValidations = { ...oldValidations };
        delete newValidations.success;
        if(validator.isEmpty(inputField)){
            newValidations[input] = {msg: `${error} es obligatorio`};
        } else {
        delete newValidations[input];
        }
        return newValidations;
    },

    length: (input, error, form, oldValidations, min , max ) => {
        // min and max should be undefined (not null) if not required
        let inputField = form.current.elements[input].value;
        let newValidations = { ...oldValidations };
        delete newValidations.success;
        let msg = `${error} debe tener`;
        if(!validator.isLength(inputField, { min, max })){
            msg += `al menos ${min} caracteres`;
            max ? msg += ` y como máximo ${max} caracteres` : null;
            newValidations[input] = {msg: msg};
        } else {
            delete newValidations[input];
        }
        return newValidations;
    },
}

export default formValidations;