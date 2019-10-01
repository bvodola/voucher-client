import React from 'react';
import styled from 'styled-components';
import theme from 'src/theme';

const H1 = styled.h1`
  color: ${theme.colors.gray1};
  text-align: center;
  margin-top: 20px
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

const P = styled.p`
  color: ${theme.colors.gray1};
  margin-top: 20px
`;

const Label = styled.label`
  font-size: 12px;
  color: #859ba6;
  line-height: 14px;
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
`;

export {
  H1,
  H2,
  H3,
  Label,
  P,
};