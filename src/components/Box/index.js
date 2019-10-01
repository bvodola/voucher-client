import React from 'react';
import styled from 'styled-components';

const Box = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 20px;
  background: #fcfcfc;
  border-radius: 10px;
  border: 3px solid #eee
  margin-top: 20px

  ${props => props.padded && `
    @media (min-width: 900px) {
      margin: 20px 30% 0;
      padding: 40px;
    }
  `}
`;

export default Box;