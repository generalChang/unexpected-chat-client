import React from "react";
import {
  AUTH_USER,
  EMAIL_CERTIFICATION,
  GET_USER,
  LOGIN_USER,
  RESET_PASSWORD,
  SET_TMP_PASSWORD,
  UPDATE_PASSWORD,
  USER_LOGOUT,
  USER_REGISTER,
} from "../_actions/types";

export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return { ...state, ...action.payload };
      break;
    case USER_REGISTER:
      return { ...state, ...action.payload };
      break;
    case AUTH_USER:
      return { ...state, userData: action.payload };
      break;
    case USER_LOGOUT:
      return { ...state, ...action.payload };
      break;
    case EMAIL_CERTIFICATION:
      return { ...state, ...action.payload };
      break;
    case RESET_PASSWORD:
      return { ...state, ...action.payload };
      break;
    case UPDATE_PASSWORD:
      return { ...state, ...action.payload };
      break;
    case SET_TMP_PASSWORD:
      return { ...state, ...action.payload };
      break;
    case GET_USER:
      return {...state, }
    default:
      return { ...state };
      break;
  }
}
