import React from 'react';
import styled from 'styled-components';
import { Transition } from "react-transition-group"

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.2);
  transition: opacity 300ms ease-in-out;
  z-index: ${({ state }) => (state === "entering" || state === "entered" || state === "exiting" ? '1' : '-1')};
  opacity: ${({ state }) => (state === "entering" || state === "entered" ? 1 : 0)};
`;

const ModalBackground = styled.div`
  overflow: auto;
  background: #fff;
  height: 100%;
  width: 100%;
  right: 0;
  z-index: 3;
  position: fixed;
  top: 0;
  box-shadow: 0px 0 20px #666;
  transition: transform 300ms ease-in-out;
  transform: translateX( ${({ state }) => (state === "entering" || state === "entered" ? 0 : 110)}% );
  padding: 20px;

  @media (min-width: 900px) {
    width: 50%;
  }
`;

const Modal = ({isModalOpened, toggleModal, children, style, ...props}) => (
  <Transition
    in={isModalOpened}
    timeout={500}
  >
    {(state) => (
      <React.Fragment>
        <Overlay state={state} onClick={toggleModal} />
        <ModalBackground state={state} style={style}>
          {children}
        </ModalBackground>
      </React.Fragment>
    )}
  </Transition>
);

export default Modal;