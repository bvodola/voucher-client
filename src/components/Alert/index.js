import React from 'react';
import styled from 'styled-components';
import Icon, { IconAndText } from '../Icon';
import FadeIn from '../FadeIn';

const AlertWrapper = styled(IconAndText)`
  position: relative;
  margin-top: 20px;
  padding: 20px;
  border-radius: 5px;
  align-items: flex-start;

  .icon.close {
    position: absolute;
    top: 6px;
    right: -2px;
    font-size: 20px;
  }

  ${props => props.padded && `
    @media (min-width: 900px) {
      margin: 20px 30% 0;
      padding: 40px;
    }
  `}

  ${props => props.danger && `
    background: #dc3545;
    color: #fff;
  `}
  
`;

const Alert = ({show, close, children, ...props}) => (
  <FadeIn show={show}>
    <AlertWrapper {...props}>
      <Icon className='close' onClick={close}>close</Icon>
      {children}
    </AlertWrapper>
  </FadeIn>
);

export default Alert;