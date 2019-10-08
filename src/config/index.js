const config = {
  BACKEND_URL: process.env.NODE_ENV === 'development' ?
    'http://localhost:3000' : 'http://waze-voucher.herokuapp.com',
}

export default config;