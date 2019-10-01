import React from 'react';
import Style from './style';
import { Link } from 'react-router-dom';

const Header = () => (
  <div className='HeaderComponent' style={Style.header}>
    <Link to='/'>
      <img
        style={Style.logoImage}
        src='https://web-assets.waze.com/website/assets/packs/carpool_shared/components/download_app_banner/onboard-icon-a1c419955ec58908b5e8d3b405ec07df.svg'
        alt='Waze Logo'
      />
    </Link>
    Waze CarPool Vouchers
  </div>
);

export default Header;