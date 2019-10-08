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
import styled from 'styled-components';

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

const PointsHeading = styled(H3)`
  color: #3c3c3c;
  text-align: left;
  font-size: 16px;
  margin: 32px 0 -20px 0;
  padding: 12px;
  border-radius: 8px;
  background: #fff;

  @media (min-width: 700px) {
    margin-left: 20px;
    margin-right: 20px;
  }
`

const LogoThumbnail = styled.div`
  border-radius: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  width: 50px;
  height: 50px;
  padding: 3px;
  display: flex;
  margin-left: 76%;
  margin-top: -78px;
  margin-bottom: 45px;
  z-index: 1;
  position: relative;
  overflow: hidden;

  img {
    align-self: center;
    width: 100%;
  }
`

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
    const notEnoughPoints = this.state.selectedReward.points && this.props.selectedVoucher.points < this.state.selectedReward.points;
    if(!notEnoughPoints) {
      this.setState({isLoadingRewardSelection: true});
      await this.props.selectVoucherReward(selectedReward);
      this.setState({isLoadingRewardSelection: false});
      this.props.history.push('/voucher');
    }
  }
 
  async getRewards() {
    if (typeof this.props.selectedVoucher.points === 'number') {
      this.setState({isLoadingData: true});
      const rewards = await api.getRewards({stock_gte: 1});
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
    const notEnoughPoints = selectedReward.points && selectedVoucher.points < selectedReward.points;

    // Divide rewards in an object of categories of points
    // Example: dividedRewards = [{points: 4, rewards: [...]}, {points: 6, rewards: [...]}, ...]
    const pointCategories = [1,2,3,4,5,6,7,8,9,10];
    let dividedRewards = [];
    pointCategories.forEach(pc => {
      dividedRewards.push( 
        {
          points: pc,
          rewards: this.state.rewards.filter(r => r.points === pc)
        }
      )
    });

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
              `Este voucher lhe dá o direito de escolher uma recompensa de ${this.props.selectedVoucher.points} pontos`
            }
          </H2>
          <Link to='/' style={{textDecoration: 'none', paddingLeft: '10px', display: 'block', cursor: 'pointer'}}>
            <IconAndText>
              <Icon>chevron_left</Icon>
              <P>Validar outro voucher</P>
            </IconAndText>
          </Link>

          {/* *************** */}
          {/* List of Rewards */}
          {/* *************** */}
          <div>
            {dividedRewards.map(rewardCategory => (
              rewardCategory.rewards.length > 0 &&
              <React.Fragment key={rewardCategory.points}>
                <PointsHeading>Recompensas de {rewardCategory.points} pontos</PointsHeading>
                <Stack>
                  
                  {rewardCategory.rewards.map(reward => (
                    <Card key={reward._id} textCenter style={{
                      opacity: this.props.selectedVoucher.points < reward.points ? '0.5' : '1'
                    }}>
                      <H2 style={Style.rewardCardTitle}>{truncate(reward.name, 50)}</H2>
                      <img className='fullWidth' src={reward.images[0]} alt=''/>
                      <LogoThumbnail>
                        <img src={reward.company.logo} alt=''/>
                      </LogoThumbnail>
                      <P style={Style.rewardCardDescription}>
                        {truncate(reward.description, 140)}
                      </P>
                      <P>
                        <i>{reward.points} pontos</i>
                      </P>
                      <P>
                        {reward.stock > 10 ? 
                          <b>Em Estoque</b> :
                          reward.stock > 0 ?
                          <b style={Style.redText}>Últimas unidades</b> :
                          <b>Esgotado</b>
                        }
                      </P>
                      <Button onClick={() => this.toggleModal(reward)}>Ver Mais</Button>
                    </Card>
                  ))}
                </Stack>
              </React.Fragment>
            ))}
            
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
              <LogoThumbnail>
                <img src={selectedReward.company.logo} alt=''/>
              </LogoThumbnail>
              <P>{selectedReward.description}</P>
              <P>
                Status:&nbsp;
                {selectedReward.stock > 10 ? 
                  <b>Em Estoque</b> :
                  selectedReward.stock > 0 ?
                  <b style={Style.redText}>Últimas unidades</b> :
                  <b>Esgotado</b>
                }
              </P>

              <IconAndText>
                <Icon>room</Icon> 
                <H3>Onde retirar?</H3>
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
              
              <Button disabled={isLoadingRewardSelection || notEnoughPoints} onClick={() => this.selectReward(selectedReward)}>
                {isLoadingRewardSelection ?
                  <React.Fragment><Loading size={20} /> Processando...</React.Fragment> :
                notEnoughPoints ?
                    'Você não tem pontos suficientes' :
                    'Escolher este brinde'
                }
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