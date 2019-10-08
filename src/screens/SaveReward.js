import React from 'react';
import api from 'src/api';
import { connect } from 'react-redux';
import { showAlert } from 'src/state/actions/alerts';
import { Input, Button, Box, FileUploader, Loading, Textarea, Select, Alert } from  'src/components';
import { H1, Label } from 'src/components/Text';
import Icon, { IconAndText } from 'src/components/Icon';
import config from 'src/config';
import { handleAwsUpload, setFormField } from 'src/helpers';

const initialFormData = () => ({
  name: '',
  points: '',
  company_id: '',
  description: '',
  images: [],
  stock: '',
})

class SaveReward extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      images: [],
      companies: [],
      form: initialFormData(),
      ...(props.initialState || {})
    }

    this.handleImageInputChange = this.handleImageInputChange.bind(this);
    this.handleRemoveUploadedImage = this.handleRemoveUploadedImage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const companies = await api.getCompanies({}, '_id name');
    this.setState({companies});
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
    
      form.images = imageUrl ? [ imageUrl ] : [];

      // Make API call from form data
      if (form._id) {
        delete form.company;
        delete form.vouchers;
        api.editReward(form);
      } else {
        api.addReward(form);
      }
    
      // Finish loading
      this.setState({loading: false, form: initialFormData(), images: []});
      this.props.showAlert('success', 'Dados salvos com sucesso!');
      if(typeof this.props.handleSubmit === 'function') this.props.handleSubmit();

    } catch(err) {
      console.error('screens/SaveReward.js -> handleSubmit()', err);
      this.setState({loading: false});
    }
  }

  render() {
    const { images, companies } = this.state;
    return (
      
      <div>
        <H1>
          {this.props.editMode ? 'Editar recompensa': 'Nova recompensa'}
        </H1>
        <form onSubmit={this.handleSubmit}>
          <Box padded={!this.props.editMode}>
            <Label>Nome da recompensa</Label>
            <Input
              {...setFormField(this, 'name')}
              placeholder="Ex: Bola de futebol"
            />
            <br/>   
            <Label>Imagem da recompensa</Label>
            <FileUploader
              images={images}
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
            <Label>Parceiro</Label>
            <Select required {...setFormField(this, 'company_id')}>
              <option disabled value=''>Empresa que vai fornecer o brinde</option>
              {companies.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </Select>
            

            <br/>
            <Label>Descrição</Label>
            <Textarea
              rows={3}
              {...setFormField(this, 'description')}
              placeholder="Descrição mais detalhada da recompensa"
            />
            <br/>
            <Label>Pontuação necessária</Label>
            <Input
              {...setFormField(this, 'points')}
              type='number'
              placeholder="Ex: 4"
            />
            <br/>
            <Label>Quantidade em estoque</Label>
            <Input
              {...setFormField(this, 'stock')}
              type='number'
              placeholder="Ex: 120"
            />
            <Button type='submit' disabled={this.state.loading}>
              {this.state.loading ?
                <React.Fragment><Loading size={20} /> Processando...</React.Fragment> :
              (this.props.editMode ? 
                'Salvar Modificações' :
                'Cadastrar recompensa'
              )
              }
            </Button>
          
          </Box>
        </form>
      </div>
    );
  }
}

export default connect(state => ({

}),{
  showAlert
})(SaveReward);