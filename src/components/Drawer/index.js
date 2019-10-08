import React from 'react';
import Modal from '../Modal';
import Icon from '../Icon';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import theme from 'src/theme';

const DrawerLink = styled(Link)`
  text-decoration: none;
  padding: 2px 40px;
  display: block;
  color: ${theme.colors.gray1}
  fontSize: 20px;
`;

const Drawer = ({children, ...props}) => (
  <Modal {...props} width={'30%'}>
    <Icon onClick={() => props.toggleModal()} style={{marginBottom: '20px'}}>close</Icon>
    <div>
      {children}
    </div>
  </Modal>
); 

export default Drawer;
export { DrawerLink };