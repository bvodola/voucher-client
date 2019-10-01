import React from 'react';
import styled from 'styled-components';
import { Transition } from "react-transition-group"

const FadeInContent = styled.span`
  transition: opacity 300ms ease-in-out;
  z-index: ${({ state }) => (state === "entering" || state === "entered" || state === "exiting" ? '1' : '-1')};
  opacity: ${({ state }) => (state === "entering" || state === "entered" ? 1 : 0)};
  height: ${({ state }) => (state === "entering" || state === "entered" ? 'auto' : 0)};
`;

const FadeIn = ({show, children, style, ...props}) => (
  <Transition
    in={show}
    timeout={300}
  >
    {(state) => (
        <FadeInContent state={state} style={style} {...props}>
          {children}
        </FadeInContent>
    )}
  </Transition>
);

export default FadeIn;