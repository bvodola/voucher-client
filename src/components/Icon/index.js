import React from 'react';
import styled from 'styled-components';

const Icon = ({chldren, className, ...props}) => {
  return(
    <span className={`icon material-icons ${className}`} {...props}></span>
  );
};

const IconAndText = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 20px;

  .material-icons {
    margin-right: 10px;
  }

  h1, h2, h3, p, label {
    margin: 0
  }
`;

export { IconAndText };
export default Icon;