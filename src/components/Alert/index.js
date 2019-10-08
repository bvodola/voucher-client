import React from 'react';
import styled from 'styled-components';
import Icon, { IconAndText } from '../Icon';
import FadeIn from '../FadeIn';
import { PopUp } from '../Transitions';

const AlertWrapper = styled(IconAndText)`
  position: relative;
  margin-top: 20px;
  padding: 20px;
  border-radius: 5px;
  align-items: center;
  z-index: 3;

  .icon.close {
    cursor: pointer;
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

  ${props => props.type === 'danger' && `
    background: #dc3545;
    color: #fff;
  `}

  ${props => props.type === 'success' && `
    background: #28a745;
    color: #fff;
  `}
  
`;

const Alert = ({show, close, children, transition, ...props}) => {
  const AlertContent = (
    <AlertWrapper {...props} className='alert'>
      <Icon className='close' onClick={close}>close</Icon>
      {children}
    </AlertWrapper>
  );
  

  switch(transition) {
    case('popup'): {
      return (
        <PopUp show={show}>
          {AlertContent}
        </PopUp>
      );
    }
    default: {
      return (
        <FadeIn show={show}>
          {AlertContent}
        </FadeIn>
      );
    }
  }
  
};

export default Alert;