import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://api-finans.herokuapp.com'
});

export default axiosInstance;