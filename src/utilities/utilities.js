const apiUrl = import.meta.env.VITE_API_URL;

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

  sectionHandler: (state ,section1, section2, button1, button2) => {
    if (state) {
      section1.current.hidden = true;
      section2.current.hidden = false;
      button1.current.classList.remove("active");
      button2.current.classList.add("active");
    } else {
      section1.current.hidden = false;
      section2.current.hidden = true; 
      button1.current.classList.add("active");
      button2.current.classList.remove("active");
    }
  },

  resetValidations: (input, form) => {
    form.current.elements[input].classList.remove('success');
    form.current.elements[input].classList.remove('error');
  },

  resetForm: function (form, inputs) {
    inputs.forEach(input => this.resetValidations(input, form));
  },
  
  fetchData: (info, isFormData = false) => {
    let data = {
      method: 'POST',
      body: isFormData ? info : JSON.stringify(info),
      headers: isFormData ? {} : { 'Content-Type': 'application/json' }
    };
    return data;
  },

  fetchStylesData: async () => {
    const endpoint = `${apiUrl}api/controlpanel/styles`;
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      return data.data;
    }
    catch (error) {
      console.log(error);
      return [];
    }
  },

  arrayOrderer: function(array, key, ascending) {
    return  ascending ? array.sort((a, b) => a[key] - b[key]) : array.sort((a, b) => b[key] - a[key]);
  },

  addStub: function(items, validations, order){
    let newID = Date.now();
    let newOrder = order +1;
    let newItems = [...items, { id: newID, text: "", content: "", order: newOrder}];
    let newValidations = [...validations,{ id: newID, text: { msg: "" }, content: { msg: "" } }]
    return { items: newItems, validations: newValidations, order: newOrder}
  },

  removeStub: function(items, validations, id){
    let newItems = items.filter(item => item.id !== id);
    let newValidations = validations.filter(item => item.id !== id);
    return { items: newItems, validations: newValidations}
  },

  updateStubs: function(items, value, id, name){
    let newItems = items.map(item => item.id === id ? this.updateInput(name, value, item) : item );
    return newItems
  },

  validationsManager: function(validations, itemID, key, field, newValidations){
    return validations.map(validation => 
        validation.id === itemID ? 
            { ...validation, [field]: newValidations[key] || { msg: "" } } : 
            validation);
  }

}

export default utilities