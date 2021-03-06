import React from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { getVoucher } from 'src/state/actions/vouchers'
import { showAlert } from 'src/state/actions/alerts'
import { Input, Icon, Button, Box, Alert, Loading } from  'src/components';
import { H1, Label } from 'src/components/Text';
import FadeIn from 'react-fade-in';


class VoucherInput extends React.Component {

  constructor(props) {
    super(props);

    const cachedVoucherCode = localStorage.getItem('voucher_code') || '';

    this.state = {
      voucherInput: props.selectedVoucher.code || cachedVoucherCode || '',
      showErrorMessage: false,
      loading: false,
    }

    this.validateVoucher = this.validateVoucher.bind(this);
    this.setVoucherInput = this.setVoucherInput.bind(this);
    this.setShowErrorMessage = this.setShowErrorMessage.bind(this);
  }

  async validateVoucher(ev) {
    ev.preventDefault();
    this.setState({loading: true});
    const isVoucherFound = await this.props.getVoucher(this.state.voucherInput);
    this.setState({loading: false});
    if(isVoucherFound) {
      if(!this.props.selectedVoucher.validated) this.props.history.push('/recompensas');
      else this.props.history.push('/voucher');
    } else {
      this.props.showAlert('danger', 'O código digitado não é válido. Por favor, tente novamente, ou se preferir, entre em contato.')
    }
  }

  setVoucherInput(voucherInput) {
    this.setState({voucherInput});
  }

  setShowErrorMessage(showErrorMessage) {
    this.setState({showErrorMessage});
  }

  render() {
    return (
      <FadeIn>
        <H1>
          Validar Voucher
        </H1>

        <form onSubmit={this.validateVoucher}>
          <Box padded>
            <Label>Código do Voucher</Label>
            <Input required placeholder="Exemplo: WAZ123" value={this.state.voucherInput} onChange={(ev) => this.setVoucherInput(ev.target.value)} />
            <Alert type='danger' transition='popup' show={this.state.showErrorMessage} close={() => this.setShowErrorMessage(false)}>
              <Icon>error</Icon>
              <p></p>
            </Alert>
            <Button disabled={this.state.loading} type='submit'>
              {this.state.loading ? <React.Fragment><Loading size={20} /> Validando...</React.Fragment> : 'Validar Voucher'}
            </Button>
          </Box>
        </form>
        </FadeIn>
    );
  }
}

export default withRouter(connect((state) => ({
  selectedVoucher: state.vouchers.selectedVoucher
}), {
  getVoucher,
  showAlert,
})(VoucherInput));