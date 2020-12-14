import Axios from 'axios';

const api = Axios.create({
  baseURL: 'http://hn.algolia.com/api/v1',
  timeout: 1000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);

export { api };
