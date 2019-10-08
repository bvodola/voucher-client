import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Link} from 'react-router-dom';
import theme from 'src/theme';
import api from 'src/api';
import { selectVoucherReward } from 'src/state/actions/vouchers';
import { showAlert } from 'src/state/actions/alerts';
import { truncate } from 'src/helpers';
import { Card, Button, Modal, Icon, Stack, Loading, Box } from  'src/components';
import { Row, Col } from 'src/components/Layout';
import { H1, H2, H3, P } from 'src/components/Text';
import { IconAndText } from 'src/components/Icon';
import FadeIn from 'react-fade-in';
import SaveReward from './SaveReward'
import { randomString } from 'src/helpers';
import { format } from 'date-fns';

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
    marginTop: '20px',
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

class RewardLogs extends React.Component {

  constructor() {
    super();
    this.state = {
      isModalOpened: false,
      isLoadingData: false,
      isLoadingRewardSelection: false,
      rewards: [],
      selectedReward: {},
      editRewardMode: false,
    }

    this.toggleModal = this.toggleModal.bind(this);
    this.setSelectedReward = this.setSelectedReward.bind(this);
    this.selectReward = this.selectReward.bind(this);
    this.getRewards = this.getRewards.bind(this);
  }

  toggleModal(reward = {}) {
    this.setState({isModalOpened: !this.state.isModalOpened}, () => {
      if(this.state.isModalOpened) {
        if(reward._id) this.setSelectedReward(reward);
      } else {
        this.setEditRewardMode(false);
      }
    });
  }

  async selectReward(selectedReward) {
    this.setState({isLoadingRewardSelection: true});
    await this.props.selectVoucherReward(selectedReward);
    this.setState({isLoadingRewardSelection: false});
    this.props.history.push('/voucher');
  }
 
  async getRewards(showLoading = true) {
    if(showLoading) this.setState({isLoadingData: true});
    const rewards = await api.getRewards({});
    const selectedReward = rewards.find(r => r._id === this.state.selectedReward._id);
    this.setState({rewards, selectedReward}, () => {
      this.setState({isLoadingData: false});
      this.setEditRewardMode(false);
    });
  }

  setSelectedReward(selectedReward) {
    this.setState({selectedReward});
  }

  setEditRewardMode(editRewardMode) {
    this.setState({editRewardMode});
  }

  async deleteItem(_id) {
    const approveDelete = confirm('Tem certeza que dejesa remover este item?');
    if(approveDelete) {
      await api.removeReward(_id);
      await this.getRewards();
      this.toggleModal();
      this.props.showAlert('success', 'Item removido com sucesso.')
    }
  }

  componentDidMount() {
    this.getRewards();
  }

  render() {
    const { selectedReward, isModalOpened, isLoadingRewardSelection, editRewardMode } = this.state;
    const { selectedVoucher } = this.props;

    return (
      <div style={Style.rewardList}>
        <FadeIn>
          {/* ******** */}
          {/* Headings */}
          {/* ******** */}
          <H1 spaceBetween>
            Recompensas
            <Link to='/painel/nova-recompensa'><Button noMargin>Nova recompensa</Button></Link>
          </H1>

          {/* *************** */}
          {/* List of Rewards */}
          {/* *************** */}
          <div>
            {this.state.isLoadingData && <Loading padded />}
            <Stack>
            {this.state.rewards.map(reward => (
              <Card key={reward._id} onClick={() => this.toggleModal(reward)}>

                <Row>
                  <Col><img style={{width: '50px', marginRight: '16px'}} src={reward.images[0]} alt=''/></Col>
                  <Col>
                    <span>
                      <P noMargin>{truncate(reward.name, 50)}</P>
                      <P noMargin>Pontos: {reward.points}</P>
                    </span>
                  </Col>
                </Row>
                <P>
                  Vouchers emitidos: {reward.vouchers.length}
                </P>
                <P noMargin>
                  Em estoque: {reward.stock}
                </P>
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
        {editRewardMode ?
          <div>
            <IconAndText onClick={() => this.setEditRewardMode(false)}>
              <Icon>chevron_left</Icon>
              <p>Voltar</p>
            </IconAndText>
            <SaveReward
              editMode={true}
              handleSubmit={() => {
                this.getRewards();
              }}
              initialState={{
                form: {
                  ...selectedReward,
                  company_id: selectedReward.company ? selectedReward.company._id : '',
                },
                images: [{
                  _id: randomString(),
                  src: selectedReward.images[0],
                  uploaded: true,
                }]
              }}
            />
          </div>
          
        :

        // ************
        // Display Mode
        // ************
          typeof selectedReward !== 'undefined' && selectedReward && isModalOpened && (
            <div style={Style.modalContent}>
              <Row style={{justifyContent: 'space-between', paddingBottom: '10px', borderBottom: '1px solid #eee'}}>
                <Col><Icon style={Style.closeIcon} onClick={this.toggleModal}>close</Icon></Col>
                <Col><H2>{selectedReward.name}</H2></Col>
                <Col>
                  <Button round disabled={isLoadingRewardSelection} onClick={() => this.setEditRewardMode(true)}>
                    <Icon>edit</Icon>
                  </Button>
                  &nbsp;
                  <Button variant='danger' round disabled={isLoadingRewardSelection} onClick={() => this.deleteItem(selectedReward._id)}>
                    <Icon>delete</Icon>
                  </Button>
                </Col>
              </Row>
              <img style={Style.modalImage} src={selectedReward.images && selectedReward.images[0]} alt=''/>
              <P>{selectedReward.description}</P>
              <P>
                Pontos:&nbsp;
                {selectedReward.points}
              </P>
              <P>
                Em estoque:&nbsp;
                {selectedReward.stock}
              </P>
              <P>
                Vouchers emitidos:&nbsp;
                {selectedReward.vouchers && selectedReward.vouchers.length}
              </P>
              {selectedReward.vouchers && selectedReward.vouchers.length > 0 &&
                <Box>
                  <Row>
                    <Col style={{flex:1}}><b>Código do voucher</b></Col>
                    <Col style={{flex:1}}><b>Data de emissão</b></Col>
                  </Row>
                  {selectedReward.vouchers.map(voucher => (
                    <Row style={{marginTop: '10px'}}>
                      <Col style={{flex:1}}>{voucher.code}</Col>
                      <Col style={{flex:1}}>{format(new Date(Number(voucher.emitted_date)), "dd'/'MM'/'yyyy' 'HH:mm'h'")}</Col>
                    </Row>
                  ))}
                </Box>
              }
              

              <IconAndText>
                <Icon>room</Icon> 
                <H3>Pontos de retirada</H3>
              </IconAndText>

              {selectedReward.company && selectedReward.company.locations ?
                selectedReward.company.locations.map(location => (
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
  showAlert,
})(RewardLogs));