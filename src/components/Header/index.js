import React from 'react';
import Style from './style';
import { Link } from 'react-router-dom';
import Icon, { IconAndText } from 'src/components/Icon';

const Header = (props) => (
  <div className='HeaderComponent' style={Style.header}>
    <Link to='/'>
      <img
        style={Style.logoImage}
        src='/public/fritz.png'
        alt='WazeCarpool Fritz Logo'
      />
    </Link>
    <IconAndText noMargin>
      {props.displayName ?
        <span>
          {props.displayName}&nbsp;
          <span style={{cursor: 'pointer'}} onClick={props.onClickExitButton}>(Sair)</span>
        </span>
        
        :
      'Waze CarPool Vouchers'}
      {props.showMenu && <Icon style={{marginLeft: '10px', cursor: 'pointer'}} onClick={() => props.toggleDrawer()}>menu</Icon>}
    </IconAndText>
    </div>
);

Header.defaultProps = {
  toggleDrawer: () => {}
}


export default Header;