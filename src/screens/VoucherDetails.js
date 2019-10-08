import React from 'react';
import { connect } from 'react-redux';
import { showAlert } from 'src/state/actions/alerts'
import { withRouter, Link } from 'react-router-dom';
import { H1, H3, P, Label } from 'src/components/Text';
import Icon, { IconAndText } from 'src/components/Icon';
import styled from 'styled-components';
import { truncate } from 'src/helpers';
import FadeIn from 'react-fade-in';
import config from 'src/config'

const Style = {
  voucherInput: {
    display: 'flex',
    flexDirection: 'column',
  },
}

const FeatureBox = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  border: 3px solid #eee
  margin-top: 20px

  label {
    font-size: 14px;
    text-align: center;
  }

  p.featured {
    margin-top: 5px;
    font-size: 28px;
    text-align: center;
  }

  sub {
    margin-top: 10px;
    font-style: italic;
    color: #999;
    text-align: center;
  }

  @media (min-width: 900px) {
    margin: 20px 30% 0;
    padding: 40px;
  }
`;

const ImageAndText = styled.div`
  display: flex;
  margin-top: 20px;

  img {
    align-self: center;
    width: 40%;
    margin-right: 10px;
  }

  h3 {
    text-align: left;
  }

  p {
    margin-top: 10px;
  }
`

class VoucherDetails extends React.Component {
  render() {

    const { selectedVoucher } = this.props;

    if(typeof selectedVoucher.code === 'undefined') {
      this.props.history.push('/')
      return null;

    } else if(!selectedVoucher.reward) {
      this.props.history.push('/');
      this.props.showAlert('danger', 'O código digitado não é válido. Por favor, tente novamente, ou se preferir, entre em contato.')
      return null;
    } else {
      return (
        <FadeIn>
          <div style={Style.voucherInput}>
            <H1>
              Seu Voucher
            </H1>

            <Link to='/' style={{textDecoration: 'none', paddingLeft: '10px', display: 'block', cursor: 'pointer'}}>
              <IconAndText>
                <Icon>chevron_left</Icon>
                <P>Validar outro voucher</P>
              </IconAndText>
            </Link>

            <a target="_blank" href={`${config.BACKEND_URL}/pdf-voucher/${selectedVoucher.code}`} style={{textDecoration: 'none', paddingLeft: '10px', display: 'block', cursor: 'pointer'}}>
              <IconAndText>
                <Icon>cloud_download</Icon>
                <P>Fazer download do voucher</P>
              </IconAndText>
            </a>
    
            <FeatureBox>
              <Label>Código do Voucher</Label>
              <P className='featured'>{selectedVoucher.code}</P>
              <sub>Apresente este código em um dos postos de troca abaixo. <b>Não esqueça de baixar (botão acima), sem o voucher você não consegue retirar seu brinde!</b></sub>
              
              <ImageAndText>
                <img src={selectedVoucher.reward.images[0]} alt=''/>
                <div>
                  <H3>{selectedVoucher.reward.name}</H3>
                  <P>{truncate(selectedVoucher.reward.description, 60)}</P>
                </div>
              </ImageAndText>
    
              <IconAndText>
                <Icon>room</Icon> 
                <H3>Onde retirar?</H3>
              </IconAndText>
              
              {selectedVoucher.reward.company && selectedVoucher.reward.company ? selectedVoucher.reward.company.locations.map(location => (
                <P>
                  <b>{location.name}</b><br/>
                  {location.address}
                </P>
                )) : 
                <P>Nenhuma localização disponível</P>
              }
              
            </FeatureBox>
          </div>
        </FadeIn>
      );
    }

  }
}

export default withRouter(connect(state => ({
  selectedVoucher: state.vouchers.selectedVoucher
}), {
  showAlert
})(VoucherDetails));