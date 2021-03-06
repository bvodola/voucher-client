import React from 'react';
import axios from '../services/axios';
// import Snackbar from './Commons/Snackbar';
import StateHandler from '../services/stateHandler';

class DataContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loadingQueryName: null,
      mutation: false,
      busy: false,
      data: null,
      isSnackbarOpened: false,
      snackBarMessage: 'Dados salvos com sucesso',
    };

    this.query = this.query.bind(this)
    this.mutation = this.mutation.bind(this)
    this.handleToggleSnackbar = this.handleToggleSnackbar.bind(this)
  }

  async mutation(mutation, refreshData = false) {
    this.setState({loading: true, mutation: true});
    await axios.post(`/graphql`, { query: 'mutation '+mutation })
    if(refreshData) await this.query();
    this.setState({loading: false, mutation: false});
  }

  async query(dataQuery, config) {
    if(!config) config = {};
    if(typeof config.fromPolling === 'undefined') config.fromPolling = false;
    if(typeof config.triggerLoading === 'undefined') config.triggerLoading = true;
    const {fromPolling, triggerLoading} = config;

    if(!dataQuery) dataQuery = this.props.query;
    const queryName = dataQuery.match(/([A-Z,a-z])\w+/g)[0];
    this.setState({loading: triggerLoading && true, loadingQueryName: triggerLoading ? queryName : null});
    
    let res = await axios.post(`/graphql`, { query: dataQuery })
    if(!fromPolling || (fromPolling && !this.state.mutation)) {
      this.setState({data: res.data.data, loading: false, loadingQueryName: null})
    }
  }

  async componentDidMount() {
    try {
      await this.query()
      if(this.props.polling) {
        setInterval(async () => {
          if(!this.state.busy && !this.state.loading && !this.state.mutation) {
            await this.query(null, {fromPolling: true});
          }
        }, this.props.polling)
      }
    } catch(err) {
      console.error(err)
    }
  }

  handleToggleSnackbar(event, reason) {
    if (reason === 'clickaway') return;
    const newState = reason !== 'timeout' ?  !this.state.isSnackbarOpened : false;
    this.setState({ isSnackbarOpened: newState });
  };

  componentDidUpdate(prevProps) {
    if(prevProps.query !== this.props.query)
      this.query();
  }

  render() {
    const {children} = this.props;
    const childProps = { 
      data: this.state.data || {},
      loading: this.state.loading,
      loadingQueryName: this.state.loadingQueryName,
      busy: this.state.busy,
      handleToggleSnackbar: this.handleToggleSnackbar,
      query: this.query,
      mutation: this.mutation,
      scope: this,
      handler: new StateHandler(this),
    }

    return(
      <div>
        {children(childProps)}
        {/* <Snackbar
          handleToggleSnackbar={this.handleToggleSnackbar}
          isSnackbarOpened={this.state.isSnackbarOpened}
        >
          Informações salvas com sucesso
        </Snackbar> */}
      </div>
    );
  }
}

export const _mutation = async (mutation) => {
  try {
    const res = await axios.post(`/graphql`, { query: 'mutation '+mutation });
    return res.data.data;  
  } catch(err) {
    throw err;
  }
}

export const _query = async (query) => {
  try {
    const res = axios.post(`/graphql`, { query });
    return res.data.data;
  } catch(err) {
    throw err;
  }
}

export default DataContainer;