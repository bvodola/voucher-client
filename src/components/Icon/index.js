import React from 'react';
import styled from 'styled-components';

const _Icon = ({chldren, className, ...props}) => {
  return(
    <span className={`icon material-icons ${className}`} {...props}></span>
  );
};

const Icon = styled(_Icon)`
  cursor: ${props => typeof props.onClick === 'function' ? 'pointer' : 'auto'}
`

const IconAndText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: ${props => props.noMargin ? '0px': '20px'};
  cursor: ${props => typeof props.onClick === 'function' ? 'pointer' : 'auto'}

  .material-icons {
    margin-right: 10px;
  }

  h1, h2, h3, p, label {
    margin: 0
  }
`;

export { IconAndText };
export default Icon;