import React from 'react';
import styled from 'styled-components';
import theme from 'src/theme';

const StyledButton = styled.button`
  border-radius: 30px;
  color: ${props => props.secondary ? theme.colors.blue1 : props.variant ? theme.colors[props.variant] : theme.colors.green1 };
  background-color: ${props => props.secondary ? theme.colors.green1 : props.variant ? theme.bgColors[props.variant] :theme.colors.blue1};
  text-transform: uppercase;
  padding: ${props => props.round ? props.padding || '10px' : '16px 32px'};
  font-weight: bold;
  border: none;
  cursor: pointer;
  outline: none;
  transition: background .3s ease;
  margin-top: ${props => props.noMargin ? '0px' : '24px'};
  width: ${props => props.round ? 'auto' : '100%'};
  display: ${props => props.round ? 'inline' : 'flex'};
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${props => props.secondary ? theme.colors.green2 : props.variant ? theme.bgColors[props.variant+'2'] :theme.colors.blue2};
  }

  .loading {
    margin: -10px 5px;
  }
`;

const Button = (props) => <StyledButton type='button' {...props} />

export default Button;