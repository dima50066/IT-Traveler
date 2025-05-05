import axios from 'axios';

export const clientFetch = axios.create({
  baseURL: 'http://localhost:3000'
});
