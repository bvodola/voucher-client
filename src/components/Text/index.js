import React from 'react';
import styled from 'styled-components';
import theme from 'src/theme';

const H1 = styled.h1`
  color: ${theme.colors.gray1};
  text-align: center;
  margin-top: 20px
  ${props => props.spaceBetween &&
    `display: flex;
    justify-content: space-between;
    font-size: 20px;
    align-items: center;

    button {
      padding: 12px 24px;
    }
    `
    
  }

  @media(min-width: 700px) {
    margin-left: 20px;
    margin-right: 20px;
  }
  
`;

const H2 = styled.h2`
  color: ${theme.colors.gray1};
  text-align: center;
  font-size: 20px
  margin-top: 20px
`;

const H3 = styled.h3`
  color: ${theme.colors.gray1};
  text-align: center;
  font-size: 16px
  margin-top: 20px
`;

const FormSubtitle = styled.label`
font-size: 16px
  color: ${theme.colors.gray2};
  line-height: 14px;
  display: block;
  margin: 20px 0;
  font-weight: 500;
  font-style: italic;
`;

const P = styled.p`
  color: ${theme.colors.gray1};
  margin-top: ${props => props.noMargin ? '0px': '20px'}
`;

const Counter = styled.div`
  display: inline-block;
  background: #eee;
  border-radius: 100%;
  font-weight: bold;
  font-size: 14px;
  padding: 10px 14px;

`

const Label = styled.label`
  font-size: 12px;
  color: ${theme.colors.gray2};
  line-height: 14px;
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
`;

export {
  H1,
  H2,
  H3,
  FormSubtitle,
  Label,
  Counter,
  P,
};