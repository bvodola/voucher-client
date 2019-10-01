import React from 'react';
import { Input, Button, Box } from  'src/components';
import { H1, Label, P } from 'src/components/Text';
import { Link } from 'react-router-dom';

const Style = {
  voucherInput: {
    display: 'flex',
    flexDirection: 'column',
  },
  forgotPassword: {
    textAlign: 'center',
    fontSize: '14px',
    fontStyle: 'italic',
  }
}

class VoucherInput extends React.Component {
  render() {
    return (
      <div style={Style.voucherInput}>
        <H1>
          Login de Parceiros
        </H1>

        <Box padded>
          <Label>E-mail</Label>
          <Input placeholder="E-mail de login" />
          <br/>
          <Label>Senha</Label>
          <Input type='password' placeholder="Sua senha de acesso" />
          <Link to='/recompensas'><Button>Fazer Login</Button></Link>
          <P style={Style.forgotPassword}>Esqueci minha senha</P>
        </Box>
      </div>
    );
  }
}

export default VoucherInput;