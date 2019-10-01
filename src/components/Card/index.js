import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: #ffffff;
  border-radius: 6px;
  border: none;
  color: #484848;
  box-shadow: 0 0 23px 0 rgba(0,0,0,0.03);
  transition: margin 0.3s ease, box-shadow 0.3s ease;
  padding: 10px 20px 20px;
  margin: 20px 0;
  text-align: center;
  flex-basis: 100%;

  img {
    margin-top: 10px;
    max-width: 100%;
    max-height: 200px;
    border-radius: 4px;
  }

  &:hover {
    box-shadow: 0 6px 23px 0 rgba(0,0,0,0.1);
    margin-top: 16px;
    margin-bottom: 24px;
  }
`;

export default Card;