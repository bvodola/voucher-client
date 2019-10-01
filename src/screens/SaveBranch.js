import React from 'react';
import { Input, Button, Box } from  'src/components';
import { H1, Label, P } from 'src/components/Text';
import { Link } from 'react-router-dom';

const Style = {
  generateVouchers: {
    display: 'flex',
    flexDirection: 'column',
  },
}

class SaveBranch extends React.Component {
  render() {
    return (
      <div style={Style.generateVouchers}>
        <H1>
          Cadastrar filial
        </H1>

        <Box padded>
          <Label>Nome da filial</Label>
          <Input placeholder="Ex: Filial Shopping Iguatemi" />
          <br/>
          <Label>Endereço</Label>
          <Input placeholder="Ex: Rua Faria Lima, 1234" />
          <Link to='/recompensas'><Button>Cadastrar filial</Button></Link>
        </Box>
      </div>
    );
  }
}

export default SaveBranch;