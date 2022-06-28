import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

export const apiStrapi = axios.create({
  baseURL: "http://localhost:1337/api",
});
