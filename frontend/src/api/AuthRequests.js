import axios from 'axios';
import { domain } from '../constants/constants';

const API = axios.create({ baseURL: domain });

export const logIn = (formData) => API.post('/auth/login',formData);

export const signUp = (formData) => API.post('/auth/register',formData);




