import axios from 'axios';
import {
	LOGIN_USER_SUCCESS,
	LOGIN_USER_FAILURE,
	LOGIN_USER_REQUEST,
	LOGOUT_USER,
	GET_DS_SUCCESS,
	GET_DS_FAILURE,
	GET_DS_REQUEST
} from './actionConst';
import { apiURL } from '../utils/constants';

axios.defaults.baseURL = apiURL;
axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers['Authorization'] = localStorage.getItem('token');

function loginUserSuccess(token, redirect, usrid, convid) {
	return {
		type: LOGIN_USER_SUCCESS,
		payload: { token, redirect, usrid, convid }
	};
}

function loginUserFailure(error) {
	return {
		type: LOGIN_USER_FAILURE,
		payload: {
			status: error.response.status,
			statusText: error.response.statusText
		}
	};
}

function loginUserRequest() {
	return {
		type: LOGIN_USER_REQUEST
	};
}

function logoutUserRequest() {
	return {
		type: LOGOUT_USER
	};
}

function getDsSuccess(data_source) {
	return {
		type: GET_DS_SUCCESS,
		payload: { data_source }
	};
}

function getDsFailure(error) {
	return {
		type: GET_DS_FAILURE,
		payload: {
			status: error.response.status,
			statusText: error.response.statusText
		}
	};
}

function getDsRequest() {
	return {
		type: GET_DS_REQUEST
	};
}

export const loginUser = (email, password, history) => {
	return (dispatch) => {
		dispatch(loginUserRequest());

		return axios
			.post('/get_token', { email, password })
			.then((response) => response.data)
			.then((event) => {
				dispatch(loginUserSuccess(event.token, event.redirect, event.usrid, event.convid));
			})
			.catch((error) => dispatch(loginUserFailure(error)));
	};
};

export const logoutUser = () => {
	return (dispatch) => {
		dispatch(logoutUserRequest());
	};
};

export const getDs = () => {
	const path = `/getDataSource`;

	return (dispatch) => {
		dispatch(getDsRequest());
		return axios
			.get(path)
			.then((response) => response.data)
			.then((event) => {
				dispatch(getDsSuccess(event.data_source));
			})
			.catch((error) => dispatch(getDsFailure(error)));
	};
};
