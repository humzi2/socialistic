import axios from 'axios'
import { domain } from '../constants/constants';


const API = axios.create({ baseURL: domain });

export const getMessages = (id) => API.get(`/message/${id}`);

export const addMessage = (data) => API.post('/message/', data);