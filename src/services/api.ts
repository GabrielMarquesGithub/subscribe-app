import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
});

export const apiStrapi = axios.create({
  baseURL: process.env.STRAPI_API_URL,
});
