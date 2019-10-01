import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { H1, H3, P, Label } from 'src/components/Text';
import Icon, { IconAndText } from 'src/components/Icon';
import styled from 'styled-components';
import { truncate } from 'src/helpers';
import FadeIn from 'react-fade-in';

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
    width: 40%;
    height: 100%; 
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
    } else {
      return (
        <FadeIn>
          <div style={Style.voucherInput}>
            <H1>
              Seu Voucher
            </H1>
    
            <FeatureBox>
              <Label>Código do Voucher</Label>
              <P className='featured'>{selectedVoucher.code}</P>
              <sub>Apresente este código em um dos postos de troca abaixo</sub>
              
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
              
              {selectedVoucher.reward.company.locations.map(location => (
                <P>
                  <b>{location.name}</b><br/>
                  {location.address}
                </P>
              ))}
              
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
})(VoucherDetails));