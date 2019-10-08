import React from 'react';
import styled from 'styled-components';
import { Transition } from "react-transition-group"

const PopUpContent = styled.span`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: transform 300ms ease-in-out;
  transform: ${({ state }) => (state === "entering" || state === "entered" || state === "exiting" ? 'translate(0,0)' : 'translate(0,100%)')};
  z-index: 3;

  .alert {
    border-radius: 0;
  }
`;

const PopUp = ({show, children, style, ...props}) => (
  <Transition
    in={show}
    timeout={0}
  >
    {(state) => (
        <PopUpContent state={state} style={style} {...props}>
          {children}
        </PopUpContent>
    )}
  </Transition>
);

export {
  PopUp
};