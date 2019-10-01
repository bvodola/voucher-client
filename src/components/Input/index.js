import React from 'react';
import styled from 'styled-components';

const Input = styled.input`
  border: 0;
  border-radius: 6px;
  padding: 12px 15px 10px;
  background-color: rgba(0,68,102,.06);
  transition: box-shadow .3s ease,background .3s ease;
  font-size: 13px;
  line-height: 18px;
  color: #475b6f;

  &:hover {
    background-color: rgba(0,68,102,.04);
  }

  &:focus {
    outline: 0;
    background-color: #fff;
    box-shadow: 0 0 10px 0 rgba(0,49,59,.1), 0 1px 3px 0 rgba(0,59,71,.2);
  }
`;

export default Input;