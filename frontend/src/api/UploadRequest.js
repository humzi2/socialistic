import axios from "axios";
import { domain } from "../constants/constants";

const API = axios.create({ baseURL: domain});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.Authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }

  return req;
});

export const uploadImage = (data) => API.post("/upload/", data);
export const uploadVideo = (data) => API.post("/upload/", data);
export const uploadPost = (data) => API.post("/posts", data);
export const uploadComment = (data) => API.post("/comments", data);
