import React from 'react';
import { connect } from 'react-redux';
import { showAlert } from 'src/state/actions/alerts';
import { Input, Button, Box, FileUploader, Loading, Alert } from  'src/components';
import { H1, Counter, FormSubtitle, Label } from 'src/components/Text';
import Icon, { IconAndText } from 'src/components/Icon';
import { setFormField } from 'src/helpers';
import FadeIn from 'react-fade-in';
import styled from 'styled-components';
import { handleAwsUpload } from 'src/helpers';
import config from 'src/config';
import api from 'src/api';


const RightButton = styled(Button)`
  margin-top: -10px;
  position: absolute;
  top: calc(50% - 20px);
  right: -20px;

  .icon {
    font-size: 16px;
  }
`

const  BottomButton = styled(Button)`
  margin-top: -15px;

  .icon {
    font-size: 20px;
  }
`

const initialFormData = () => ({
  logo: '',
  locations: [{
    name: '',
    address: '',
  }]
});

class SaveCompany extends React.Component {
  constructor(props) {
    super(props);

    // Initial State
    this.state = {
      numberOfLocations: 1,
      images: [],
      loading: false,
      form: initialFormData(),
      ...(props.initialState || {}),
    }

    // Methods binding
    this.addLocation = this.addLocation.bind(this);
    this.removeLocation = this.removeLocation.bind(this);
    this.handleImageInputChange = this.handleImageInputChange.bind(this);
    this.handleRemoveUploadedImage = this.handleRemoveUploadedImage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setShowFeedback = this.setShowFeedback.bind(this);
  }

  addLocation() {
    const {form} = this.state;
    form.locations.push({
      name: '',
      address: '',
    });
    global.loc = form.locations;
    this.setState({form});
  }

  removeLocation(i) {
    const { form } = this.state;
    global.loc = form.locations;
    form.locations.splice(i,1);
    this.setState({form});
  }

  handleImageInputChange(ev) {
    const { files } = ev.target;
    const fileURLs = Array.from(files).map(f => ({
      _id: Math.random().toString(36).substring(7),
      src: URL.createObjectURL(f),
      file: f
    }));

    const images = [
      ...this.state.images,
      ...fileURLs,
    ]

    this.setState({images});
    ev.target.value = null;
  }

  handleRemoveUploadedImage(_id) {
    let { images } = this.state;
    images = images.filter(img => img._id !== _id);
    this.setState({images});
  }

  setShowFeedback(showFeedback) {
    this.setState({showFeedback});
  }
  

  async handleSubmit(ev) {
    try {
      // Prevents form default and start loading
      ev.preventDefault();
      this.setState({loading: true});

      // Setting Variables
      let { form } = this.state;
      let imageUrl;

      // Uplaods image if needed and adds it to form state
      if(this.state.images[0]) {
        imageUrl = this.state.images[0].uploaded ?
          this.state.images[0].src :
          await handleAwsUpload(this.state.images[0].file, `${config.BACKEND_URL}/aws/s3/sign`);
      }

      form.logo = imageUrl || '';

      // Make API call from form data
      if(form._id) {
        await api.editCompany(form);  
      } else {
        await api.addCompany(form);
      }

      // Finish loading
      this.setState({loading: false, form: initialFormData(), images: []});
      this.props.showAlert('success', 'Dados salvos com sucesso!');
      if(typeof this.props.handleSubmit === 'function') this.props.handleSubmit();

    } catch(err) {
      console.error('screens/SaveCompany.js -> handleSubmit()', err);
      this.props.showAlert('danger', 'Houve um erro ao enviar o formulário.');
      this.setState({loading: false, images: []});
    }
  }

  render() {
    const { editMode } = this.props;

    return (
      <div>
        <H1>
          {editMode ? 'Editar Empresa' : 'Nova Empresa'}
        </H1>
        <form action='' onSubmit={this.handleSubmit}>
          <Box padded={!editMode}>
            <Label>Nome da empresa</Label>
            <Input required {...setFormField(this, 'name')} placeholder="Ex: Waze CarPool" />
            <br/>

            {/* ************* */}
            {/* File Uploader */}
            {/* ************* */}
            <Label>Logo</Label>
            <FileUploader
              images={this.state.images}
              placeholder={
                <IconAndText style={{marginTop: 0}}>
                  <Icon style={{fontSize: '16px'}}>add_a_photo</Icon>
                  Escolha uma imagem
                </IconAndText>
              }
              onChange={this.handleImageInputChange}
              close={this.handleRemoveUploadedImage}
              formats={'.jpg,.jpeg,.png'}
            />
            <br/>

            <FormSubtitle>Pontos de retirada</FormSubtitle>

            {/* ********* */}
            {/* Locations */}
            {/* ********* */}
            {this.state.form.locations.map((l,i) => (
              <FadeIn key={i}>
                <br/>
                <Box>
                  <div style={{textAlign: 'center', marginTop: '-40px'}}>
                    <Counter>{i+1}</Counter>
                  </div>
                  <RightButton secondary round onClick={() => this.removeLocation(i)}>
                    <Icon>delete</Icon>
                  </RightButton>
                  <Label>Nome</Label>
                  <Input placeholder="Ex: Loja Principal" {...setFormField(this, `locations.${i}.name`)} />
                  <br/>
                  <Label>Endereço</Label>
                  <Input placeholder="Ex: Rua Faria Lima, 1234" {...setFormField(this, `locations.${i}.address`)} />
                </Box>
              </FadeIn>
            ))}
            <div style={{textAlign: 'center', zIndex: 1}}>
              <BottomButton secondary round onClick={this.addLocation}>
                <Icon>add</Icon>
              </BottomButton>
            </div>
            
            {/* ************* */}
            {/* Submit Button */}
            {/* ************* */}
            <Button type='submit' disabled={this.state.loading}>
              {this.state.loading ?
                <React.Fragment><Loading size={20} /> Processando...</React.Fragment> :
              this.props.editMode ? 
                'Salvar Modificações' :
                'Cadastrar Empresa'
              }
            </Button>
          </Box>
        </form>
      </div>
    );
  }
}

export default connect(state => ({
  
}), {
  showAlert
})(SaveCompany);