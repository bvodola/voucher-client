import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { Input, Button, Box } from  'src/components';
import { H1, Label } from 'src/components/Text';
import config from 'src/config';
import { setFormField, cookie } from 'src/helpers';
import { showAlert } from 'src/state/actions/alerts';
import { setCurrentUser } from 'src/state/actions/current_user';


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

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      form: {
        email: '',
        password: '',
      }
    }

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(ev) {
    try {
      ev.preventDefault();
      const res = await axios.post(`${config.BACKEND_URL}/auth/login`, this.state.form);
      this.props.setCurrentUser(res.data);
      cookie.set('auth_token', res.data.tokens.local)
      this.props.history.push('/painel/recompensas')
      
    } catch (err) {
      this.props.showAlert('danger', 'Dados de login incorretos. Por favor, tente novamente.')
    }
    
  }

  render() {
    return (
      <div style={Style.voucherInput}>
        <H1>
          Login de Parceiros
        </H1>

        <form onSubmit={this.handleSubmit}>
          <Box padded>
            <Label>E-mail</Label>
            <Input {...setFormField(this, 'email')} placeholder="E-mail de login" />
            <br/>
            <Label>Senha</Label>
            <Input {...setFormField(this, 'password')} type='password' placeholder="Sua senha de acesso" />
            <Button type='submit'>Fazer Login</Button>
          </Box>
        </form>
      </div>
    );
  }
}

export default withRouter(connect(state => ({
  currentUser: state.currentUser
}), {
  showAlert,
  setCurrentUser,
})(Login));