import React from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import axios from 'axios';
import config from 'src/config';
import { connect } from 'react-redux';
import { cookie } from 'src/helpers';
import { withStore } from 'src/state/store';
import { setCurrentUser, unsetCurrentUser } from 'src/state/actions/current_user';
import AlertContainer from 'src/containers/AlertContainer';
import { Header, Drawer } from 'src/components';
import { DrawerLink } from 'src/components/Drawer';

// Screens
import VoucherDetails from 'src/screens/VoucherDetails';
import VoucherInput from 'src/screens/VoucherInput';
import RewardList from 'src/screens/RewardList';
import Login from 'src/screens/Login';
import GenerateVouchers from 'src/screens/GenerateVouchers';
import SaveCompany from 'src/screens/SaveCompany';
import CompanyList from 'src/screens/CompanyList';
import SaveReward from 'src/screens/SaveReward';
import RewardLogs from 'src/screens/RewardLogs';
import './App.scss'

const Style = {
  content: {
    padding: '70px 20px 0 20px',
  }
}

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      isDrawerOpened: false,
    }

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.checkAuthToken = this.checkAuthToken.bind(this);
  }

  toggleDrawer() {
    this.setState({isDrawerOpened: !this.state.isDrawerOpened});
  }

  componentDidMount() {
    this.checkAuthToken();
  }

  componentDidUpdate() {
    this.checkAuthToken();
  }

  async checkAuthToken() {
    const { loggedIn } = this.props.currentUser;
    const cachedToken = cookie.get('auth_token');

    if(!loggedIn && cachedToken && cachedToken !== '') {
      const res = await axios.post(`${config.BACKEND_URL}/auth/validate-token`, {}, {
        headers: {'authorization': 'Bearer '+cachedToken}
      });
      this.props.setCurrentUser(res.data)
    }
  }

  render() {

    const drawerLinks = [
      {
        name: 'Recompensas',
        route: '/painel/recompensas'
      },
      {
        name: 'Nova Recompensa',
        route: '/painel/nova-recompensa'
      },
      {
        name: 'Empresas',
        route: '/painel/empresas'
      },
      {
        name: 'Nova Empresa',
        route: '/painel/nova-empresa'
      }, 
    ];

    const { currentUser } = this.props;
    console.log(currentUser)

    return (
      <div className="App">
        <Router>
          <Header showMenu={currentUser.loggedIn} displayName={currentUser.email} onClickExitButton={this.props.unsetCurrentUser} toggleDrawer={this.toggleDrawer} />
          {currentUser.loggedIn &&
            <Drawer isModalOpened={this.state.isDrawerOpened} toggleModal={this.toggleDrawer}>
              {drawerLinks.map(link => (
                <React.Fragment key={link.route}>
                  <DrawerLink to={link.route} onClick={() => this.toggleDrawer()}>{link.name}</DrawerLink>
                  <br/>
                </React.Fragment>
              ))}
            </Drawer>
          }
          <div style={Style.content}>
            <Switch>
              <Route exact path='/' render={() => <VoucherInput /> } />
              <Route exact path='/voucher' render={() => <VoucherDetails /> } />
              <Route exact path='/recompensas' render={() => <RewardList /> } />
              <Route exact path='/login' render={() => <Login /> } />
              {currentUser.loggedIn &&
                <React.Fragment>
                  <Route exact path='/painel/gerar-vouchers' render={() => <GenerateVouchers /> } />
                  <Route exact path='/painel/nova-empresa' render={() => <SaveCompany /> } />
                  <Route exact path='/painel/nova-recompensa' render={() => <SaveReward /> } />
                  <Route exact path='/painel/recompensas' render={() => <RewardLogs /> } />
                  <Route exact path='/painel/empresas' render={() => <CompanyList /> } />
                </React.Fragment>
              }
              <Redirect to={{pathname: "/" }}/>
            </Switch>
          </div>
          <AlertContainer />
        </Router>
      </div>
    );
  }
}

export default withStore(connect(state => ({
  currentUser: state.current_user,
}), {
  setCurrentUser,
  unsetCurrentUser
})(App));
