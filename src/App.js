import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom';
import { withStore } from 'src/state/store';
import { Header } from 'src/components';
import VoucherDetails from 'src/screens/VoucherDetails';
import VoucherInput from 'src/screens/VoucherInput';
import RewardList from 'src/screens/RewardList';
import Login from 'src/screens/Login';
import GenerateVouchers from 'src/screens/GenerateVouchers';
import SaveBranch from 'src/screens/SaveBranch';
import SaveReward from 'src/screens/SaveReward';
import Test from 'src/screens/Test';
import './App.scss'

const Style = {
  content: {
    padding: '70px 20px 0 20px',
  }
}

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <Router>
          <Header />
          <div style={Style.content}>
            <Route exact path='/' render={() => <VoucherInput /> } />
            <Route exact path='/voucher' render={() => <VoucherDetails /> } />
            <Route exact path='/recompensas' render={() => <RewardList /> } />
            <Route exact path='/login' render={() => <Login /> } />
            <Route exact path='/gerar-vouchers' render={() => <GenerateVouchers /> } />
            <Route exact path='/cadastrar-filial' render={() => <SaveBranch /> } />
            <Route exact path='/cadastrar-recompensa' render={() => <SaveReward /> } />
            <Route exact path='/test' render={() => <Test /> } />
          </div>
        </Router>
      </div>
    );
  }
}

export default withStore(App);
