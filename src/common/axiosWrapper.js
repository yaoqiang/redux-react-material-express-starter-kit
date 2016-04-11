import axios from 'axios';

import cookie from 'react-cookie';

// import confg from '../config';

// const axiosWrapper = axios.create({
//   baseURL: 'http://' + confg.host + ':' + confg.port + '/api/',
//   timeout: 1000,
//   headers: {'X-TOKEN': 'admin'}
// });

const axiosWrapper = axios.create({
  baseURL: '/api/',
  timeout: 1000,
  headers: {'X-TOKEN': cookie.load('X-TOKEN')}
});


export default axiosWrapper;
