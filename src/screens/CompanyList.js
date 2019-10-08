import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import theme from 'src/theme';
import api from 'src/api';
import { selectVoucherReward } from 'src/state/actions/vouchers';
import { showAlert } from 'src/state/actions/alerts';
import { truncate, randomString } from 'src/helpers';
import SaveCompany from 'src/screens/SaveCompany';
import { Card, Button, Modal, Icon, Stack, Loading, Row, Col } from  'src/components';
import { H1, H2, H3, P } from 'src/components/Text';
import { IconAndText } from 'src/components/Icon';
import FadeIn from 'react-fade-in';

const Style = {
  rewardList: {
    display: 'flex',
    flexDirection: 'column',
  },
  rewardCardTitle: {
    height: '50px'
  },
  rewardCardDescription: {
    height: '80px'
  },
  closeIcon: {
    cursor: 'pointer',
  },
  modalContent: {
    textAlign: 'center',
  },
  modalImage: {
    marginTop: '10px',
    maxWidth: '100%',
    borderRadius: '40px',
    maxHeight: '400px',
  },
  redText: {
    color: theme.colors.red
  }
}

class CompanyList extends React.Component {

  constructor() {
    super();
    this.state = {
      isModalOpened: false,
      isLoadingData: false,
      isLoadingRewardSelection: false,
      data: [],
      selectedItem: {},
      editMode: false,
    }

    this.toggleModal = this.toggleModal.bind(this);
    this.setSelectedItem = this.setSelectedItem.bind(this);
    // this.selectReward = this.selectReward.bind(this);
    this.getData = this.getData.bind(this);
  }

  toggleModal(itemData) {
    this.setState({isModalOpened: !this.state.isModalOpened}, () => {
      if(this.state.isModalOpened) {
        if(itemData._id) this.setSelectedItem(itemData);
      } else {
        this.setEditMode(false);
      }
    });
  }

  // async selectReward(selectedItem) {
  //   this.setState({isLoadingRewardSelection: true});
  //   await this.props.selectVoucherReward(selectedItem);
  //   this.setState({isLoadingRewardSelection: false});
  //   this.props.history.push('/voucher');
  // }
 
  async getData() {
    this.setState({isLoadingData: true});
    const data = await api.getCompanies();
    const selectedItem = data.find(entry => entry._id === this.state.selectedItem._id);
    this.setState({data}, () => {
      this.setState({isLoadingData: false, selectedItem});
      this.setEditMode(false);
    });
  }

  setSelectedItem(selectedItem) {
    this.setState({selectedItem});
  }

  setEditMode(editMode) {
    this.setState({editMode});
  }
  
  async deleteItem(_id) {
    const approveDelete = confirm('Tem certeza que dejesa remover este item?');
    if(approveDelete) {
      await api.removeCompany(_id);
      await this.getData();
      this.toggleModal();
      this.props.showAlert('success', 'Item removido com sucesso.')
    }
  }

  componentDidMount() {
    this.getData();
  }

  render() {
    const { selectedItem, isModalOpened, isLoadingRewardSelection } = this.state;

    return (
      <div style={Style.rewardList}>
        <FadeIn>
          {/* ******** */}
          {/* Headings */}
          {/* ******** */}

          <H1 spaceBetween>
            Empresas
            <Link to='/painel/nova-empresa'><Button noMargin>Nova empresa</Button></Link>
          </H1>
          

          {/* *************** */}
          {/* List of Rewards */}
          {/* *************** */}
          <div>
            {this.state.isLoadingData && <Loading padded />}
            <Stack>
            {this.state.data.map(company => (
              <Card key={company._id} textCenter onClick={() => this.toggleModal(company)}>
                
                <H2 style={Style.rewardCardTitle}>{truncate(company.name, 50)}</H2>
                <div style={{height: '220px', display: 'flex', justifyContent: 'center'}}> 
                  <img style={{alignSelf: 'center'}} className='fullWidth' src={company.logo || 'public/placeholder.png'} alt=''/>
                </div>
              </Card>
            ))}
            </Stack>
          </div>
        </FadeIn>


        {/* ********************* */}
        {/* Rewards Details Modal */}
        {/* ********************* */}
        <Modal toggleModal={this.toggleModal} isModalOpened={isModalOpened}>

          {/* ********* */}
          {/* Edit Mode */}
          {/* ********* */}
          {this.state.editMode ?
            <div>
              <IconAndText onClick={() => this.setEditMode(false)}>
                <Icon>chevron_left</Icon>
                <p>Voltar</p>
              </IconAndText>
              <SaveCompany
                editMode={true}
                handleSubmit={() => {
                  this.getData();
                }}
                initialState={{
                  form: {
                    ...selectedItem,
                  },
                  images: selectedItem.logo ? [{
                    _id: randomString(),
                    src: selectedItem.logo,
                    uploaded: true,
                  }] : []
                }}
              />
            </div>
            
          :

          // ************
          // Display Mode
          // ************
            typeof selectedItem !== 'undefined' && selectedItem && isModalOpened && (
              <div style={Style.modalContent}>
                <Row style={{justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #eee'}}>
                  <Col><Icon style={Style.closeIcon} onClick={this.toggleModal}>close</Icon></Col>
                  <Col><H2>{selectedItem.name}</H2></Col>
                  <Col>
                    <Button round disabled={isLoadingRewardSelection} onClick={() => this.setEditMode(true)}>
                      <Icon>edit</Icon>
                    </Button>
                    &nbsp;
                    <Button variant='danger' round disabled={isLoadingRewardSelection} onClick={() => this.deleteItem(selectedItem._id)}>
                      <Icon>delete</Icon>
                    </Button>
                  </Col>
                </Row>
                <img style={Style.modalImage} src={selectedItem.logo || 'public/placeholder.png'} alt=''/>

                <IconAndText>
                  <Icon>room</Icon> 
                  <H3>Pontos de retirada</H3>
                </IconAndText>

                {selectedItem.locations ?
                  selectedItem.locations.map(location => (
                    <P style={{textAlign: 'left'}} key={location.name}>
                      <b>{location.name}</b><br/>
                      {location.address}
                    </P>
                  )) :
                  <P>Nenhuma localização disponível</P>
                }
              </div>
            )
          }
        </Modal>
      </div>
    );
  }
}

export default withRouter(connect((state) => ({
  selectedVoucher: state.vouchers.selectedVoucher
}), {
  selectVoucherReward,
  showAlert
})(CompanyList));