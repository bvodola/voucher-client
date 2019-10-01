import React from 'react';
import styled from 'styled-components';
import theme from 'src/theme';

const Button = styled.button`
  border-radius: 30px;
  color: ${theme.colors.green1};
  background-color: ${theme.colors.blue1};
  text-transform: uppercase;
  padding: 16px 32px;
  font-weight: bold;
  border: none;
  cursor: pointer;
  outline: none;
  transition: background .3s ease;
  margin-top: 24px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${theme.colors.blue2};
  }

  .loading {
    margin: -10px 5px;
  }
`;

export default Button;