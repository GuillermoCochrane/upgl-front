const utilities = {
  updateInput: (input, value, oldData) => {
    let newData = {...oldData};
    newData[input] = value;
    return newData;
  },

  validationsAlerts (input, validations, form) {
      if (validations[input]) {
          form.current.elements[input].classList.remove('success');
          form.current.elements[input].classList.add('error');
      } else {
          form.current.elements[input].classList.remove('error');
          form.current.elements[input].classList.add('success');
      }
  },

  selectRemover: (removeSelector , selectorData) => {
    let newSelectorData = [];
    for (const selector of selectorData) {
      if (selector.id != removeSelector) {
        newSelectorData.push(selector);
      }
    }
    return newSelectorData;
  },
}

export default utilities