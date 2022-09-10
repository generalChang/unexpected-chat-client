import axios from "axios";
import React from "react";
import { API_USER, BASE_URL } from "../Config/config";
import {
  AUTH_USER,
  LOGIN_USER,
  USER_REGISTER,
  USER_LOGOUT,
  EMAIL_CERTIFICATION,
  RESET_PASSWORD,
  UPDATE_PASSWORD,
  SET_TMP_PASSWORD,
  GET_USER,
} from "./types";

export function login(body) {
  const request = axios
    .post(`${BASE_URL}/${API_USER}/login`, body, {
      withCredentials: true,
    })
    .then((result) => result.data);

  console.log(request);
  return {
    type: LOGIN_USER,
    payload: request,
  };
}

export function register(body) {
  const request = axios
    .post(`${BASE_URL}/${API_USER}/register`, body, {
      withCredentials: true,
    })
    .then((result) => result.data);

  return {
    type: USER_REGISTER,
    payload: request,
  };
}

export function auth() {
  const request = axios
    .get(`${BASE_URL}/${API_USER}/auth`, {
      withCredentials: true,
    })
    .then((result) => result.data);

  return {
    type: AUTH_USER,
    payload: request,
  };
}

export function logout() {
  const request = axios
    .get(`${BASE_URL}/${API_USER}/logout`, {
      withCredentials: true,
    })
    .then((result) => result.data);

  return {
    type: USER_LOGOUT,
    payload: request,
  };
}

export function emailCertificate(body) {
  const request = axios
    .post(`${BASE_URL}/${API_USER}/email/certificate`, body, {
      withCredentials: true,
    })
    .then((result) => result.data);

  return {
    type: EMAIL_CERTIFICATION,
    payload: request,
  };
}

export function resetPassword(body) {
  const request = axios
    .post(`${BASE_URL}/${API_USER}/resetPassword`, body, {
      withCredentials: true,
    })
    .then((result) => result.data);

  return {
    type: RESET_PASSWORD,
    payload: request,
  };
}

export function updatePassword(body) {
  const request = axios
    .post(`${BASE_URL}/${API_USER}/updatePassword`, body, {
      withCredentials: true,
    })
    .then((result) => result.data);

  return {
    type: UPDATE_PASSWORD,
    payload: request,
  };
}

export function setTmpPassword(body) {
  const request = axios
    .post(`${BASE_URL}/${API_USER}/setTmpPassword`, body, {
      withCredentials: true,
    })
    .then((result) => result.data);

  return {
    type: SET_TMP_PASSWORD,
    payload: request,
  };
}

export function getUser(body) {
  const request = axios
    .post(`${BASE_URL}/${API_USER}/user`, body, {
      withCredentials: true,
    })
    .then((result) => result.data);

  return {
    type: GET_USER,
    payload: request,
  };
}
