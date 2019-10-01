import React from 'react';
import styled from 'styled-components';

const LoadingImage = styled.img`

  ${props => `
    width: ${props.size}px;
    height: ${props.size}px;

    ${props.padded ?
      `margin-left: calc(50% - ${props.size/2}px);`
      :
      `margin: 5px`
    }
    
  `}
  z-index: 0;
  animation: spin 2s linear infinite;
  @keyframes spin { 100% { transform:rotate(360deg); } }
`;

const Loading = (props) => (
  <LoadingImage {...props} src='/public/loading.png' alt='Loading' className='loading' />
)

Loading.defaultProps = {
  size: 60,
}

export default Loading;