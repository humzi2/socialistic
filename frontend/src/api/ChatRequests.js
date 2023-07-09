import axios from 'axios'
import {domain} from '../constants/constants'

const API = axios.create({ baseURL: domain });

export const createChat = (data) => API.post('/chat/', data);

export const userChats = (id) => API.get(`/chat/${id}`);

export const findChat = (firstId, secondId) => API.get(`/chat/find/${firstId}/${secondId}`);