import React from 'react';
import VMasker from 'vanilla-masker';
import axios from  'src/services/axios';
import StateHandler from 'src/services/stateHandler';

class FormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getFormData = this.getFormData.bind(this);
    this.setFormData = this.setFormData.bind(this);
    this.toggleElementOnArray = this.toggleElementOnArray.bind(this);
    this.stateHandler = new StateHandler(this);

    this.state = {
      isLoading: false,
      form: {
        ...props.initialFormData || {},
      },
    }
  }

  async handleSubmit(ev) {
    ev.preventDefault();

    try {
      this.setState({isLoading: true});
      let {form} = this.state;
      let {mutation, onSubmit, initialFormData} = this.props;
      let formKeys = Object.keys(form);
      
      if(mutation) {
        let variables = '';

        formKeys.forEach((k,i) => {
          variables += `${k}: "${form[k]}"`
          if(i < formKeys.length-1) variables += ', '
        })

        await axios.post(`/graphql`, {
          query: `mutation{
            ${mutation}(${variables}){_id}
          }`
        })
      }
      
      if(typeof onSubmit === 'function')  onSubmit(form);

      let emptyForm = {}
      formKeys.forEach(k => {emptyForm[k] = ''})
      this.setState({form: {...emptyForm, ...initialFormData}, isLoading: false})
      
      
    } catch(err) {
      this.setState({isLoading: false})
    }
  }

  setFormData(k,v) {
    this.stateHandler.set(`form.${k}`,v);
  }

  getFormData(k) {
    return this.stateHandler.get(`form.${k}`);
  }

  toggleElementOnArray(a, el, index = '_id') {

    let updatedArray = Array.isArray(this.state.form[a]) ?
      [ ...this.state.form[a] ] : [];

    // If array element is an object
    if(typeof el === 'object') {
      if(typeof updatedArray.find(l => l[index] === el[index]) === 'undefined') {
        updatedArray.push(el);
      } else {
        updatedArray = updatedArray.filter(l => l[index] !== el[index]);
      }

    // If it is a primitive type
    } else {
      if(updatedArray.indexOf(el) === -1) {
        updatedArray.push(el);
      } else {
        updatedArray = updatedArray.filter(l => l !== el);
      }
    }
    
    this.setFormData(a,updatedArray);
  
  }

  componentDidMount() {
    let maskedInputs = document.querySelectorAll(".masked");
    for(let i=0; i<maskedInputs.length; i++) {
      let el = maskedInputs[i];
      VMasker(el).maskPattern(el.getAttribute('data-mask'));
    }
  }

  render() {
    const {children} = this.props;
    const {isLoading} = this.state;
    const childProps = {
      formData: this.state.form,
      getFormData: this.getFormData,
      setFormData: this.setFormData,
      toggleElementOnArray: this.toggleElementOnArray,
      isLoading,
    };

    return(
      <form onSubmit={this.handleSubmit}>
        <button type='button' onClick={() => {
          console.log(this.state.form);
        }}>Form State</button>
        {children(childProps)}
        {isLoading &&
          <div>Loading...</div>
        }
      </form>
    )
  }
}

export default FormContainer;