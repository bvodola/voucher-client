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

class VoucherInput extends React.Component {
  render() {
    return (
      <div style={Style.generateVouchers}>
        <H1>
          Gerar códigos de vouchers
        </H1>

        <Box padded>
          <Label>Número de vouchers</Label>
          <Input placeholder="Ex: 1000" />
          <br/>
          <Label>Pontuação de cada voucher</Label>
          <Input placeholder="Ex: 4" />
          <Link to='/recompensas'><Button>Gerar vouchers</Button></Link>
        </Box>
      </div>
    );
  }
}

export default VoucherInput;