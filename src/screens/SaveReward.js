import React from 'react';
import { Input, Button, Box } from  'src/components';
import { H1, Label, P } from 'src/components/Text';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FakeInput = styled.div`
  border: 0;
  border-radius: 6px;
  padding: 12px 15px 10px;
  background-color: rgba(0,68,102,.06);
  transition: box-shadow .3s ease,background .3s ease;
  font-size: 13px;
  height: 40px;
  color: #777;
}
`

const Style = {
  generateVouchers: {
    display: 'flex',
    flexDirection: 'column',
  },
}

class SaveReward extends React.Component {

  constructor() {
    super();

    this.state = {
      images: [],
    }

    this.handleImageInputChange = this.handleImageInputChange.bind(this);
  }

  handleImageInputChange(ev) {
    let { files } = ev.target;
    const images = [
      ...this.state.images,
      URL.createObjectURL(files[0]),
    ]

    this.setState({images});

  }

  async handleUpload(file) {

    try {
      // Split the filename to get the name and type
      let fileParts = file.name.split('.');
      let fileName = fileParts[0];
      let fileType = fileParts[1];

      const postResponse = await axios.post("http://localhost:3000/aws/s3/sign", {
        fileName,
        fileType,
      });

      const { returnData } = postResponse.data.data;
      const { signedRequest, url } = returnData;
      // this.setState({url});
      console.log(url);
      
      // Put the fileType in the headers for the upload
      var options = {
        headers: { 'Content-Type': fileType }
      };

      const putResponse = await axios.put(signedRequest,file,options);
      // this.setState({success: true});
    } catch (err) {
      console.error('Test.js:handleUpload', err);
    }
  }

  render() {

    const { images } = this.state;

    return (
      <div style={Style.generateVouchers}>
        <H1>
          Cadastrar recompensa
        </H1>

        <Box padded>
          <Label htmlFor="rewardFileInput">
            <div style={{marginBottom: '6px'}}>Imagem da recompensa</div>
            {
              images.length !== 0 ?
              images.map(i => <img src={i} alt=''/>)
              :
              <FakeInput>Escolha uma imagem...</FakeInput> 
            }
          </Label>
          <Input multiple style={{display: 'none'}} id="rewardFileInput" type='file' onChange={this.handleImageInputChange} />
          
          <br/>
          <Label>Parceiro</Label>
          <Input placeholder="Empresa que vai fornecer o brinde" />
          <br/>
          <Label>Nome da recompensa</Label>
          <Input placeholder="Ex: Bola de futebol" />
          <br/>
          <Label>Pontuação necessária</Label>
          <Input placeholder="Ex: 4" />
          <br/>
          <Label>Quantidade em estoque</Label>
          <Input placeholder="Ex: 120" />
          <Link to='/recompensas'><Button>Cadastrar recompensa</Button></Link>
        </Box>
      </div>
    );
  }
}

export default SaveReward;