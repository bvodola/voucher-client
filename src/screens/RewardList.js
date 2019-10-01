import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import theme from 'src/theme';
import api from 'src/api';
import { selectVoucherReward } from 'src/state/actions/vouchers';
import { truncate } from 'src/helpers';
import { Card, Button, Modal, Icon, Stack, Loading } from  'src/components';
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

class RewardList extends React.Component {

  constructor() {
    super();
    this.state = {
      isModalOpened: false,
      isLoadingData: false,
      isLoadingRewardSelection: false,
      rewards: [],
      selectedReward: {},
    }

    this.toggleModal = this.toggleModal.bind(this);
    this.setSelectedReward = this.setSelectedReward.bind(this);
    this.selectReward = this.selectReward.bind(this);
    this.getRewards = this.getRewards.bind(this);
  }

  toggleModal(reward) {
    if(!this.state.isModalOpened) {
      this.setSelectedReward(reward);
    }
    this.setState({isModalOpened: !this.state.isModalOpened});
  }

  async selectReward(selectedReward) {
    this.setState({isLoadingRewardSelection: true});
    await this.props.selectVoucherReward(selectedReward);
    this.setState({isLoadingRewardSelection: false});
    this.props.history.push('/voucher');
  }
 
  async getRewards() {
    if (typeof this.props.selectedVoucher.points === 'number') {
      this.setState({isLoadingData: true});
      const rewards = await api.getRewards({points_lte: this.props.selectedVoucher.points, stock_gte: 1});
      this.setState({rewards}, () => {
        this.setState({isLoadingData: false});
      });
    } else {
      this.props.history.push('/');
    }
  }

  setSelectedReward(selectedReward) {
    this.setState({selectedReward});
  }

  componentDidMount() {
    this.getRewards();
  }

  render() {
    const { selectedReward, isModalOpened, isLoadingRewardSelection } = this.state;
    const { selectedVoucher } = this.props;

    return (
      <div style={Style.rewardList}>
        <FadeIn>
          {/* ******** */}
          {/* Headings */}
          {/* ******** */}
          <H1>
            Escolha sua recompensa
          </H1>
          <H2>
            {selectedVoucher.validated ?
              <span>Atenção: este voucher já foi utlizado. <Link to='/voucher'>Clique aqui</Link> para acessá-lo ou <Link to='/'>valide outro código</Link></span>:
              `Este voucher lhe dá o direito de escolher uma recompensa de até ${this.props.selectedVoucher.points} pontos`
            }
          </H2>

          {/* *************** */}
          {/* List of Rewards */}
          {/* *************** */}
          <div>
            <Stack>
            {this.state.rewards.map(reward => (
              <Card key={reward._id}>
                <H2 style={Style.rewardCardTitle}>{truncate(reward.name, 50)}</H2>
                <img src={reward.images[0]} alt=''/>
                <P style={Style.rewardCardDescription}>
                  {truncate(reward.description, 140)}
                </P>
                <P>
                  {reward.stock > 10 ? 
                    <b>Em Estoque</b> :
                    reward.stock > 0 ?
                    <b style={Style.redText}>Últimas uinidades</b> :
                    <b>Esgotado</b>
                  }
                </P>
                <Button onClick={() => this.toggleModal(reward)}>Ver Mais</Button>
              </Card>
            ))}
            </Stack>
            {this.state.isLoadingData && <Loading padded />}
          </div>
        </FadeIn>


        {/* ********************* */}
        {/* Rewards Details Modal */}
        {/* ********************* */}
        <Modal toggleModal={this.toggleModal} isModalOpened={isModalOpened}>
          <Icon style={Style.closeIcon} onClick={this.toggleModal}>close</Icon>
          {typeof selectedReward !== 'undefined' && selectedReward && isModalOpened &&
            <div style={Style.modalContent}>
              <H2>{selectedReward.name}</H2>
              <img style={Style.modalImage} src={selectedReward.images && selectedReward.images[0]} alt=''/>
              <P>{selectedReward.description}</P>
              <P>
                Status:&nbsp;
                {selectedReward.stock > 10 ? 
                  <b>Em Estoque</b> :
                  selectedReward.stock > 0 ?
                  <b style={Style.redText}>Últimas uinidades</b> :
                  <b>Esgotado</b>
                }
              </P>

              <IconAndText>
                <Icon>room</Icon> 
                <H3>Onde retirar?</H3>
              </IconAndText>

              {selectedReward.company.locations.map(location => (
                <P style={{textAlign: 'left'}} key={location.name}>
                  <b>{location.name}</b><br/>
                  {location.address}
                </P>
              ))}
              
              <Button disabled={isLoadingRewardSelection} onClick={() => this.selectReward(selectedReward)}>
                {isLoadingRewardSelection ? <React.Fragment><Loading size={20} /> Processando...</React.Fragment> : 'Escolher este brinde'}
              </Button>
            </div>
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
})(RewardList));