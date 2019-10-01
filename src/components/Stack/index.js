import React from 'react';
import styled from 'styled-components';

const Stack = styled.div`
  display: flex;
  margin-top: 32px;
  flex-wrap: wrap;
  
  > * {
    @media (min-width: 700px) {
      flex-basis: calc(50% - 40px);
      margin: 20px;
    }
  
    @media (min-width: 900px) {
      flex-basis: calc(33% - 40px);
    }
  
    @media (min-width: 1200px) {
      flex-basis: calc(25% - 40px);
    }  
  }
`;

export default Stack;